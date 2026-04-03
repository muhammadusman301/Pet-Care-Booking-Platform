from django.core.exceptions import ValidationError
from .models import Booking

def check_booking_overlap(provider, start, end):
    # This is the professional logic Nadeem discussed in his report
    overlapping_bookings = Booking.objects.filter(
        service_provider=provider,
        start_time__lt=end,
        end_time__gt=start,
        status='C'
    ).exists()
    
    if overlapping_bookings:
        raise ValidationError("This time slot is already booked.")
