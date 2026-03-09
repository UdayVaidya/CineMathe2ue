# 🎬 CineMathèque

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node JS" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br/>

**CineMathèque** is a full-stack, aesthetically driven movie discovery platform built with the MERN stack. Designed with a striking, dark-themed brutalist UI (red and gray color palette), it allows users to explore trending movies, search for their favorites, and manage a personalized watchlist. The app is powered by the **TMDB (The Movie Database) API** for real-time cinematic data.

---

## ✨ Features

- **User Authentication:** Secure JWT-based Login and Registration.
- **Movie Discovery:** Fetch latest & trending movies directly from TMDB API.
- **Sleek UI/UX:** A visually striking "brutalist" design language with dark mode, red accents, and smooth animations.
- **Favorites & Watchlist:** Users can add movies to their personal favorites and manage their watchlist.
- **Admin Roles:** Role-based access control (Admin & User).
- **Responsive Layout:** Optimized for both desktop and mobile viewing.

---

## 🛠️ Tech Stack

### Frontend

- **React.js** (Vite)
- **Redux Toolkit** (State Management)
- **Vanilla CSS / Custom Theme System** (Using CSS variables)
- **React Router** (Navigation)

### Backend

- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Database & ODM)
- **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & Security)
- **Swagger UI** (API Documentation)

### External Services

- **TMDB API** (Movie Data)

---

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.
You will also need a free API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api) and a MongoDB cluster.

### 1. Clone the Repository

```bash
git clone https://github.com/UdayVaidya/CineMathe2ue.git
cd CineMathe2ue
```

### 2. Setup the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory and add the following:
   ```env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Setup the Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory and add your TMDB API Key:
   ```env
   VITE_TMDB_API_KEY=your_tmdb_api_key_here
   VITE_API_URL=http://localhost:4000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Default Admin Account

To test admin features immediately, a seed script can be run on the backend to create an admin user:

| Email            | Password           | Role    |
| :--------------- | :----------------- | :------ |
| `admin@test.com` | `adminpassword123` | `Admin` |

---

## 🏗️ Folder Structure

```text
CineMathe2ue/
├── backend/               # Node.js/Express.js backend
│   ├── src/
│   │   ├── config/        # DB & Swagger Config
│   │   ├── controllers/   # Route handlers
│   │   ├── middlewares/   # Custom middlewares (Auth, Error handling)
│   │   ├── models/        # Mongoose schemas
│   │   └── routes/        # API Routes definition
│   └── package.json
└── frontend/              # React/Vite frontend
    ├── src/
    │   ├── features/      # Feature-based design (movies, auth, etc.)
    │   ├── routes/        # React Router configuration
    │   ├── shared/        # Shared components (Navbar, Loader)
    │   └── store/         # Redux store & slices
    └── package.json
```

---

## 📝 License

This project is licensed under the ISC License.

---

> **Note:** If you experience issues fetching TMDB data locally, ensure your network/ISP isn't blocking the TMDB API. A VPN or Cloudflare WARP may be required in some regions.
