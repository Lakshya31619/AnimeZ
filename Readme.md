# AnimeZ 🐉

A full-stack anime streaming web application featuring shows, movies, character moments, and an admin dashboard — built with React, Node.js, MongoDB, Clerk, and Mux.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Routes](#api-routes)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)

---

## Features

- Browse and watch anime **shows**, **movies**, and **episodes**
- **Episode player** powered by Mux video streaming
- **Character** profiles and character-specific moment clips
- **Favorites** and **Watchlist** management per user
- **Search** across content
- **Admin dashboard** to add movies, characters, episodes, and moments
- Authentication via **Clerk** (role-based: admin vs. regular user)
- Background job support via **Inngest**

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Clerk React | Authentication UI |
| Mux Player React | Video playback |
| Axios | HTTP client |
| React Hot Toast | Notifications |
| Lucide React | Icons |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express 5 | Server and REST API |
| MongoDB + Mongoose | Database |
| Clerk Express | Auth middleware (JWT verification) |
| Cloudinary | Image/media uploads |
| Mux | Video upload and streaming |
| Inngest | Background/event-driven jobs |

---

## Project Structure

```
/
├── backend/
│   ├── configs/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── characterController.js
│   │   ├── episodeController.js
│   │   ├── muxController.js
│   │   ├── showController.js
│   │   └── userController.js
│   ├── inngest/
│   │   └── index.js            # Inngest client and functions
│   ├── middleware/
│   │   └── auth.js             # Clerk JWT middleware
│   ├── models/
│   │   ├── Character.js
│   │   ├── Episode.js
│   │   ├── Movie.js
│   │   ├── Show.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── characterRoutes.js
│   │   ├── episodeRoutes.js
│   │   ├── muxRoutes.js
│   │   ├── showRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── server.js
│   └── vercel.json
│
└── frontend/
    ├── public/                 # Static assets and anime logos
    ├── src/
    │   ├── components/         # Reusable UI components
    │   │   └── admin/          # Admin-specific components
    │   ├── context/
    │   │   └── AppContext.jsx  # Global state (user, favorites, watchlist)
    │   ├── lib/
    │   │   └── kConverter.js   # Utility helpers
    │   ├── pages/
    │   │   ├── admin/          # Admin dashboard pages
    │   │   └── ...             # Public pages
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Clerk account
- Mux account
- Cloudinary account
- Inngest account

### 1. Clone the repository

```bash
git clone <repo-url>
cd <repo-folder>
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then start the server:

```bash
npm start        # uses nodemon for hot reload
```

The server runs at `http://localhost:3000`.

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file (see below), then start the dev server:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb://localhost:27017
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
VITE_BASE_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BASE_URL=http://localhost:3000
```

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/show` | Get all shows |
| GET | `/api/episodes` | Get episodes |
| GET | `/api/character` | Get characters |
| GET | `/api/user/me` | Get current user |
| GET | `/api/user/favorites` | Get user's favorites |
| POST | `/api/user/add-favorite` | Add movie to favorites |
| POST | `/api/user/remove-favorite` | Remove movie from favorites |
| GET | `/api/user/watchlist` | Get user's watchlist |
| POST | `/api/user/add-watchlist` | Add to watchlist |
| POST | `/api/user/remove-watchlist` | Remove from watchlist |
| POST | `/api/mux` | Mux video upload/streaming |
| POST | `/api/admin` | Admin actions |
| POST | `/api/inngest` | Inngest event handler |

All user routes require a valid Clerk JWT in the `Authorization: Bearer <token>` header.

---

## Admin Panel

The admin panel is accessible at `/admin` and is protected by role-based auth. Only users with `role: "admin"` in the database can access it.

Admin features include:
- **Dashboard** — overview of content
- **Add Movies** — upload and publish anime movies
- **Characters** — manage character profiles
- **Add Moments** — add character clip moments
- **Add Episodes** — upload episodes linked to shows via Mux

---

## Deployment

Both frontend and backend include a `vercel.json` for deployment on [Vercel](https://vercel.com).

**Backend** — deploy as a Node.js serverless project on Vercel or any Node host (Railway, Render, etc.).

**Frontend** — deploy as a static Vite project on Vercel.

Make sure to update `VITE_BASE_URL` in the frontend `.env` to point to your deployed backend URL before building for production:

```bash
npm run build
```