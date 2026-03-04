# 🇮🇳 India Trip Planner

A production-ready full-stack web application that generates structured, real-time travel itineraries across India using live weather data and interactive mapping services.

This platform centralizes trip planning into a single intelligent interface — eliminating the need for fragmented research across multiple websites.

---

## 📌 Executive Summary

India Trip Planner is designed as a scalable, API-driven travel planning system that enables users to:

- Generate structured multi-day itineraries
- Access real-time weather forecasts
- Visualize destinations using interactive maps
- Plan efficiently with a responsive, modern UI

The system follows a clean frontend–backend architecture and demonstrates real-world API integration, secure environment configuration, and modular component design.

---

## 🏗️ System Architecture


Frontend (React + Vite)
↓
Axios API Requests
↓
Backend (Node.js + Express)
↓
External APIs (Weather / Maps)


### Architecture Principles

- Separation of concerns (UI, API layer, server logic)
- Environment-based configuration
- Modular component structure
- Scalable backend routing
- Clean API abstraction

---

## ✨ Core Features

### 1️⃣ Dynamic Itinerary Generation
Generates structured, day-by-day travel plans based on:
- Destination
- Duration
- User inputs

### 2️⃣ Real-Time Weather Integration
- Live weather data retrieval via OpenWeather API
- Forecast-based trip planning support
- Backend-secured API requests

### 3️⃣ Interactive Mapping
- Destination visualization using map services
- Dynamic location rendering
- Improved geographic context for planning

### 4️⃣ Modern Responsive UI
- Clean layout
- Mobile-friendly responsiveness
- Optimized UX for clarity and usability

### 5️⃣ Backend API Layer
- Express server with route abstraction
- Secure API key management using dotenv
- CORS-enabled cross-origin communication

---

## 🛠 Technology Stack

### Frontend
- React.js
- Vite
- Axios
- Modern CSS

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### External Services
- OpenWeather API
- Map Service API (Google Maps / Leaflet / OpenStreetMap)

---

## 📂 Project Structure


India-Trip-Planner/
│
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── vite.config.js
│
├── server/
│ ├── routes/
│ ├── controllers/
│ ├── server.js
│ ├── package.json
│ └── .env (excluded from Git)
│
└── README.md


---

## ⚙️ Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/damasvasree-nagaraj/India-Trip-Planner.git
cd India-Trip-Planner
2. Install Dependencies

Frontend:

cd client
npm install

Backend:

cd ../server
npm install
3. Configure Environment Variables

Create a .env file inside /server:

OPENWEATHER_API_KEY=your_api_key
MAP_API_KEY=your_api_key
PORT=5000

Important:

Never commit .env

Ensure .env is added to .gitignore

4. Run the Application

Start backend:

cd server
npm start

Start frontend:

cd client
npm run dev

Default ports:

Frontend → http://localhost:5173

Backend → http://localhost:5000

🔍 Functional Workflow

User enters destination and trip duration.

Frontend sends API request to backend.

Backend securely calls weather/map APIs.

Data is processed and returned.

UI dynamically renders itinerary and map.

🔐 Security & Best Practices

API keys stored in environment variables

No sensitive credentials exposed to frontend

Structured routing for scalability

Clean separation between client and server logic

🚀 Scalability Roadmap

Future enhancements for production scaling:

User authentication & saved itineraries

AI-based itinerary optimization

Hotel & transport API integration

Database integration (MongoDB / PostgreSQL)

Caching layer (Redis)

Deployment pipeline (Docker + CI/CD)

Cloud hosting (AWS / Render / Vercel)

📊 Engineering Value Demonstrated

This project showcases:

Full-stack development capability

API integration experience

Secure backend configuration

Modular frontend architecture

Clean project structuring

Real-world deployment readiness

👩‍💻 Author

Damasvasree Nagaraj
GitHub: https://github.com/damasvasree-nagaraj
