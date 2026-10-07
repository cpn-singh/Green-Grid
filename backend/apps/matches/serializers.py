from rest_framework import serializers
from .models import Match
from apps.supplier.serializers import SupplierProfileSerializer
from apps.dcbuilder.serializers import DCProfileSerializer

class MatchSerializer(serializers.ModelSerializer):
    supplier_profile = SupplierProfileSerializer(read_only=True)
    dc_profile = DCProfileSerializer(read_only=True)

    class Meta:
        model = Match
        fields = '__all__'
