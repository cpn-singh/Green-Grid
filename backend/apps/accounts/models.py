from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('dc_builder', 'Data Center Builder'),
        ('energy_supplier', 'Energy Supplier'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='dc_builder')
    company_name = models.CharField(max_length=200, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    profile_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role}) - {self.company_name or 'No Company'}"
