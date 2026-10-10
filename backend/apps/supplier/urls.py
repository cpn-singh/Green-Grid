from django.urls import path
from .views import SupplierProfileView, PublicSupplierListView, SupplierMatchesView, SupplierDashboardView

urlpatterns = [
    path('profile/', SupplierProfileView.as_view(), name='supplier_profile'),
    path('public/', PublicSupplierListView.as_view(), name='public_suppliers'),
    path('matches/', SupplierMatchesView.as_view(), name='supplier_matches'),
    path('dashboard/', SupplierDashboardView.as_view(), name='supplier_dashboard'),
]

