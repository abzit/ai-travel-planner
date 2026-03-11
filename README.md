# AI Travel Planner

🌐 **Live Demo**: [https://ai-travel-planner-frontend-five.vercel.app](https://ai-travel-planner-frontend-five.vercel.app/)

## Project Overview
The AI Travel Planner is a full-stack web application designed to remove the stress from vacation planning. By taking user inputs such as destination, trip duration, budget, and specific interests, the application leverages advanced AI to instantly generate a comprehensive, day-by-day itinerary. It includes daily activities, hotel recommendations, budget estimates, and map plotting for a seamless user experience.

## Chosen Tech Stack & Justification
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS v4, React Leaflet
  - *Justification*: Next.js provides a robust, SEO-friendly framework with rapid routing. Tailwind CSS enables extremely fast, utility-first styling to build our polished UI. React Leaflet offers interactive mapping capabilities out of the box without complex setups.
- **Backend**: Node.js, Express.js 5, MongoDB (Mongoose)
  - *Justification*: The MERN-style backend provides a highly flexible, JSON-native ecosystem. Express is lightweight and perfect for our RESTful architecture, while MongoDB natively handles the deeply nested JSON structures representing our travel itineraries.
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using Gemini 2.5 Flash
  - *Justification*: Gemini 2.5 Flash is highly performant, cost-effective, and excellent at adhering to strict JSON output structures required for our dynamic application logic.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB locally installed, or a MongoDB Atlas URI
- Google Gemini API Key

### Local Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/ai-travel-planner
   JWT_SECRET=your_super_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```
4. Start the development server with nodemon: `npm run dev`

### Local Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env.local` file setting the API URL: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Start the Next.js development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## High-Level Architecture Explanation
The application follows a decoupled client-server architecture:
- **Client (Frontend)**: Handles all user interactions, form submissions, state management, and map rendering. It communicates with the backend exclusively via RESTful API calls using Axios.
- **Server (Backend)**: An Express application that manages user authentication, database validation via Mongoose, and houses the complex logic of communicating with the external Gemini AI API.
- **Database**: MongoDB stores User credentials securely and persists the saved Trips (which contain the AI-generated itineraries).

## Authentication and Authorization Approach
We utilize a secure **JWT (JSON Web Token)** approach. 
- When a user registers or logs in, the backend verifies credentials (passwords are hashed via bcrypt) and issues a signed JWT.
- The frontend stores this token and attaches it as a `Bearer` token in the `Authorization` header for all subsequent protected API requests (e.g., viewing saved trips, editing an itinerary). 
- Custom Express middleware on the backend intercepts these requests, cryptographically verifies the JWT, and authorizes access to the requested data.

## AI Agent Design and Purpose
The AI agent is encapsulated within `backend/services/aiService.js`. Its core purpose is to parse human intents into a structured data plan.
- **Design**: It uses the `gemini-2.5-flash` model. We employ explicit, structured prompt engineering to instruct the AI to return *only* a highly specific, parsable JSON object, removing any conversational filler.
- **Functionality**: It ingests the user's destination, duration, interests, and budget, and outputs heavily structured data: days with morning/afternoon/evening activities, a localized cost breakdown (with currency symbols), hotel suggestions, and the GPS coordinates of key landmarks.

## Creative / Custom Feature
**Dynamic Day Regeneration & Interactive Map**
Rather than forcing users to accept an entire itinerary or start completely from scratch, we built a granular editing experience. If a user dislikes a specific day's plan, they can query the AI to *regenerate only that single day* based on their overarching interests, seamlessly swapping the new suggestions into the existing plan.
Additionally, the application parses the AI-generated GPS coordinates and dynamically plots the trip's key attractions onto an interactive Leaflet map, providing immediate geospatial context to the user.

## Key Design Decisions and Trade-offs
- **Decoupled Architecture over Next.js API Routes**: We opted for a separate Express backend rather than keeping everything within Next.js API routes. *Trade-off*: A slightly more complex local repository setup, but it ensures our exact backend API can easily be consumed by a future mobile app (e.g., React Native) without major rewrites.
- **Prompt-Enforced JSON vs. Schema Objects**: We relied on strict prompt engineering to force a JSON response from the AI instead of utilizing rigid Schema object configurations. *Trade-off*: Much faster development iteration and lower token overhead, but requires robust fallback regex logic in the backend to strip unexpected markdown formatting (e.g., ` ```json ` blocks) before parsing.

## Known Limitations
- **Geospatial Accuracy**: Map plotting relies on the Gemini AI's internal knowledge of latitude/longitude coordinates. While generally accurate for major landmarks, it may occasionally hallucinate slightly inaccurate coordinates compared to utilizing a dedicated Google Maps Platform geocoding API.
- **Pricing Fluctuations**: The budget estimations are synthesized by AI based on historical training data; real-time flight and housing costs can vary significantly. Users should treat the budget as an estimate rather than a live quote.
