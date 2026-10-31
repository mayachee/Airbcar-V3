from django.contrib import admin
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
    CarShareInspection,
)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'phone', 'city', 'kyc_verified')
    list_filter = ('role', 'kyc_verified', 'city')
    search_fields = ('user__username', 'user__email', 'phone', 'cin_or_passport')


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'phone', 'rating', 'review_count', 'is_verified')
    list_filter = ('city', 'is_verified')
    search_fields = ('name', 'city', 'phone', 'license_number', 'tax_id')


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'agency', 'category', 'transmission', 'daily_rate_dh', 'available_status')
    list_filter = ('category', 'transmission', 'available_status', 'fuel_type')
    search_fields = ('name', 'brand', 'plate_number')


@admin.register(BlackoutPeriod)
class BlackoutPeriodAdmin(admin.ModelAdmin):
    list_display = ('listing', 'start_date', 'end_date', 'reason')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'customer_name', 'listing', 'pickup_date', 'return_date', 'status', 'payment_status')
    list_filter = ('status', 'payment_status', 'contract_status')
    search_fields = ('booking_id', 'customer_name', 'customer_phone', 'customer_cin')


@admin.register(DigitalContract)
class DigitalContractAdmin(admin.ModelAdmin):
    list_display = ('contract_number', 'booking', 'renter_signed', 'agency_signed', 'created_at')
    list_filter = ('renter_signed', 'agency_signed')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'agency', 'listing', 'rating', 'verified_trip', 'created_at')
    list_filter = ('rating', 'verified_trip', 'agency')
    search_fields = ('author_name', 'comment', 'partner_response')


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'car_name', 'agency', 'updated_at')
    inlines = [MessageInline]


@admin.register(SavedReply)
class SavedReplyAdmin(admin.ModelAdmin):
    list_display = ('title', 'shortcut', 'category', 'agency')
    list_filter = ('category', 'agency')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'target_role', 'read', 'created_at')
    list_filter = ('type', 'target_role', 'read')


@admin.register(CarShare)
class CarShareAdmin(admin.ModelAdmin):
    list_display = ('car_name', 'plate_number', 'owning_agency', 'wholesale_rate_dh', 'status')
    list_filter = ('status', 'location')


@admin.register(CarShareInspection)
class CarShareInspectionAdmin(admin.ModelAdmin):
    list_display = ('car_share', 'inspector_name', 'fuel_level', 'odometer_km', 'created_at')
