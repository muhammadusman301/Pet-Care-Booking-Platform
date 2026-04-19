from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PetViewSet, BookingViewSet, UserViewSet, 
    InvoiceViewSet, ReviewViewSet, ServiceListingViewSet, 
    UserProfileViewSet, MessageViewSet,
    UserRegistrationView, CurrentUserView
)

router = DefaultRouter()
router.register(r'profiles', UserProfileViewSet, basename='profile')
router.register(r'pets', PetViewSet, basename='pet')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'providers', UserViewSet, basename='provider')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'services', ServiceListingViewSet, basename='service')
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
]
