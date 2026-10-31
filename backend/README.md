# Airbcar - Django REST Framework Backend & Database

Production-ready backend API and database system for **Airbcar**, tailored for Moroccan car rental agencies, digital contracts under Dahir 2026, CMI banking deposit escrow, fleet management, and real-time agency-renter communication.

---

## 🛠️ Tech Stack
- **Framework**: Python 3.11+ / Django 5.x & Django REST Framework (DRF)
- **Database**: PostgreSQL (Production) / SQLite (Development zero-config)
- **Authentication**: JWT (JSON Web Tokens via `djangorestframework-simplejwt`)
- **CORS**: `django-cors-headers` preconfigured for Airbcar frontend
- **Static Assets**: WhiteNoise + Gunicorn
- **Deployment**: Render Blueprint (`render.yaml`), Dockerfile, Procfile, or Railway

---

## 🚀 Quickstart (Local Setup)

### 1. Set Up Virtual Environment
```bash
cd backend
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations
```bash
python manage.py makemigrations core
python manage.py migrate
```

### 4. Seed Initial Moroccan Fleet, Mayache Agency & Bookings
```bash
python manage.py seed_data
```
*This seeds the database with Mayache Prestige Cars, Volkswagen Golf 8, Duster 4x4, verified reviews, and pending bookings.*

### 5. Create Superuser (Admin Dashboard)
```bash
python manage.py createsuperuser
```
*(Or use the default seeded admin: `admin` / `admin12345`)*

### 6. Start the Server
```bash
python manage.py runserver 8000
```
- API Base URL: `http://127.0.0.1:8000/`
- Admin Dashboard: `http://127.0.0.1:8000/admin/`
- Health Endpoint: `http://127.0.0.1:8000/api/health/`

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health/` | API health check & Moroccan regulatory compliance status |
| `POST` | `/api/login/` | JWT user authentication (`access` and `refresh` tokens) |
| `GET` | `/listings/` | List all rental vehicles with city/category filters |
| `POST` | `/listings/<id>/blackouts/` | Schedule maintenance / unavailable blackout period |
| `GET` | `/partners/me/` | Agency partner profile and fleet summary |
| `GET` | `/partners/me/earnings/` | Payout history, net revenue, and escrow releases |
| `GET` | `/partners/me/analytics/` | Fleet utilization, average daily rate, punctuality |
| `POST/GET` | `/api/agency/bookings/` | Agency booking registry |
| `GET` | `/api/agency/bookings/pending/` | Pending reservations requiring confirmation |
| `POST` | `/api/agency/bookings/<id>/send-contract/` | Generate and dispatch Dahir 2026 digital contract |
| `POST` | `/api/agency/bookings/manual/` | Create walk-in / phone reservation |
| `POST` | `/api/reviews/<id>/respond/` | Post official agency reply to customer feedback |
| `GET` | `/api/conversations/` | Renter-agency messaging threads |
| `POST` | `/api/conversations/<id>/messages/` | Send chat message in thread |
| `GET` | `/api/agency/saved-replies/` | Canned response templates (e.g., `/airport`, `/deposit`) |
| `GET` | `/api/notifications/` | Filterable alerts for bookings, reviews, and escrow |
| `GET` | `/partners/car-shares/` | B2B inter-agency car sharing and vehicle dispatch |

---

## 📦 Deployment to Render (airbcar-backend.onrender.com)

1. Push your repository to GitHub.
2. In [Render.com](https://render.com), click **New** -> **Blueprint**.
3. Connect your repository. Render will detect `render.yaml` and automatically configure:
   - Python Web Service with Gunicorn
   - Managed PostgreSQL database
   - Automatic migrations & initial Moroccan data seed
4. Your API will be live at `https://airbcar-backend.onrender.com`.
