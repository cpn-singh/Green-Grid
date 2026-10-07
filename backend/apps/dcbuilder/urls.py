from django.urls import path
from .views import DCProfileView, DCAnalysisView

urlpatterns = [
    path('profile/', DCProfileView.as_view(), name='dc_profile'),
    path('analysis/', DCAnalysisView.as_view(), name='dc_analysis'),
]
