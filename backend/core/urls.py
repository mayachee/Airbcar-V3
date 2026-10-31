from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthCheckView,
    LoginView,
    ListingViewSet,
    CreateBlackoutView,
    PartnerMeView,
    PartnerEarningsView,
    PartnerAnalyticsView,
    PartnerReviewsView,
    AgencyBookingsView,
    PendingAgencyBookingsView,
    SendContractView,
    ManualBookingCreateView,
    ReviewViewSet,
    ReviewRespondView,
    ConversationListView,
    SendMessageView,
    SavedRepliesView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView,
    CarShareListView,
    CarShareInspectionCreateView,
)

router = DefaultRouter()
router.register(r'listings', ListingViewSet, basename='listing')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    # 1. Health Checks
    path('', HealthCheckView.as_view(), name='root-health'),
    path('api/health/', HealthCheckView.as_view(), name='api-health'),

    # 2. Authentication
    path('api/login/', LoginView.as_view(), name='api-login'),

    # 3. Listings & Blackouts
    path('listings/<str:listing_id>/blackouts/', CreateBlackoutView.as_view(), name='listing-blackout'),

    # 4. Partner Portal Operations
    path('partners/me/', PartnerMeView.as_view(), name='partner-me'),
    path('partners/me/earnings/', PartnerEarningsView.as_view(), name='partner-earnings'),
    path('partners/me/analytics/', PartnerAnalyticsView.as_view(), name='partner-analytics'),
    path('partners/me/reviews/', PartnerReviewsView.as_view(), name='partner-reviews'),

    # 5. Agency Bookings & Contracts
    path('api/agency/bookings/', AgencyBookingsView.as_view(), name='agency-bookings'),
    path('api/agency/bookings/pending/', PendingAgencyBookingsView.as_view(), name='agency-bookings-pending'),
    path('api/agency/bookings/<str:booking_id>/send-contract/', SendContractView.as_view(), name='agency-send-contract'),
    path('api/agency/bookings/manual/', ManualBookingCreateView.as_view(), name='agency-manual-booking'),

    # 6. Reviews & Public Responses
    path('api/reviews/<int:review_id>/respond/', ReviewRespondView.as_view(), name='review-respond'),

    # 7. Real-Time Messaging & Saved Replies
    path('api/conversations/', ConversationListView.as_view(), name='conversations-list'),
    path('api/conversations/<int:conversation_id>/messages/', SendMessageView.as_view(), name='send-message'),
    path('api/agency/saved-replies/', SavedRepliesView.as_view(), name='agency-saved-replies'),

    # 8. Notifications
    path('api/notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('api/notifications/<int:notification_id>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('api/notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),

    # 9. B2B Car-Share
    path('partners/car-shares/', CarShareListView.as_view(), name='car-shares-list'),
    path('partners/car-shares/<int:car_share_id>/inspections/', CarShareInspectionCreateView.as_view(), name='car-share-inspection'),

    # Include viewsets for listings and reviews
    path('', include(router.urls)),
]
