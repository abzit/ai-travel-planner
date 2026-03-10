# AI Travel Planner

Frontend: https://ai-travel-planner-frontend-five.vercel.app
backend: https://ai-travel-planner-production-669f.up.railway.app/api

A full-stack, AI-powered travel planning web application built with Next.js, Express.js, MongoDB, and the Google Gemini AI.
This application allows users to generate tailored travel itineraries by simply specifying their destination, duration, budget, and interests. The AI parses these preferences to output a highly structured itinerary with cost estimates and hotel recommendations.

## Features

- **Auth & User System**: Secure user registration and login using JWT and bcrypt.
- **AI Itinerary Generation**: Uses Gemini 2.5 Flash to generate realistic daily activities, budget breakdowns, and hotel options.
- **Dynamic Editing**: Users can manually append or remove elements from any day, and optionally query the AI to fully *regenerate* a specific day without losing the rest of the plan.
- **Map Visualization**: A responsive React Leaflet integration mapping out the user's travel destination.
- **Modern UI**: Polished glassmorphism styles built completely via Tailwind CSS utilities with fully responsive design patterns.

## Architecture

The project adheres to a clean architecture with clear separation of concerns into two main apps.

- **Frontend (`frontend/`)**: Built on Next.js 15 App Router. Uses Tailwind v4 for aesthetic UI creation. Handles global state implicitly via localized component state + JWT `localStorage`. Communicates purely via the REST API using an Axios interceptor.
- **Backend (`backend/`)**: Built with Express.js Node ecosystem. Includes RESTful routes, JWT authentication middleware, and robust controller logic interacting with Mongoose ORM for MongoDB schema validation before data rests in Atlas/Local DB.
- **AI Service layer (`backend/services/aiService.js`)**: Encapsulates external LLM complexities using Google Gen AI SDK. Enforces strictly formatted prompt engineering patterns to coerce the AI output reliably into JSON for simple frontend extrapolation.

## API Endpoints

### Authentication
- `POST /api/auth/register` (name, email, password)
- `POST /api/auth/login` (email, password)

### Trip Management
- `GET /api/trips/my-trips`: Retrieve all saved trips for the authenticated user.
- `GET /api/trips/:tripId`: Retrieve a specific trip and its itinerary.
- `POST /api/trips/generate`: Invoke AI generation specifying `destination`, `days`, `budgetType`, and `interests`.
- `PATCH /api/trips/:tripId/add-activity`: Prepend custom activity text.
- `DELETE /api/trips/:tripId/remove-activity`: Discard a designated activity.
- `POST /api/trips/:tripId/regenerate-day`: AI processes just the targeted day ID based on overarching interests and updates the itinerary.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB locally installed, or a MongoDB Atlas URI
- Gemini API Key

### Backend Setup
1. Open the inner `backend/` directory: `cd backend`
2. Install npm modules: `npm install`
3. Check and adjust `.env` file variables located in `/backend/`:
    - `MONGO_URI`: `mongodb://localhost:27017/ai-travel-planner` (default for local)
    - `JWT_SECRET`: your secret key
    - `OPENAI_API_KEY` / `GEMINI_API_KEY`: Add your Gemini API Key here (Required for generation endpoints)
    - `PORT`: `5000` (default)
4. Start the development server (`nodemon`): `npm run dev`

### Frontend Setup
1. Open up `/frontend/`: `cd frontend`
2. Install packages: `npm install`
3. Optional: Add a `.env.local` setting `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Run Next.js: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Register your account to begin.
