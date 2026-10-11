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


class ContactInquiry(models.Model):
    ticket_id = models.CharField(max_length=32, unique=True, db_index=True)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    organization = models.CharField(max_length=200, blank=True)
    inquiry_type = models.CharField(max_length=100)
    message = models.TextField()
    status = models.CharField(
        max_length=30,
        choices=[
            ('new', 'New'),
            ('contacted', 'Contacted'),
            ('in_progress', 'In Progress'),
            ('resolved', 'Resolved'),
        ],
        default='new'
    )
    notes = models.TextField(blank=True, help_text="Internal notes for operations team")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Inquiry'
        verbose_name_plural = 'Contact Inquiries'

    def __str__(self):
        return f"[{self.ticket_id}] {self.name} - {self.inquiry_type}"

