from django.db import models
from django.conf import settings

class DCProfile(models.Model):
    TIER_CHOICES = [
        ('tier3', 'Tier III'),
        ('tier4', 'Tier IV'),
    ]
    COOLING_CHOICES = [
        ('liquid', 'Liquid Cooling (Direct-to-Chip / Immersion)'),
        ('air', 'Precision Air Cooling (CRAH/CRAC)'),
        ('hybrid', 'Hybrid Evaporative / Liquid'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='dc_profile', null=True, blank=True)
    project_name = models.CharField(max_length=200, default='New Green DC Project')
    preferred_city = models.CharField(max_length=100, default='Mumbai')
    preferred_state = models.CharField(max_length=100, default='Maharashtra')
    latitude = models.FloatField(null=True, blank=True, default=19.0760)
    longitude = models.FloatField(null=True, blank=True, default=72.8777)
    tier = models.CharField(max_length=10, choices=TIER_CHOICES, default='tier3')
    it_load_mw = models.FloatField(default=10.0)           # Total IT load in MW
    server_types = models.JSONField(default=list)          # ['HPC/AI', 'Standard Cloud', 'Edge']
    cooling_type = models.CharField(max_length=20, choices=COOLING_CHOICES, default='liquid')
    target_pue = models.FloatField(default=1.35)           # 1.15 – 2.0
    green_goal_pct = models.IntegerField(default=100)      # % renewable target
    sourcing_models = models.JSONField(default=list)       # ['Physical PPA', 'Open Access', 'RTC/FDRE']
    budget_inr_cr = models.JSONField(default=dict)         # {"min": 15, "max": 60}
    launch_timeline = models.CharField(max_length=50, default='Q4 2026')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.project_name} ({self.it_load_mw} MW) - {self.preferred_city}"

class DCAnalysis(models.Model):
    dc_profile = models.OneToOneField(DCProfile, on_delete=models.CASCADE, related_name='analysis')
    estimated_annual_mwh = models.FloatField()
    peak_demand_mw = models.FloatField()
    renewable_needed_mw = models.FloatField()
    cooling_overhead_pct = models.FloatField(default=25.0)
    recommended_sourcing_models = models.JSONField(default=list)
    preferred_energy_types = models.JSONField(default=list)
    location_scores = models.JSONField(default=dict)
    reasoning = models.TextField(blank=True)
    raw_ai_response = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Analysis for {self.dc_profile.project_name}"
