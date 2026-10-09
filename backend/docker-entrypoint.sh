#!/bin/sh
set -e

echo "==> Applying database migrations..."
python manage.py migrate --noinput

echo "==> Collecting static assets..."
python manage.py collectstatic --noinput

echo "==> Checking seed data..."
python -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'greengrid.settings')
django.setup()
from apps.supplier.models import SupplierProfile
if SupplierProfile.objects.count() == 0:
    print('==> Seeding clean database with renewable energy infrastructure...')
    import seed_all_infrastructure
    print('==> Seeding complete!')
else:
    print(f'==> Database already populated ({SupplierProfile.objects.count()} suppliers).')
" || true

echo "==> Starting Daphne ASGI server..."
exec "$@"
