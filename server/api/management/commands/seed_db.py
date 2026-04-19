from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from api.models import UserProfile, Pet, ServiceListing

class Command(BaseCommand):
    help = 'Seeds the database with 5 Providers (3 Gigs each) and 2 Owners (5 Pets each) with Deep Details.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Clearing old test data...")
        
        # Define the exact usernames we are creating so we can wipe them cleanly if re-running
        usernames = [
            'sarah_vet', 'mark_groomer', 'emma_walker', 'david_trainer', 'chloe_sitter',
            'james_owner', 'olivia_owner'
        ]
        User.objects.filter(username__in=usernames).delete()

        # Create Groups
        provider_group, _ = Group.objects.get_or_create(name='Providers')
        owner_group, _ = Group.objects.get_or_create(name='Owners')

        password = '123' # Universal test password requested

        # ==========================================
        # HELPER TEMPLATES (Ensures EVERY field is populated)
        # ==========================================
        base_gig = {
            "cover_image_url": "", "gender": "Not Specified", "dob": "1990-01-01", "nationality": "British",
            "mobile": "+44 7700 900000", "gig_email": "contact@provider.co.uk", "address": "123 High Street",
            "city": "London", "postcode": "SW1A 1AA", "service_radius": "10 miles", "tagline": "Professional Pet Care",
            "description": "High-quality, reliable, and loving pet care services tailored to your best friend.",
            "qualifications": "Fully Insured, Canine First Aid", "rcvs_number": "", "company_number": "12345678",
            "dbs_check": "Yes", "insurance_type": "Public Liability & Professional Indemnity", "years_experience": 5,
            "pets_served": 150, "breeds_experienced": "All major breeds, mixed breeds, rescues", 
            "special_needs_experienced": "Anxiety, Senior Pets, Arthritis", "specific_services": "Standard Care",
            "price": 30.00, "basic_package": "Standard Service: £30", "standard_package": "Premium Service: £45",
            "premium_package": "VIP Service: £60", "addons": "Weekend booking +£10", "working_days": "Mon-Fri",
            "time_slots": "Morning / Afternoon", "emergency_available": False, "same_day_booking": False,
            "delivery_mode": "At Owner Home", "country": "England", "accepted_pet_types": "Dogs, Cats",
            "breed_restrictions": "No XL Bullies (per UK Law)", "emergency_handling_plan": "Immediate contact with owner and transfer to nearest registered vet.",
            "safety_hygiene_standards": "All tools sanitized. PPE worn when necessary.", "media_gallery_urls": "",
            "faqs": "Q: Are you insured? A: Yes, fully insured.", "cancellation_policy": "24 hours free cancellation",
            "languages_spoken": "English", "consent_verified": True, "max_pets": 2, "accepted_sizes": "All Sizes",
            "accepted_ages": "All Ages", "oral_medication": True, "injected_medication": False, "cpr_trained": True,
            "special_needs": True, "home_type": "House", "yard_type": "Fenced Yard", "has_resident_pets": False,
            "has_children": False, "smoker_in_home": False, "supervision_level": "Constant (Checked every 2 hours)",
            "sleeping_arrangement": "Indoors", "photo_updates": True, "transportation": False
        }

        base_pet = {
            "pet_photo_url": "", "neutered": True, "microchipped": True, "microchip_number": "981020000000000",
            "vet_clinic_name": "City Vets Clinic", "vet_contact_number": "020 7946 0000", "vaccination_status": "Up to date",
            "flea_treatment": True, "worm_treatment": True, "medical_conditions": "None", "current_medications": "None",
            "allergies": "None known", "special_care_notes": "Very friendly but gets excited easily.", "temperament": "Friendly",
            "good_with_children": "Yes", "good_with_dogs": "Yes", "good_with_cats": "Unknown", "separation_anxiety": False,
            "barking_level": "Low", "bite_history": False, "escape_risk": False, "triggers": "Loud noises (fireworks)",
            "feeding_schedule": "Morning and Evening", "food_brand": "Royal Canin", "allowed_treats": "Dental sticks, chicken bits",
            "walk_frequency": "2 per day", "walk_duration": "45 mins", "toilet_routine": "Outdoors", "sleep_routine": "Sleeps in own bed",
            "favourite_activities": "Fetch, Tug of war", "coat_type": "Short", "grooming_frequency": "Monthly",
            "sensitive_areas": "Paws", "nail_trim_friendly": True, "bath_friendly": True, "dryer_friendly": True,
            "house_trained": True, "leash_trained": True, "basic_commands": "Sit, Stay, Come", "recall_reliable": True,
            "required_service_type": "Walking / Sitting", "frequency_needed": "Weekly", "budget_range": "£20-£50",
            "provider_can_enter_home": True, "house_access_method": "Key safe at front door (Code: 1234)", "cctv_present": True,
            "other_pets_in_home": False, "other_pets_details": "", "emergency_vet_auth": True, "spending_limit": 150,
            "backup_emergency_contact": "John Doe - 07700 900 111", "vaccination_card_url": "", "insurance_provider": "PetPlan UK",
            "owner_instructions": "Please ensure doors are locked behind you.", "dangerous_dog_breed": False, "consent_verified": True
        }

        # ==========================================
        # 1. CREATE PROVIDERS & THEIR GIGS
        # ==========================================
        self.stdout.write("Creating 5 Providers with 3 Gigs each...")

        providers_data = [
            {"user": "sarah_vet", "type": "Veterinarian", "city": "London", "name": "Dr. Sarah Jenkins"},
            {"user": "mark_groomer", "type": "Pet Groomer", "city": "Manchester", "name": "Mark Davies"},
            {"user": "emma_walker", "type": "Dog Walker", "city": "Birmingham", "name": "Emma Smith"},
            {"user": "david_trainer", "type": "Trainer", "city": "Leeds", "name": "David Wilson"},
            {"user": "chloe_sitter", "type": "Pet Sitter", "city": "Bristol", "name": "Chloe Brown"}
        ]

        for p_data in providers_data:
            user = User.objects.create_user(username=p_data["user"], email=f'{p_data["user"]}@test.com', password=password)
            user.groups.add(provider_group)
            UserProfile.objects.create(
                user=user, location=f'{p_data["city"]}, UK', phone='+44 7700 900999', 
                bio=f'Professional {p_data["type"]} based in {p_data["city"]}. Dedicated to animal welfare.',
                profile_image_url="", years_experience=5, certifications='Fully Certified', service_radius=15
            )

            # Generate 3 Gigs for this provider
            for i in range(1, 4):
                gig_data = base_gig.copy()
                gig_data.update({
                    "provider": user,
                    "legal_name": p_data["name"],
                    "business_name": f"{p_data['name']} {p_data['type']} Services",
                    "city": p_data["city"],
                    "provider_type": p_data["type"],
                    "service_type": f"{p_data['type']} Service Package {i}",
                    "price": 20.00 + (i * 15.00),
                    "time_slots": ["Morning", "Afternoon", "Evening"][i-1]
                })
                
                # Custom overrides based on type
                if p_data["type"] == "Veterinarian":
                    gig_data.update({"rcvs_number": f"RCVS{i}000", "injected_medication": True})
                elif p_data["type"] == "Dog Walker":
                    gig_data.update({"delivery_mode": "Pick & Drop Included", "transportation": True})
                
                ServiceListing.objects.create(**gig_data)

        # ==========================================
        # 2. CREATE OWNERS & THEIR PETS
        # ==========================================
        self.stdout.write("Creating 2 Owners with 5 Pets each...")

        # --- Owner 1: James ---
        james = User.objects.create_user(username='james_owner', email='james@test.com', password=password)
        james.groups.add(owner_group)
        UserProfile.objects.create(user=james, location='London, UK', bio='Dog and cat lover.', profile_image_url="")

        james_pets = [
            {"name": "Max", "type": "Dog", "breed": "Golden Retriever", "weight": 32.0, "gender": "Male"},
            {"name": "Bella", "type": "Dog", "breed": "French Bulldog", "weight": 12.5, "gender": "Female"},
            {"name": "Charlie", "type": "Dog", "breed": "Border Collie", "weight": 22.0, "gender": "Male"},
            {"name": "Luna", "type": "Cat", "breed": "British Shorthair", "weight": 5.0, "gender": "Female"},
            {"name": "Milo", "type": "Cat", "breed": "Ragdoll", "weight": 6.5, "gender": "Male"}
        ]
        
        for p in james_pets:
            pet_data = base_pet.copy()
            pet_data.update({"owner": james, "name": p["name"], "pet_type": p["type"], "breed": p["breed"], "weight": p["weight"], "gender": p["gender"]})
            if p["type"] == "Cat":
                pet_data.update({"walk_frequency": "N/A", "walk_duration": "N/A", "toilet_routine": "Litter Box"})
            Pet.objects.create(**pet_data)

        # --- Owner 2: Olivia ---
        olivia = User.objects.create_user(username='olivia_owner', email='olivia@test.com', password=password)
        olivia.groups.add(owner_group)
        UserProfile.objects.create(user=olivia, location='Manchester, UK', bio='Exotic and small pet enthusiast.', profile_image_url="")

        olivia_pets = [
            {"name": "Daisy", "type": "Dog", "breed": "Pug", "weight": 10.0, "gender": "Female"},
            {"name": "Bailey", "type": "Dog", "breed": "Cockapoo", "weight": 14.0, "gender": "Male"},
            {"name": "Thumper", "type": "Rabbit", "breed": "Mini Lop", "weight": 2.0, "gender": "Male"},
            {"name": "Rio", "type": "Bird", "breed": "Macaw", "weight": 0.8, "gender": "Male"},
            {"name": "Peanut", "type": "Hamster", "breed": "Syrian", "weight": 0.1, "gender": "Female"}
        ]

        for p in olivia_pets:
            pet_data = base_pet.copy()
            pet_data.update({"owner": olivia, "name": p["name"], "pet_type": p["type"], "breed": p["breed"], "weight": p["weight"], "gender": p["gender"]})
            if p["type"] not in ["Dog", "Cat"]:
                pet_data.update({
                    "walk_frequency": "N/A", "leash_trained": False, "house_trained": False, 
                    "vaccination_status": "Not required", "toilet_routine": "Cage/Enclosure", "bath_friendly": False
                })
            Pet.objects.create(**pet_data)

        self.stdout.write(self.style.SUCCESS("✅ Database successfully seeded with 5 Providers, 15 Gigs, 2 Owners, and 10 Deep Pet Profiles!"))
        self.stdout.write(self.style.SUCCESS("All images set to blank for Base64 PC upload testing."))
