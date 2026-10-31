from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from core.models import (
    UserProfile,
    Agency,
    Listing,
    Booking,
    DigitalContract,
    Review,
    Conversation,
    Message,
    SavedReply,
    Notification,
    CarShare
)

class Command(BaseCommand):
    help = 'Seeds database with initial Airbcar vehicles, Mayache Prestige agency, bookings, reviews, and notifications'

    def handle(self, *args, **options):
        self.stdout.write('Seeding Airbcar database...')

        # 1. Superuser / Admin
        admin_user, _ = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@airbcar.ma',
                'first_name': 'Airbcar',
                'last_name': 'HQ Admin',
                'is_staff': True,
                'is_superuser': True
            }
        )
        admin_user.set_password('admin12345')
        admin_user.save()

        UserProfile.objects.get_or_create(
            user=admin_user,
            defaults={'role': 'admin', 'city': 'Casablanca', 'kyc_verified': True}
        )

        # 2. Agency Partner User (Yassine Ayache)
        partner_user, _ = User.objects.get_or_create(
            username='yassine',
            defaults={
                'email': 'contact@mayacheprestigecars.ma',
                'first_name': 'Yassine',
                'last_name': 'Ayache',
            }
        )
        partner_user.set_password('partner12345')
        partner_user.save()

        UserProfile.objects.get_or_create(
            user=partner_user,
            defaults={'role': 'partner', 'city': 'Tetouan', 'phone': '+212 661 28 49 50', 'kyc_verified': True}
        )

        # 3. Agency
        agency, _ = Agency.objects.get_or_create(
            owner=partner_user,
            defaults={
                'name': 'Mayache Prestige Cars',
                'city': 'Tetouan',
                'address': 'Boulevard Mohamed V, Quartier Administratif',
                'phone': '+212 539 96 42 10',
                'whatsapp': '+212 661 28 49 50',
                'email': 'contact@mayacheprestigecars.ma',
                'rating': 4.9,
                'review_count': 128,
                'active_fleet_count': 18,
                'is_verified': True
            }
        )

        # 4. Fleet Listings
        vehicles_data = [
            {
                'id': 'car-golf-8',
                'name': '2025 Volkswagen Golf 8 R-Line',
                'brand': 'Volkswagen',
                'model_name': 'Golf 8',
                'year': 2025,
                'category': 'Prestige / Luxury',
                'transmission': 'Automatic',
                'fuel_type': 'Diesel',
                'daily_rate_dh': 600.00,
                'deposit_amount_dh': 5000.00,
                'plate_number': '45892-A-1',
                'image_url': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
            },
            {
                'id': 'car-duster-4x4',
                'name': '2024 Dacia Duster 4x4 Prestige',
                'brand': 'Dacia',
                'model_name': 'Duster',
                'year': 2024,
                'category': 'SUV',
                'transmission': 'Manual',
                'fuel_type': 'Diesel',
                'daily_rate_dh': 420.00,
                'deposit_amount_dh': 4000.00,
                'plate_number': '39102-B-50',
                'image_url': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
            },
            {
                'id': 'car-clio-5',
                'name': '2024 Renault Clio 5 Intens',
                'brand': 'Renault',
                'model_name': 'Clio 5',
                'year': 2024,
                'category': 'Economy',
                'transmission': 'Manual',
                'fuel_type': 'Diesel',
                'daily_rate_dh': 320.00,
                'deposit_amount_dh': 3000.00,
                'plate_number': '11093-C-50',
                'image_url': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80',
            },
            {
                'id': 'car-cupra-formentor',
                'name': '2025 Cupra Formentor VZ',
                'brand': 'Cupra',
                'model_name': 'Formentor',
                'year': 2025,
                'category': 'Prestige / Luxury',
                'transmission': 'Automatic',
                'fuel_type': 'Petrol',
                'daily_rate_dh': 850.00,
                'deposit_amount_dh': 7000.00,
                'plate_number': '77801-D-1',
                'image_url': 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
            }
        ]

        for v in vehicles_data:
            Listing.objects.update_or_create(
                id=v['id'],
                defaults={
                    'agency': agency,
                    'name': v['name'],
                    'brand': v['brand'],
                    'model_name': v['model_name'],
                    'year': v['year'],
                    'category': v['category'],
                    'transmission': v['transmission'],
                    'fuel_type': v['fuel_type'],
                    'daily_rate_dh': v['daily_rate_dh'],
                    'deposit_amount_dh': v['deposit_amount_dh'],
                    'plate_number': v['plate_number'],
                    'image_url': v['image_url'],
                    'available_status': 'Available'
                }
            )

        # 5. Bookings
        golf = Listing.objects.get(id='car-golf-8')
        b1, _ = Booking.objects.get_or_create(
            booking_id='AC-8841',
            defaults={
                'agency': agency,
                'listing': golf,
                'customer_name': 'Hamza El Mansouri',
                'customer_phone': '+212 662 10 99 22',
                'customer_email': 'hamza.elmansouri@gmail.com',
                'customer_cin': 'L492019',
                'pickup_date': (timezone.now() + timedelta(days=1)).strftime('%Y-%m-%d'),
                'return_date': (timezone.now() + timedelta(days=5)).strftime('%Y-%m-%d'),
                'pickup_location': 'Sania Ramel Airport (TTU)',
                'return_location': 'Sania Ramel Airport (TTU)',
                'rental_days': 4,
                'daily_rate_dh': 600,
                'total_amount_dh': 2400,
                'deposit_dh': 5000,
                'status': 'Confirmed',
                'contract_status': 'Signed',
                'payment_status': 'Deposit Escrowed'
            }
        )

        DigitalContract.objects.get_or_create(
            booking=b1,
            defaults={
                'contract_number': 'AC-2026-8841-DH',
                'renter_signed': True,
                'renter_signed_at': timezone.now() - timedelta(hours=2),
                'pdf_download_url': 'https://airbcar-backend.onrender.com/contracts/AC-8841.pdf'
            }
        )

        # 6. Reviews with official responses
        Review.objects.get_or_create(
            agency=agency,
            author_name='Fatima-Zahra B.',
            defaults={
                'listing': golf,
                'rating': 5,
                'comment': 'Very professional agency in Tetouan. Delivered directly at Sania Ramel Airport, spotless interior, and the CMI security deposit hold was released in 2 hours.',
                'location': 'Casablanca, Morocco',
                'verified_trip': True,
                'partner_response': 'Merci infiniment Fatima-Zahra! It was a pleasure hosting you in Tetouan. Looking forward to your next visit.',
                'partner_responded_at': timezone.now() - timedelta(hours=6)
            }
        )

        Review.objects.get_or_create(
            agency=agency,
            author_name='Thomas Leroy',
            defaults={
                'listing': golf,
                'rating': 5,
                'comment': 'Superb Golf 8. Handover took 3 minutes and the digital Dahir 2026 contract on my phone felt completely reassuring.',
                'location': 'Lyon, France',
                'verified_trip': True,
                'partner_response': 'Thank you Thomas! Glad the digital lease and airport delivery were smooth for your holiday.',
                'partner_responded_at': timezone.now() - timedelta(days=1)
            }
        )

        # 7. Saved Replies
        SavedReply.objects.get_or_create(
            agency=agency,
            title='Airport Meet & Greet Sania Ramel',
            shortcut='/airport',
            defaults={
                'category': 'Handover Logistics',
                'content': 'Salam! Our representative will meet you right outside Terminal Arrivals at Sania Ramel Airport holding an Airbcar sign. Please share your flight number so we can track any delays.'
            }
        )

        SavedReply.objects.get_or_create(
            agency=agency,
            title='CMI Deposit Release Guarantee',
            shortcut='/deposit',
            defaults={
                'category': 'Payment & Escrow',
                'content': 'Your security deposit is held through safe CMI banking escrow. It is automatically unfrozen immediately upon return walkaround with zero fees.'
            }
        )

        # 8. Notifications
        Notification.objects.get_or_create(
            title='New 5-Star Review Received',
            defaults={
                'type': 'review',
                'target_role': 'partner',
                'message': 'Fatima-Zahra B. left a 5.0 rating for the 2025 Volkswagen Golf 8: "Very professional agency in Tetouan..."',
                'action_label': 'Post Official Reply',
                'action_tab': 'reviews',
                'read': False
            }
        )

        self.stdout.write(self.style.SUCCESS('Successfully seeded Airbcar database with demo records!'))
