import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greengrid.settings')
django.setup()

from apps.supplier.models import SupplierProfile
from services.providers_data import ENERGY_PROVIDERS

print("Seeding verified renewable energy suppliers...")
count = 0
for data in ENERGY_PROVIDERS:
    obj, created = SupplierProfile.objects.update_or_create(
        name=data["name"],
        defaults={
            "category": data.get("category", "ipp"),
            "capacity_mw": data.get("capacity_mw", 1000.0),
            "available_capacity_mw": data.get("available_capacity_mw", 300.0),
            "energy_types": data.get("energy_types", ["Solar"]),
            "sourcing_models": data.get("sourcing_models", ["Physical PPA"]),
            "states_covered": data.get("states_covered", []),
            "min_contract_years": data.get("min_contract_years", 10),
            "price_per_unit_inr": data.get("price_per_unit_inr", {"min": 4.0, "max": 5.0}),
            "rtc_availability_pct": data.get("rtc_availability_pct", 75),
            "website": data.get("website", ""),
            "latitude": data.get("latitude", 19.0760),
            "longitude": data.get("longitude", 72.8777),
            "is_verified": data.get("is_verified", True),
            "description": data.get("description", ""),
        }
    )
    if created:
        count += 1

print(f"Successfully seeded {count} new energy providers. Total providers in DB: {SupplierProfile.objects.count()}")
