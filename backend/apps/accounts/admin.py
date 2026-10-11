from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ContactInquiry

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'company_name', 'contact_phone', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'company_name']
    fieldsets = UserAdmin.fieldsets + (
        ('Platform Details', {'fields': ('role', 'company_name', 'contact_phone', 'profile_complete')}),
    )

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'name', 'email', 'phone', 'organization', 'inquiry_type', 'status', 'created_at']
    list_filter = ['status', 'inquiry_type', 'created_at']
    search_fields = ['ticket_id', 'name', 'email', 'organization', 'message']
    readonly_fields = ['ticket_id', 'created_at', 'updated_at']
    list_editable = ['status']
    ordering = ['-created_at']
