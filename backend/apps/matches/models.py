from django.db import models
from apps.dcbuilder.models import DCProfile
from apps.supplier.models import SupplierProfile

class Match(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Match'),
        ('accepted', 'Accepted / Inquired'),
        ('rejected', 'Declined'),
        ('negotiating', 'In Active Negotiation'),
    ]

    dc_profile = models.ForeignKey(DCProfile, on_delete=models.CASCADE, related_name='matches')
    supplier_profile = models.ForeignKey(SupplierProfile, on_delete=models.CASCADE, related_name='matches')
    match_score = models.FloatField(default=0.0)
    ai_analysis = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-match_score']
        unique_together = ['dc_profile', 'supplier_profile']

    def __str__(self):
        return f"{self.dc_profile.project_name} <-> {self.supplier_profile.name} ({self.match_score}%)"
