from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Match
from .serializers import MatchSerializer
from apps.dcbuilder.models import DCProfile
from apps.supplier.models import SupplierProfile

class MatchListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'dc_builder':
            try:
                dc = DCProfile.objects.get(user=user)
                matches = Match.objects.filter(dc_profile=dc)
            except DCProfile.DoesNotExist:
                matches = Match.objects.none()
        else:
            try:
                sup = SupplierProfile.objects.get(user=user)
                matches = Match.objects.filter(supplier_profile=sup)
            except SupplierProfile.DoesNotExist:
                matches = Match.objects.none()

        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

class MatchDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            match = Match.objects.get(pk=pk)
            return Response(MatchSerializer(match).data)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

class MatchActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk, action):
        try:
            match = Match.objects.get(pk=pk)
            if action == 'accept':
                match.status = 'accepted'
            elif action == 'reject':
                match.status = 'rejected'
            elif action == 'negotiate':
                match.status = 'negotiating'
            match.save()
            return Response(MatchSerializer(match).data)
        except Match.DoesNotExist:
            return Response({"detail": "Match not found"}, status=status.HTTP_404_NOT_FOUND)

class PublicMatchesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        matches = Match.objects.filter(match_score__gte=80.0)[:10]
        return Response(MatchSerializer(matches, many=True).data)
