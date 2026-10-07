from django.urls import path
from .views import SupplierProfileView, PublicSupplierListView

urlpatterns = [
    path('profile/', SupplierProfileView.as_view(), name='supplier_profile'),
    path('public/', PublicSupplierListView.as_view(), name='public_suppliers'),
]
