from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/dc/', include('apps.dcbuilder.urls')),
    path('api/supplier/', include('apps.supplier.urls')),
    path('api/matches/', include('apps.matches.urls')),
    path('api/map/', include('apps.livemap.urls')),
]
