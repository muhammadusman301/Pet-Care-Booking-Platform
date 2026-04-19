from rest_framework import viewsets, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User, Group
from django.db.models import Q
from .models import Pet, Booking, Invoice, ServiceListing, Review, UserProfile, Message
from .serializers import (
    PetSerializer, BookingSerializer, UserSerializer, 
    InvoiceSerializer, ServiceListingSerializer, ReviewSerializer, 
    UserProfileSerializer, MessageSerializer
)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return UserProfile.objects.filter(user=self.request.user)

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class PetViewSet(viewsets.ModelViewSet):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Pet.objects.filter(owner=self.request.user)
    def perform_create(self, serializer): serializer.save(owner=self.request.user)

class ServiceListingViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = ServiceListing.objects.all()
        location_query = self.request.query_params.get('location', None)
        if user.groups.filter(name='Providers').exists() and not location_query:
            return ServiceListing.objects.filter(provider=user)
        if location_query:
            queryset = queryset.filter(provider__profile__location__icontains=location_query)
        return queryset

    def perform_create(self, serializer):
        if ServiceListing.objects.filter(provider=self.request.user).count() >= 3:
            raise ValidationError({"detail": "Limit reached. You can only have a maximum of 3 active gigs."})
        serializer.save(provider=self.request.user)

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Providers').exists(): return Booking.objects.filter(provider=user).order_by('-id')
        return Booking.objects.filter(pet__owner=user).order_by('-id')
    
    def perform_update(self, serializer):
        booking = serializer.save()
        # ENTERPRISE UPGRADE: Only generate Invoice when Time is Approved & Scheduled
        if booking.status == 'Scheduled' and not hasattr(booking, 'invoice'):
            gig = ServiceListing.objects.filter(provider=booking.provider).first()
            final_price = gig.price if gig else 50.00
            Invoice.objects.create(booking=booking, amount=final_price)

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        if user.groups.filter(name='Providers').exists(): return Invoice.objects.filter(booking__provider=user)
        return Invoice.objects.filter(booking__pet__owner=user)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Review.objects.all()
    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Message.objects.filter(Q(sender=self.request.user) | Q(receiver=self.request.user)).order_by('timestamp')
    def perform_create(self, serializer): serializer.save(sender=self.request.user)
    @action(detail=False, methods=['post'])
    def mark_read(self, request):
        Message.objects.filter(booking_context_id=request.data.get('booking_context'), receiver=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'read'})

class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        if User.objects.filter(username=data.get('username')).exists():
            return Response({"error": "Username taken."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=data.get('username'), email=data.get('email'), password=data.get('password'))
        
        if data.get('role') == 'Provider':
            group, _ = Group.objects.get_or_create(name='Providers')
            user.groups.add(group)
            UserProfile.objects.create(
                user=user, location=data.get('location', 'UK'), bio=data.get('bio', ''),
                years_experience=data.get('years_experience', 0), certifications=data.get('certifications', '')
            )
        else:
            group, _ = Group.objects.get_or_create(name='Owners')
            user.groups.add(group)
            UserProfile.objects.create(user=user, location=data.get('location', 'UK'), bio="New member.")
            
        return Response({"message": "Provisioned Successfully"}, status=status.HTTP_201_CREATED)

class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        profile = user.profile
        return Response({
            "id": user.id, "username": user.username, "email": user.email, "is_provider": user.groups.filter(name='Providers').exists(),
            "location": profile.location, "phone": profile.phone, "bio": profile.bio, "profile_image_url": profile.profile_image_url, 
            "years_experience": profile.years_experience, "certifications": profile.certifications, "service_radius": profile.service_radius,
            "property_type": profile.property_type, "emergency_contact": profile.emergency_contact
        })
    def put(self, request):
        user = request.user
        profile = user.profile
        data = request.data
        if data.get('password'): user.set_password(data['password'])
        if 'email' in data: user.email = data['email']
        user.save() 
        if 'location' in data: profile.location = data['location']
        if 'phone' in data: profile.phone = data['phone']
        if 'bio' in data: profile.bio = data['bio']
        if 'profile_image_url' in data: profile.profile_image_url = data['profile_image_url']
        if 'years_experience' in data: profile.years_experience = data['years_experience']
        if 'certifications' in data: profile.certifications = data['certifications']
        if 'service_radius' in data: profile.service_radius = data['service_radius']
        if 'property_type' in data: profile.property_type = data['property_type']
        if 'emergency_contact' in data: profile.emergency_contact = data['emergency_contact']
        profile.save()
        return Response({"message": "Profile updated"})
