from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SupplierProfile
from .serializers import SupplierProfileSerializer
from apps.matches.models import Match
from apps.dcbuilder.models import DCProfile
from services.matchmaker import get_ai_match_analysis

class SupplierProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = SupplierProfile.objects.get(user=request.user)
            serializer = SupplierProfileSerializer(profile)
            return Response(serializer.data)
        except SupplierProfile.DoesNotExist:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        profile, created = SupplierProfile.objects.get_or_create(user=request.user)
        serializer = SupplierProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            saved_profile = serializer.save()

            # Recalculate matches against existing DC profiles
            dc_profiles = DCProfile.objects.all()
            for dc in dc_profiles:
                dc_dict = {
                    "it_load_mw": dc.it_load_mw,
                    "tier": dc.tier,
                    "cooling_type": dc.cooling_type,
                    "target_pue": dc.target_pue,
                    "green_goal_pct": dc.green_goal_pct,
                    "preferred_city": dc.preferred_city,
                    "preferred_state": dc.preferred_state,
                    "server_types": dc.server_types,
                    "sourcing_models": dc.sourcing_models,
                }
                sup_dict = {
                    "name": saved_profile.name,
                    "category": saved_profile.category,
                    "capacity_mw": saved_profile.capacity_mw,
                    "available_capacity_mw": saved_profile.available_capacity_mw,
                    "energy_types": saved_profile.energy_types,
                    "sourcing_models": saved_profile.sourcing_models,
                    "states_covered": saved_profile.states_covered,
                    "price_per_unit_inr": saved_profile.price_per_unit_inr,
                    "rtc_availability_pct": saved_profile.rtc_availability_pct,
                }
                match_analysis = get_ai_match_analysis(dc_dict, sup_dict)
                score = match_analysis.get('match_score', 80.0)

                Match.objects.update_or_create(
                    dc_profile=dc,
                    supplier_profile=saved_profile,
                    defaults={
                        "match_score": score,
                        "ai_analysis": match_analysis,
                    }
                )

            request.user.profile_complete = True
            request.user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PublicSupplierListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        suppliers = SupplierProfile.objects.all()
        serializer = SupplierProfileSerializer(suppliers, many=True)
        return Response(serializer.data)

class SupplierMatchesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = SupplierProfile.objects.get(user=request.user)
            matches = Match.objects.filter(supplier_profile=profile).order_by('-match_score')
            from apps.matches.serializers import MatchSerializer
            return Response(MatchSerializer(matches, many=True).data)
        except SupplierProfile.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

class SupplierDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = SupplierProfile.objects.get(user=request.user)
            matches = Match.objects.filter(supplier_profile=profile).order_by('-match_score')
            from apps.matches.serializers import MatchSerializer
            inquiries = matches.filter(status__in=['accepted', 'negotiating'])
            return Response({
                "profile": SupplierProfileSerializer(profile).data,
                "total_matches": matches.count(),
                "active_inquiries": inquiries.count(),
                "matches": MatchSerializer(matches[:10], many=True).data,
            })
        except SupplierProfile.DoesNotExist:
            return Response({"detail": "Supplier profile not found"}, status=status.HTTP_404_NOT_FOUND)

