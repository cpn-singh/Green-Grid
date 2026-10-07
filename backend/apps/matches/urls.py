from django.urls import path
from .views import MatchListView, MatchDetailView, MatchActionView, PublicMatchesView

urlpatterns = [
    path('', MatchListView.as_view(), name='matches_list'),
    path('public/', PublicMatchesView.as_view(), name='public_matches'),
    path('<int:pk>/', MatchDetailView.as_view(), name='match_detail'),
    path('<int:pk>/<str:action>/', MatchActionView.as_view(), name='match_action'),
]
