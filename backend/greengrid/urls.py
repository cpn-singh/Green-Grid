from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/dc/', include('apps.dcbuilder.urls')),
    path('api/supplier/', include('apps.supplier.urls')),
    path('api/matches/', include('apps.matches.urls')),
    path('api/map/', include('apps.livemap.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
