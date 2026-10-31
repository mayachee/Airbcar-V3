from django.db import models
from django.contrib.auth.models import User
import uuid

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('renter', 'Renter / Traveler'),
        ('partner', 'Agency Partner'),
        ('admin', 'Platform Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='renter')
    phone = models.CharField(max_length=30, blank=True)
    cin_or_passport = models.CharField(max_length=50, blank=True)
    driver_license_number = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=100, default='Casablanca')
    avatar_url = models.URLField(blank=True, default='')
    kyc_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Agency(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agencies')
    name = models.CharField(max_length=200, default='Mayache Prestige Cars')
    license_number = models.CharField(max_length=100, default='AGR-MIN-TRA-7821-TET')
    tax_id = models.CharField(max_length=100, default='ICE 002849182000034')
    city = models.CharField(max_length=100, default='Tetouan')
    address = models.CharField(max_length=255, default='Boulevard Mohamed V, Quartier Administratif')
    phone = models.CharField(max_length=50, default='+212 539 96 42 10')
    whatsapp = models.CharField(max_length=50, default='+212 661 28 49 50')
    email = models.EmailField(default='contact@mayacheprestigecars.ma')
    rating = models.FloatField(default=4.9)
    review_count = models.IntegerField(default=128)
    active_fleet_count = models.IntegerField(default=18)
    is_verified = models.BooleanField(default=True)
    airport_pickup_available = models.BooleanField(default=True)
    hotel_delivery_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Agencies'

    def __str__(self):
        return f"{self.name} - {self.city}"


class Listing(models.Model):
    CATEGORY_CHOICES = (
        ('Economy', 'Economy'),
        ('SUV', 'SUV & 4x4'),
        ('Prestige / Luxury', 'Prestige / Luxury'),
        ('Sedan', 'Sedan'),
        ('Commercial', 'Commercial'),
    )
    STATUS_CHOICES = (
        ('Available', 'Available'),
        ('Rented', 'Rented'),
        ('Maintenance', 'Maintenance'),
        ('Blackout', 'Blackout'),
    )

    id = models.CharField(max_length=50, primary_key=True, default=lambda: f"car-{uuid.uuid4().hex[:6]}")
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='listings')
    name = models.CharField(max_length=200) # e.g. '2025 Volkswagen Golf 8'
    brand = models.CharField(max_length=100, default='Volkswagen')
    model_name = models.CharField(max_length=100, default='Golf 8')
    year = models.IntegerField(default=2025)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Prestige / Luxury')
    transmission = models.CharField(max_length=30, default='Automatic')
    fuel_type = models.CharField(max_length=30, default='Diesel')
    seats = models.IntegerField(default=5)
    doors = models.IntegerField(default=5)
    has_ac = models.BooleanField(default=True)
    plate_number = models.CharField(max_length=50, default='45892-A-1')
    daily_rate_dh = models.DecimalField(max_digits=10, decimal_places=2, default=600.00)
    deposit_amount_dh = models.DecimalField(max_digits=10, decimal_places=2, default=5000.00)
    deposit_type = models.CharField(max_length=50, default='Credit Card Pre-auth')
    mileage_policy = models.CharField(max_length=50, default='Unlimited')
    image_url = models.URLField(max_length=500, default='https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80')
    rating = models.FloatField(default=4.95)
    review_count = models.IntegerField(default=42)
    available_status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Available')
    min_rental_days = models.IntegerField(default=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.daily_rate_dh} DH/j)"


class BlackoutPeriod(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='blackouts')
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.CharField(max_length=200, default='Scheduled Maintenance')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.listing.name}: {self.start_date} -> {self.end_date}"


class Booking(models.Model):
    STATUS_CHOICES = (
        ('Pending Confirmation', 'Pending Confirmation'),
        ('Confirmed', 'Confirmed'),
        ('Active', 'Active'),
        ('Review pending', 'Review pending'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    )
    CONTRACT_CHOICES = (
        ('Draft', 'Draft'),
        ('Sent', 'Sent'),
        ('Signed', 'Signed'),
        ('Rejected', 'Rejected'),
    )
    PAYMENT_CHOICES = (
        ('Unpaid', 'Unpaid'),
        ('Deposit Escrowed', 'Deposit Escrowed'),
        ('Paid', 'Paid'),
        ('Refunded', 'Refunded'),
    )

    booking_id = models.CharField(max_length=50, unique=True, default=lambda: f"AC-{uuid.uuid4().hex[:4].upper()}")
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='bookings')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bookings')
    renter = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='renter_bookings')
    
    # Guest details (supports walk-ins and web bookings)
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=50)
    customer_email = models.EmailField(blank=True)
    customer_cin = models.CharField(max_length=50, blank=True)
    customer_flight_number = models.CharField(max_length=50, blank=True)

    pickup_date = models.DateField()
    return_date = models.DateField()
    pickup_time = models.CharField(max_length=20, default='10:00')
    return_time = models.CharField(max_length=20, default='10:00')
    pickup_location = models.CharField(max_length=200, default='Sania Ramel Airport (TTU)')
    return_location = models.CharField(max_length=200, default='Sania Ramel Airport (TTU)')

    rental_days = models.IntegerField(default=3)
    daily_rate_dh = models.DecimalField(max_digits=10, decimal_places=2, default=600.00)
    total_amount_dh = models.DecimalField(max_digits=10, decimal_places=2, default=1800.00)
    deposit_dh = models.DecimalField(max_digits=10, decimal_places=2, default=5000.00)

    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Confirmed')
    contract_status = models.CharField(max_length=30, choices=CONTRACT_CHOICES, default='Draft')
    payment_status = models.CharField(max_length=30, choices=PAYMENT_CHOICES, default='Deposit Escrowed')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_id} - {self.customer_name} ({self.listing.name})"


class DigitalContract(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='contract')
    contract_number = models.CharField(max_length=50, unique=True)
    legal_framework = models.CharField(max_length=100, default='Dahir 2026 - Law 09-08 / Transport Code')
    renter_signed = models.BooleanField(default=False)
    renter_signature = models.TextField(blank=True) # digital signature hash or SVG
    renter_signed_at = models.DateTimeField(null=True, blank=True)
    agency_signed = models.BooleanField(default=True)
    agency_signed_at = models.DateTimeField(auto_now_add=True)
    pdf_download_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Contract {self.contract_number} for {self.booking.booking_id}"


class Review(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='reviews')
    listing = models.ForeignKey(Listing, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    
    author_name = models.CharField(max_length=150)
    author_avatar = models.URLField(max_length=500, blank=True, default='')
    rating = models.IntegerField(default=5) # 1 to 5
    comment = models.TextField()
    location = models.CharField(max_length=100, default='Casablanca, Morocco')
    verified_trip = models.BooleanField(default=True)
    
    # Official Agency Response
    partner_response = models.TextField(blank=True, null=True)
    partner_responded_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"★ {self.rating} by {self.author_name} for {self.agency.name}"


class Conversation(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='conversations')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='conversations')
    customer_name = models.CharField(max_length=150)
    customer_phone = models.CharField(max_length=50, blank=True)
    car_name = models.CharField(max_length=150, default='2025 Volkswagen Golf 8')
    unread_agency = models.BooleanField(default=False)
    unread_renter = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Chat with {self.customer_name} ({self.car_name})"


class Message(models.Model):
    SENDER_CHOICES = (
        ('renter', 'Renter'),
        ('agency', 'Agency Desk'),
        ('system', 'System / Escrow'),
    )
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20, choices=SENDER_CHOICES, default='agency')
    text = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender}: {self.text[:30]}"


class SavedReply(models.Model):
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='saved_replies')
    title = models.CharField(max_length=150)
    shortcut = models.CharField(max_length=50, blank=True) # e.g. /airport
    content = models.TextField()
    category = models.CharField(max_length=50, default='Airport Delivery')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Saved Replies'

    def __str__(self):
        return f"[{self.shortcut}] {self.title}"


class Notification(models.Model):
    TYPE_CHOICES = (
        ('booking', 'Booking'),
        ('review', 'Review'),
        ('contract', 'Contract'),
        ('payment', 'Payment / Escrow'),
        ('message', 'Message'),
        ('system', 'System Alert'),
    )
    ROLE_CHOICES = (
        ('renter', 'Renter'),
        ('partner', 'Partner Agency'),
        ('admin', 'HQ Admin'),
        ('all', 'All Roles'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    target_role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='partner')
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='system')
    title = models.CharField(max_length=200)
    message = models.TextField()
    read = models.BooleanField(default=False)
    action_label = models.CharField(max_length=100, blank=True)
    action_tab = models.CharField(max_length=50, blank=True)
    meta_data = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.type.upper()}] {self.title}"


class CarShare(models.Model):
    STATUS_CHOICES = (
        ('Available', 'Available for Dispatch'),
        ('Dispatched', 'Currently Dispatched'),
        ('Returned', 'Returned to Fleet'),
    )
    owning_agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='shared_cars_owned')
    requesting_agency = models.ForeignKey(Agency, on_delete=models.SET_NULL, null=True, blank=True, related_name='shared_cars_borrowed')
    car_name = models.CharField(max_length=150)
    plate_number = models.CharField(max_length=50)
    wholesale_rate_dh = models.DecimalField(max_digits=10, decimal_places=2, default=380.00)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Available')
    location = models.CharField(max_length=150, default='Tetouan Hub')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"B2B: {self.car_name} ({self.plate_number})"


class CarShareInspection(models.Model):
    car_share = models.ForeignKey(CarShare, on_delete=models.CASCADE, related_name='inspections')
    inspector_name = models.CharField(max_length=150)
    fuel_level = models.CharField(max_length=50, default='8/8 Full')
    odometer_km = models.IntegerField(default=24500)
    condition_notes = models.TextField(default='Pristine bodywork, zero scratches.')
    inspection_photos = models.JSONField(default=list, blank=True)
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inspection for {self.car_share.car_name} at {self.created_at.strftime('%Y-%m-%d')}"
