from django.urls import path
from .views import MapMarkersView, MapStatsView

urlpatterns = [
    path('markers/', MapMarkersView.as_view(), name='map_markers'),
    path('stats/', MapStatsView.as_view(), name='map_stats'),
]
