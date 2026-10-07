from django.db import models
from django.conf import settings

class SupplierProfile(models.Model):
    CATEGORY_CHOICES = [
        ('ipp', 'Utility Hyperscale IPP'),
        ('ci', 'Commercial & Industrial (C&I) Specialist'),
        ('epc', 'EPC & Component Contractor'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='supplier_profile', null=True, blank=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='ipp')
    capacity_mw = models.FloatField(default=1000.0)
    available_capacity_mw = models.FloatField(default=300.0)
    energy_types = models.JSONField(default=list)           # ['Solar', 'Wind', 'BESS', 'Pumped Hydro']
    sourcing_models = models.JSONField(default=list)        # ['Physical PPA', 'vPPA', 'RTC/FDRE', 'Open Access']
    states_covered = models.JSONField(default=list)         # ['Maharashtra', 'Gujarat', 'Rajasthan']
    min_contract_years = models.IntegerField(default=10)
    price_per_unit_inr = models.JSONField(default=dict)     # {"min": 3.8, "max": 4.9}
    rtc_availability_pct = models.IntegerField(default=80)  # % round-the-clock coverage
    website = models.URLField(blank=True)
    latitude = models.FloatField(default=19.0760)
    longitude = models.FloatField(default=72.8777)
    is_verified = models.BooleanField(default=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.category.upper()}) - {self.capacity_mw} MW"
