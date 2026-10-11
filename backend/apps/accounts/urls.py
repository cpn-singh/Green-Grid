from django.urls import path
from .views import RegisterView, LoginView, LogoutView, MeView, ContactInquiryView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('contact/', ContactInquiryView.as_view(), name='contact_inquiry'),
]
