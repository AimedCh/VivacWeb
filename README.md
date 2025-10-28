# VivacWeb - AI-Powered Mountain Camping Platform

<div align="center">

![VivacWeb](https://img.shields.io/badge/VivacWeb-Production%20Ready-success)
![PHP](https://img.shields.io/badge/PHP-8.2+-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)
![AI](https://img.shields.io/badge/AI-GPT--4-purple)

**EXPLORA • ACAMPA • CONECTA** 🏔️

A comprehensive platform for the vivac community featuring AI-powered route generation, interactive maps, country exploration with flag backgrounds, and educational resources for safe mountain camping.

[Quick Start](#-quick-start) • [Features](#-features) • [Demo](#-demo) • [Documentation](#-documentation)

</div>

---

## 🎯 Project Overview

VivacWeb is a full-stack web application designed to make mountain camping (vivac) safer and more accessible through:

- **AI-Powered Route Generation**: Personalized recommendations using GPT-4
- **Weather Integration**: Real-time conditions via OpenWeatherMap
- **Interactive Maps**: Route visualization with Mapbox
- **Community Features**: Ratings, reviews, and knowledge sharing
- **Educational Content**: Safety guides and best practices

**Status**: ✅ **Production Ready - Fully Functional (October 3, 2025)**

---

## 🚀 Quick Start

### Prerequisites

- XAMPP (PHP 7.4+, MySQL 5.7+)
- Node.js 14+
- npm or yarn

### Installation (5 Minutes)

```bash
# 1. Clone or navigate to project
cd c:\xampp\htdocs\APP400

# 2. Setup Laravel backend (Terminal 1)
cd backend
composer install
php artisan migrate --seed

# 3. Start Laravel server (Terminal 1)
php artisan serve --port=8000

# 4. Install and start frontend (Terminal 2)
cd frontend
npm install
npm start

# 5. Open browser
# http://localhost:3000
```

### Demo Login

```
Email: admin@gmail.com
Password: admin123
```

**Note**: The system is fully functional with:
- ✅ Laravel 12 backend with proper MySQL connection
- ✅ Database connected (app400)
- ✅ Authentication working
- ✅ Profile management fixed
- ✅ Country flags as backgrounds in Explore section
- ✅ All API endpoints operational
- ✅ Clean project structure (removed unnecessary files)

---

## ✨ Features

### 🤖 AI Route Generation

- Personalized recommendations based on user profile
- Weather-aware route planning
- GPT-4 powered intelligent suggestions
- Safety tips and waypoint descriptions

### 👤 User Profiles

- Experience level tracking (Beginner → Expert)
- Equipment inventory management
- Route statistics and achievements
- Customizable preferences

### 🗺️ Interactive Maps

- Route visualization with waypoints
- Real-time weather overlay
- Difficulty and terrain indicators
- Save and share routes

### ⭐ Community Features

- Rate and review routes (1-5 stars)
- Comment system
- Community feedback
- Popular routes discovery

### 📚 Educational Guides

- Safety guidelines for beginners
- Equipment recommendations
- Weather interpretation
- Leave No Trace principles

### 🌍 Country Exploration

- **85+ Countries** with authentic flag backgrounds
- Interactive country cards with flag gradients
- Route statistics per country
- Beautiful visual design with hover effects
- Search and filter functionality

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- React 18.2 with Hooks
- Tailwind CSS 3.4
- Axios for API calls
- Lucide React icons

**Backend**
- Laravel 12 (Full Laravel Framework)
- MySQL database
- RESTful API design
- Token-based authentication
- Eloquent ORM

**External APIs**
- OpenAI GPT-4 (route generation)
- OpenWeatherMap (weather data)
- Mapbox (maps and geocoding)

### Project Structure

```
APP400/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   └── App.js
│   └── package.json
│
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/Controllers/ # API controllers
│   │   └── Models/          # Eloquent models
│   ├── config/              # Laravel configuration
│   ├── database/            # Migrations & seeders
│   ├── routes/              # API routes
│   └── artisan              # Laravel CLI
│
├── SETUP_GUIDE.md          # Detailed setup instructions
├── PROJECT_SUMMARY.md      # Implementation details
├── DEMO_GUIDE.md           # Demo presentation guide
└── README.md               # This file
```

---

## 📊 Database Schema

### Core Tables

- **users** - User accounts and profiles
- **route_recommendations** - AI-generated and user routes
- **ratings** - Community ratings and reviews
- **guides** - Educational content

See `PROJECT_SUMMARY.md` for detailed schema.

---

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### Routes
```
GET    /api/routes              - List routes (with filters)
GET    /api/routes/{id}         - Get route details
POST   /api/routes              - Create route
POST   /api/routes/generate-ai  - Generate with AI ⭐
DELETE /api/routes/{id}         - Delete route
```

### Profile
```
GET /api/profile    - Get user profile
PUT /api/profile    - Update profile
```

### Ratings
```
GET  /api/routes/{id}/ratings  - Get ratings
POST /api/routes/{id}/rate     - Rate route
```

### Guides
```
GET /api/guides         - List guides
GET /api/guides/{slug}  - Get guide details
```

See `contracts.md` for complete API documentation.

---

## 🎬 Demo

### Quick Demo Flow

1. **Login** with demo account
2. **Generate AI Route** - Click "Generate Routes with AI"
3. **View Route** - See personalized recommendation
4. **Edit Profile** - Update experience and equipment
5. **Browse Guides** - Explore educational content
6. **Rate Route** - Add community feedback

See `DEMO_GUIDE.md` for detailed demo script.

---

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Implementation details
- **[DEMO_GUIDE.md](DEMO_GUIDE.md)** - Demo presentation guide
- **[contracts.md](contracts.md)** - API contracts
- **[laravel-backend/README.MD](laravel-backend/README.MD)** - Backend docs

---

## ⚙️ Configuration

### Backend (.env)

```env
# Database
DB_HOST=127.0.0.1
DB_DATABASE=app400
DB_USERNAME=root
DB_PASSWORD=

# API Keys (Optional - works with mock data)
OPENAI_API_KEY=sk-...
OPENWEATHER_API_KEY=...
MAPBOX_API_KEY=pk....
```

### Frontend

```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 🧪 Testing

### Manual Testing

```bash
# Test backend health
curl http://localhost:8000/

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"admin123"}'

# Test routes
curl http://localhost:8000/api/routes
```

### Frontend Testing

1. Open `http://localhost:3000`
2. Login with demo credentials
3. Test each feature:
   - AI route generation
   - Profile editing
   - Guide browsing
   - Route rating

---

## 🔒 Security

- ✅ Password hashing (bcrypt)
- ✅ Token-based authentication
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ CORS configuration
- ✅ Input validation

---

## 🐛 Troubleshooting

### Backend Issues

**Database connection failed**
- Check MySQL is running in XAMPP
- Verify credentials in `.env`
- Ensure database `app400` exists

**API returns 404**
- Verify PHP server is running on port 8000
- Check URL: `http://localhost:8000/`

### Frontend Issues

**Cannot connect to backend**
- Check backend is running
- Verify `REACT_APP_API_URL` in frontend/.env
- Check browser console for CORS errors

**Login fails**
- Verify backend is running
- Check database has users table
- Try demo credentials

---

## 📅 Timeline

- **November 14, 2024**: MVP Demo ✅
- **October 3, 2025**: Production Ready ✅
  - Fixed authentication issues
  - Resolved database connection problems
  - Implemented country flags feature
  - Fixed profile management errors
  - All systems operational

---

## 🚀 Future Enhancements

### Phase 2
- Real Mapbox GL JS integration
- Route sharing via social media
- Mobile app (React Native)
- Offline mode with PWA
- Advanced search and filters

### Phase 3
- Machine learning recommendations
- Fitness tracker integration
- Emergency SOS features
- Community events
- Gamification

---

## 👥 Contributing

This is an academic project for the vivac community. For questions or suggestions, please refer to the documentation.

---

## 📄 License

Academic project - Universidad Complutense de Madrid

---

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- OpenWeatherMap for weather data
- Mapbox for mapping services
- The vivac community for inspiration

---

## 📞 Support

For setup help or issues:
1. Check `SETUP_GUIDE.md`
2. Review `PROJECT_SUMMARY.md`
3. Check browser console for errors
4. Verify all services are running

---

<div align="center">

**VivacWeb** - Making mountain camping safer and more accessible

*Built with ❤️ for the vivac community*

🏔️ **EXPLORA • ACAMPA • CONECTA** 🏔️

</div>

