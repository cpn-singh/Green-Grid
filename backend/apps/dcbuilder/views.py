from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import DCProfile, DCAnalysis
from .serializers import DCProfileSerializer, DCAnalysisSerializer
from services.energy_calculator import calculate_energy_requirements
from apps.supplier.models import SupplierProfile
from apps.matches.models import Match
from services.matchmaker import get_ai_match_analysis, calculate_rule_match_score

class DCProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = DCProfile.objects.get(user=request.user)
            serializer = DCProfileSerializer(profile)
            return Response(serializer.data)
        except DCProfile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        profile, created = DCProfile.objects.get_or_create(user=request.user)
        serializer = DCProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            saved_profile = serializer.save()

            # Trigger energy requirements calculation
            dc_dict = {
                "it_load_mw": saved_profile.it_load_mw,
                "tier": saved_profile.tier,
                "cooling_type": saved_profile.cooling_type,
                "target_pue": saved_profile.target_pue,
                "green_goal_pct": saved_profile.green_goal_pct,
                "preferred_city": saved_profile.preferred_city,
                "preferred_state": saved_profile.preferred_state,
                "server_types": saved_profile.server_types,
                "sourcing_models": saved_profile.sourcing_models,
            }

            analysis_data = calculate_energy_requirements(dc_dict)

            DCAnalysis.objects.update_or_create(
                dc_profile=saved_profile,
                defaults={
                    "estimated_annual_mwh": analysis_data.get("estimated_annual_mwh", 120000),
                    "peak_demand_mw": analysis_data.get("peak_demand_mw", 15),
                    "renewable_needed_mw": analysis_data.get("renewable_needed_mw", 13.5),
                    "cooling_overhead_pct": analysis_data.get("cooling_overhead_pct", 35.0),
                    "recommended_sourcing_models": analysis_data.get("recommended_sourcing_models", []),
                    "preferred_energy_types": analysis_data.get("preferred_energy_types", []),
                    "location_scores": analysis_data.get("location_scores", {}),
                    "reasoning": analysis_data.get("reasoning", ""),
                    "raw_ai_response": analysis_data,
                }
            )

            # Auto-calculate and create matches against all existing suppliers
            suppliers = SupplierProfile.objects.all()
            for sup in suppliers:
                sup_dict = {
                    "name": sup.name,
                    "category": sup.category,
                    "capacity_mw": sup.capacity_mw,
                    "available_capacity_mw": sup.available_capacity_mw,
                    "energy_types": sup.energy_types,
                    "sourcing_models": sup.sourcing_models,
                    "states_covered": sup.states_covered,
                    "price_per_unit_inr": sup.price_per_unit_inr,
                    "rtc_availability_pct": sup.rtc_availability_pct,
                }
                match_analysis = get_ai_match_analysis(dc_dict, sup_dict)
                score = match_analysis.get('match_score', 80.0)

                Match.objects.update_or_create(
                    dc_profile=saved_profile,
                    supplier_profile=sup,
                    defaults={
                        "match_score": score,
                        "ai_analysis": match_analysis,
                    }
                )

            request.user.profile_complete = True
            request.user.save()

            full_profile = DCProfile.objects.get(id=saved_profile.id)
            return Response(DCProfileSerializer(full_profile).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DCAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = DCProfile.objects.get(user=request.user)
            analysis = DCAnalysis.objects.get(dc_profile=profile)
            serializer = DCAnalysisSerializer(analysis)
            return Response(serializer.data)
        except (DCProfile.DoesNotExist, DCAnalysis.DoesNotExist):
            return Response({"detail": "Analysis not found"}, status=status.HTTP_404_NOT_FOUND)
