from rest_framework import serializers
from .models import SupplierProfile

class SupplierProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierProfile
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
