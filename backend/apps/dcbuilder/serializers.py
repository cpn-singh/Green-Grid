from rest_framework import serializers
from .models import DCProfile, DCAnalysis

class DCAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = DCAnalysis
        fields = '__all__'

class DCProfileSerializer(serializers.ModelSerializer):
    analysis = DCAnalysisSerializer(read_only=True)

    class Meta:
        model = DCProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
