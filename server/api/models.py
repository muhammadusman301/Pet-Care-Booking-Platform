from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default="No bio provided yet.")
    location = models.CharField(max_length=150, blank=True, default="United Kingdom")
    phone = models.CharField(max_length=20, blank=True)
    profile_image_url = models.TextField(blank=True, default="")
    years_experience = models.IntegerField(default=0)
    certifications = models.TextField(blank=True)
    service_radius = models.IntegerField(default=5)
    property_type = models.CharField(max_length=100, blank=True)
    emergency_contact = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return f"Profile: {self.user.username}"

class Pet(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    pet_photo_url = models.TextField(blank=True, default="")
    pet_type = models.CharField(max_length=50, default="Dog")
    breed = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=20, default="Male")
    neutered = models.BooleanField(default=False)
    age = models.IntegerField(default=1)
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    microchipped = models.BooleanField(default=False)
    microchip_number = models.CharField(max_length=100, blank=True)
    colour = models.CharField(max_length=100, blank=True)
    vet_clinic_name = models.CharField(max_length=200, blank=True)
    vet_contact_number = models.CharField(max_length=50, blank=True)
    vaccination_status = models.CharField(max_length=50, default="Up to date")
    flea_treatment = models.BooleanField(default=True)
    worm_treatment = models.BooleanField(default=True)
    medical_conditions = models.TextField(blank=True)
    current_medications = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    special_care_notes = models.TextField(blank=True)
    temperament = models.CharField(max_length=100, default="Friendly")
    good_with_children = models.CharField(max_length=50, default="Yes")
    good_with_dogs = models.CharField(max_length=50, default="Yes")
    good_with_cats = models.CharField(max_length=50, default="Unknown")
    separation_anxiety = models.BooleanField(default=False)
    barking_level = models.CharField(max_length=50, default="Medium")
    bite_history = models.BooleanField(default=False)
    escape_risk = models.BooleanField(default=False)
    triggers = models.TextField(blank=True)
    feeding_schedule = models.CharField(max_length=100, blank=True)
    food_brand = models.CharField(max_length=100, blank=True)
    allowed_treats = models.TextField(blank=True)
    walk_frequency = models.CharField(max_length=50, blank=True)
    walk_duration = models.CharField(max_length=50, blank=True)
    toilet_routine = models.TextField(blank=True)
    sleep_routine = models.TextField(blank=True)
    favourite_activities = models.TextField(blank=True)
    coat_type = models.CharField(max_length=50, blank=True)
    grooming_frequency = models.CharField(max_length=50, blank=True)
    sensitive_areas = models.TextField(blank=True)
    nail_trim_friendly = models.BooleanField(default=True)
    bath_friendly = models.BooleanField(default=True)
    dryer_friendly = models.BooleanField(default=True)
    house_trained = models.BooleanField(default=True)
    leash_trained = models.BooleanField(default=True)
    basic_commands = models.TextField(blank=True)
    recall_reliable = models.BooleanField(default=True)
    required_service_type = models.CharField(max_length=100, blank=True)
    frequency_needed = models.CharField(max_length=50, blank=True)
    budget_range = models.CharField(max_length=50, blank=True)
    provider_can_enter_home = models.BooleanField(default=False)
    house_access_method = models.CharField(max_length=100, blank=True)
    cctv_present = models.BooleanField(default=False)
    other_pets_in_home = models.BooleanField(default=False)
    other_pets_details = models.TextField(blank=True)
    emergency_vet_auth = models.BooleanField(default=False)
    spending_limit = models.IntegerField(default=0)
    backup_emergency_contact = models.CharField(max_length=150, blank=True)
    vaccination_card_url = models.URLField(blank=True)
    insurance_provider = models.CharField(max_length=150, blank=True)
    owner_instructions = models.TextField(blank=True)
    dangerous_dog_breed = models.BooleanField(default=False)
    consent_verified = models.BooleanField(default=False)

class ServiceListing(models.Model):
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='services')
    legal_name = models.CharField(max_length=150, blank=True)
    business_name = models.CharField(max_length=150, blank=True)
    cover_image_url = models.TextField(blank=True, default="")
    gender = models.CharField(max_length=50, blank=True)
    dob = models.CharField(max_length=50, blank=True)
    nationality = models.CharField(max_length=50, blank=True)
    mobile = models.CharField(max_length=50, blank=True)
    gig_email = models.CharField(max_length=150, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    service_radius = models.CharField(max_length=50, blank=True)
    provider_type = models.CharField(max_length=100, blank=True)
    service_type = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    qualifications = models.TextField(blank=True)
    rcvs_number = models.CharField(max_length=100, blank=True)
    company_number = models.CharField(max_length=100, blank=True)
    dbs_check = models.CharField(max_length=50, blank=True, default="No")
    insurance_type = models.CharField(max_length=200, blank=True)
    years_experience = models.IntegerField(default=0)
    pets_served = models.IntegerField(default=0)
    breeds_experienced = models.TextField(blank=True)
    special_needs_experienced = models.TextField(blank=True)
    specific_services = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    basic_package = models.TextField(blank=True)
    standard_package = models.TextField(blank=True)
    premium_package = models.TextField(blank=True)
    addons = models.TextField(blank=True)
    working_days = models.CharField(max_length=200, blank=True)
    time_slots = models.CharField(max_length=200, blank=True)
    emergency_available = models.BooleanField(default=False)
    same_day_booking = models.BooleanField(default=False)
    delivery_mode = models.CharField(max_length=200, blank=True)
    country = models.CharField(max_length=100, blank=True, default="England")
    accepted_pet_types = models.TextField(blank=True)
    breed_restrictions = models.TextField(blank=True)
    emergency_handling_plan = models.TextField(blank=True)
    safety_hygiene_standards = models.TextField(blank=True)
    media_gallery_urls = models.TextField(blank=True)
    faqs = models.TextField(blank=True)
    cancellation_policy = models.CharField(max_length=200, blank=True, default="Flexible")
    languages_spoken = models.CharField(max_length=200, blank=True, default="English")
    consent_verified = models.BooleanField(default=False)
    max_pets = models.IntegerField(default=1)
    accepted_sizes = models.CharField(max_length=100, default="All Sizes")
    accepted_ages = models.CharField(max_length=100, default="All Ages")
    oral_medication = models.BooleanField(default=False)
    injected_medication = models.BooleanField(default=False)
    cpr_trained = models.BooleanField(default=False)
    special_needs = models.BooleanField(default=False)
    home_type = models.CharField(max_length=50, default="House")
    yard_type = models.CharField(max_length=50, default="Fenced Yard")
    has_resident_pets = models.BooleanField(default=False)
    has_children = models.BooleanField(default=False)
    smoker_in_home = models.BooleanField(default=False)
    supervision_level = models.CharField(max_length=100, default="Standard (Check every 4-6 hours)")
    sleeping_arrangement = models.CharField(max_length=100, default="Anywhere")
    photo_updates = models.BooleanField(default=True)
    transportation = models.BooleanField(default=False)

class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending Approval'),
        ('Accepted', 'Accepted (Needs Scheduling)'),
        ('Time Proposed', 'Time Proposed by Owner'),
        ('Time Rejected', 'Proposed Time Rejected'), # NEW STATUS FOR NEGOTIATION
        ('Scheduled', 'Scheduled & Confirmed'),
        ('Completed', 'Service Completed'),
        ('Declined', 'Declined by Provider'),
    ]
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    provider = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    service_date = models.DateField(null=True, blank=True)
    time_slot = models.CharField(max_length=50, default='TBD', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    def clean(self):
        if self.status == 'Scheduled' and self.service_date and self.time_slot != 'TBD':
            conflict = Booking.objects.filter(
                provider=self.provider, service_date=self.service_date, 
                time_slot=self.time_slot, status='Scheduled'
            ).exclude(pk=self.pk).exists()
            if conflict: raise ValidationError("Schedule Conflict detected.")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Invoice(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='invoice')
    amount = models.DecimalField(max_digits=6, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    issued_date = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review')
    rating = models.IntegerField() 
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    booking_context = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

class Review(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    reviewee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    rating = models.IntegerField() 
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('booking', 'reviewer') # Ensures 1 review per person per booking
