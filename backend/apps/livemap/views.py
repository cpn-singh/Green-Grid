from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.supplier.models import SupplierProfile
from apps.dcbuilder.models import DCProfile
from apps.matches.models import Match

class MapMarkersView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        suppliers = SupplierProfile.objects.all()
        dcs = DCProfile.objects.all()

        supplier_markers = [
            {
                "id": f"sup_{s.id}",
                "name": s.name,
                "category": s.category,
                "type": "supplier",
                "lat": s.latitude,
                "lng": s.longitude,
                "capacity_mw": s.capacity_mw,
                "available_capacity_mw": s.available_capacity_mw,
                "energy_types": s.energy_types,
                "sourcing_models": s.sourcing_models,
                "states": s.states_covered,
                "rtc_pct": s.rtc_availability_pct,
                "description": s.description
            }
            for s in suppliers
        ]

        dc_markers = [
            {
                "id": f"dc_{d.id}",
                "name": d.project_name,
                "type": "dc",
                "city": d.preferred_city,
                "state": d.preferred_state,
                "lat": d.latitude or 19.0760,
                "lng": d.longitude or 72.8777,
                "it_load_mw": d.it_load_mw,
                "cooling": d.cooling_type,
                "pue": d.target_pue,
                "tier": d.tier,
                "timeline": d.launch_timeline,
                "server_types": d.server_types,
                "sourcing_models": d.sourcing_models,
                "green_goal_pct": d.green_goal_pct
            }
            for d in dcs
        ]

        # Connected match lines
        matches = Match.objects.filter(match_score__gte=75.0)
        match_lines = [
            {
                "id": m.id,
                "score": m.match_score,
                "status": m.status,
                "from": {"name": m.supplier_profile.name, "lat": m.supplier_profile.latitude, "lng": m.supplier_profile.longitude},
                "to": {"name": m.dc_profile.project_name, "lat": m.dc_profile.latitude, "lng": m.dc_profile.longitude}
            }
            for m in matches
        ]

        return Response({
            "suppliers": supplier_markers,
            "data_centers": dc_markers,
            "match_lines": match_lines
        })

class MapStatsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        total_suppliers = SupplierProfile.objects.count()
        total_dcs = DCProfile.objects.count()
        total_matches = Match.objects.count()
        total_mw = sum(s.capacity_mw for s in SupplierProfile.objects.all())

        return Response({
            "total_suppliers": total_suppliers,
            "total_dcs": total_dcs,
            "total_matches": total_matches,
            "total_capacity_mw": total_mw,
            "clean_energy_gw": round(total_mw / 1000.0, 1),
            "co2_avoided_tons": round(total_mw * 8760 * 0.82 / 1000, 1) # k-tons
        })
