# AI Movie Insight Builder

## Overview

AI Movie Insight Builder is a full-stack web application that allows users to analyze audience sentiment for movies using AI.
Users enter an IMDb movie ID (for example: `tt0133093`), and the application retrieves movie details, gathers audience discussions, and generates an AI-powered summary of audience sentiment.

The system combines movie metadata from external APIs with AI analysis to present insights in a clear and user-friendly interface.

---

# Features

* Search movies using IMDb ID
* Display movie details including:

  * Title
  * Poster
  * Release year
  * Cast
  * Rating
  * Plot summary
* Retrieve audience discussions related to the movie
* AI-generated audience sentiment analysis
* Sentiment classification (Positive / Mixed / Negative)
* Key themes extracted from audience opinions
* Responsive UI design

---

# Tech Stack

## Frontend

* **Next.js (React)**
  Used to build the user interface and manage routing. The App Router architecture enables a clean project structure and efficient rendering.

* **TypeScript**
  Provides static typing and improves maintainability and reliability of the code.

* **Tailwind CSS**
  Used for styling the UI and building a responsive layout quickly.

* **Axios**
  Used to communicate with backend API routes.

---

## Backend

* **Next.js API Routes**
  Server-side logic is implemented using Next.js API routes, eliminating the need for a separate backend server.

* **Node.js Runtime**
  Handles API requests and integrates external services.

---

## External APIs

### OMDb API

Used to retrieve movie metadata including:

* Title
* Poster
* Actors
* Plot
* Ratings
* Release year

API Example:
https://www.omdbapi.com/

---

### Reddit API

Used to fetch public discussions related to the movie.
These discussions act as a source of audience opinions which are then analyzed by the AI model.

---

### Google Gemini AI

Used to perform:

* Sentiment analysis
* Summary generation
* Theme extraction

The AI model processes audience discussions and returns structured insights.

---

# System Architecture

User Input (IMDb ID)
↓
Next.js Frontend
↓
Next.js API Route
↓
External APIs
• OMDb API → Movie metadata
• Reddit API → Audience discussions
↓
Gemini AI → Sentiment Analysis
↓
Frontend displays insights

---

# Setup Instructions

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-movie-insight-builder.git
cd ai-movie-insight-builder
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```
OMDB_API_KEY=your_omdb_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

## 4. Run the Development Server

```bash
npm run dev
```

Open the application in your browser:

```
http://localhost:3000
```

---

# Usage

1. Enter a valid IMDb ID (example: `tt0133093`)
2. Click **Search**
3. The application will:

   * Fetch movie details
   * Retrieve audience discussions
   * Generate AI sentiment insights
4. Results will be displayed on the screen.

---

# Deployment

The application is deployed using **Vercel**, which provides seamless deployment for Next.js applications.

Steps used for deployment:

1. Push code to GitHub
2. Import repository into Vercel
3. Configure environment variables
4. Deploy the project

---

# Assumptions

* The user provides a valid IMDb movie ID.
* Reddit discussions are used as a proxy for audience reviews.
* AI-generated sentiment is based on publicly available discussions and may not fully represent the entire audience.
* The application focuses on demonstration of AI integration rather than production-scale data processing.

---
