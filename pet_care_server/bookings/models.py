from django.db import models
from django.conf import settings
from pets.models import Pet

class Booking(models.Model):
    STATUS_CHOICES = [('P', 'Pending'), ('C', 'Confirmed'), ('X', 'Cancelled')]
    
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    service_provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointments')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    def __str__(self):
        return f"{self.pet.name} with {self.service_provider.username}"
