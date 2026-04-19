from rest_framework import serializers
from django.contrib.auth.models import User
from django.db.models import Avg
from .models import Pet, Booking, Invoice, ServiceListing, Review, UserProfile, Message

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'location', 'phone', 'profile_image_url', 'years_experience', 'certifications', 'service_radius', 'property_type', 'emergency_contact']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class PetSerializer(serializers.ModelSerializer):
    owner_id = serializers.ReadOnlyField(source='owner.id')
    class Meta:
        model = Pet
        fields = '__all__'
        read_only_fields = ['owner']

class ServiceListingSerializer(serializers.ModelSerializer):
    provider_name = serializers.ReadOnlyField(source='provider.username')
    provider_location = serializers.ReadOnlyField(source='provider.profile.location')
    provider_experience = serializers.ReadOnlyField(source='provider.profile.years_experience')
    provider_avatar = serializers.ReadOnlyField(source='provider.profile.profile_image_url')
    provider_bio = serializers.ReadOnlyField(source='provider.profile.bio')
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = ServiceListing
        fields = '__all__'
        read_only_fields = ['provider']

    def get_average_rating(self, obj):
        reviews = Review.objects.filter(booking__provider=obj.provider, reviewee=obj.provider)
        if reviews.exists():
            return round(reviews.aggregate(Avg('rating'))['rating__avg'], 1)
        return "New"

class BookingSerializer(serializers.ModelSerializer):
    pet_name = serializers.ReadOnlyField(source='pet.name')
    provider_name = serializers.ReadOnlyField(source='provider.username')
    provider_avatar = serializers.ReadOnlyField(source='provider.profile.profile_image_url')
    provider_location = serializers.ReadOnlyField(source='provider.profile.location')
    provider_bio = serializers.ReadOnlyField(source='provider.profile.bio')
    owner_name = serializers.ReadOnlyField(source='pet.owner.username')
    owner_id = serializers.ReadOnlyField(source='pet.owner.id')
    owner_avatar = serializers.ReadOnlyField(source='pet.owner.profile.profile_image_url')
    owner_location = serializers.ReadOnlyField(source='pet.owner.profile.location')
    owner_bio = serializers.ReadOnlyField(source='pet.owner.profile.bio')
    pet_details = PetSerializer(source='pet', read_only=True) 
    
    class Meta:
        model = Booking
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    pet_name = serializers.ReadOnlyField(source='booking.pet.name')
    service_date = serializers.ReadOnlyField(source='booking.service_date')
    class Meta:
        model = Invoice
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.ReadOnlyField(source='reviewer.username')
    reviewee_name = serializers.ReadOnlyField(source='reviewee.username')
    reviewer_avatar = serializers.ReadOnlyField(source='reviewer.profile.profile_image_url')
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['reviewer']

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['sender']
