from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile,
    Agency,
    Listing,
    BlackoutPeriod,
    Booking,
    DigitalContract,
    Review,
    Conversation,
    Message,
    SavedReply,
    Notification,
    CarShare,
    CarShareInspection
)

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role', 'phone', 'cin_or_passport', 'driver_license_number', 'city', 'avatar_url', 'kyc_verified']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class BlackoutPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlackoutPeriod
        fields = ['id', 'listing', 'start_date', 'end_date', 'reason', 'created_at']


class ListingSerializer(serializers.ModelSerializer):
    agency_name = serializers.ReadOnlyField(source='agency.name')
    agency_city = serializers.ReadOnlyField(source='agency.city')
    blackouts = BlackoutPeriodSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'agency', 'agency_name', 'agency_city', 'name', 'brand', 'model_name',
            'year', 'category', 'transmission', 'fuel_type', 'seats', 'doors', 'has_ac',
            'plate_number', 'daily_rate_dh', 'deposit_amount_dh', 'deposit_type',
            'mileage_policy', 'image_url', 'rating', 'review_count', 'available_status',
            'min_rental_days', 'blackouts', 'created_at'
        ]


class AgencySerializer(serializers.ModelSerializer):
    listings = ListingSerializer(many=True, read_only=True)

    class Meta:
        model = Agency
        fields = [
            'id', 'owner', 'name', 'license_number', 'tax_id', 'city', 'address',
            'phone', 'whatsapp', 'email', 'rating', 'review_count', 'active_fleet_count',
            'is_verified', 'airport_pickup_available', 'hotel_delivery_available',
            'listings', 'created_at'
        ]


class DigitalContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = DigitalContract
        fields = [
            'id', 'booking', 'contract_number', 'legal_framework', 'renter_signed',
            'renter_signature', 'renter_signed_at', 'agency_signed', 'agency_signed_at',
            'pdf_download_url', 'created_at'
        ]


class BookingSerializer(serializers.ModelSerializer):
    listing_details = ListingSerializer(source='listing', read_only=True)
    agency_name = serializers.ReadOnlyField(source='agency.name')
    contract = DigitalContractSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'agency', 'agency_name', 'listing', 'listing_details',
            'renter', 'customer_name', 'customer_phone', 'customer_email', 'customer_cin',
            'customer_flight_number', 'pickup_date', 'return_date', 'pickup_time',
            'return_time', 'pickup_location', 'return_location', 'rental_days',
            'daily_rate_dh', 'total_amount_dh', 'deposit_dh', 'status', 'contract_status',
            'payment_status', 'notes', 'contract', 'created_at'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.ReadOnlyField(source='listing.name')
    agency_name = serializers.ReadOnlyField(source='agency.name')

    class Meta:
        model = Review
        fields = [
            'id', 'agency', 'agency_name', 'listing', 'vehicle_name', 'booking',
            'author_name', 'author_avatar', 'rating', 'comment', 'location',
            'verified_trip', 'partner_response', 'partner_responded_at', 'created_at'
        ]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'text', 'read', 'created_at']


class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'agency', 'booking', 'customer_name', 'customer_phone', 'car_name',
            'unread_agency', 'unread_renter', 'updated_at', 'created_at', 'messages',
            'last_message'
        ]

    def get_last_message(self, obj):
        last = obj.messages.last()
        return MessageSerializer(last).data if last else None


class SavedReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = SavedReply
        fields = ['id', 'agency', 'title', 'shortcut', 'content', 'category', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'target_role', 'type', 'title', 'message', 'read',
            'action_label', 'action_tab', 'meta_data', 'created_at'
        ]


class CarShareInspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarShareInspection
        fields = [
            'id', 'car_share', 'inspector_name', 'fuel_level', 'odometer_km',
            'condition_notes', 'inspection_photos', 'verified', 'created_at'
        ]


class CarShareSerializer(serializers.ModelSerializer):
    inspections = CarShareInspectionSerializer(many=True, read_only=True)
    owning_agency_name = serializers.ReadOnlyField(source='owning_agency.name')

    class Meta:
        model = CarShare
        fields = [
            'id', 'owning_agency', 'owning_agency_name', 'requesting_agency',
            'car_name', 'plate_number', 'wholesale_rate_dh', 'status', 'location',
            'inspections', 'created_at'
        ]
