# CineScope - Project Task List

## 1. Project Setup
- [.] Initialize Frontend (React + Vite + Redux Toolkit)
- [.] Setup Frontend Routing & Directory Structure
- [.] Initialize Backend (Node + Express + MongoDB + JWT)
- [.] Setup Backend Directory Structure (models, routes, controllers, middleware)

## 2. Backend API Development
- [.] Setup MongoDB Connection (`mongoose`)
- [.] Create User Model (Username, Email, Password, Role [Admin/User], Favorites, WatchHistory)
- [.] Create Movie Model (Title, PosterURL, Description, MovieID, ReleaseDate, TrailerLink, Genre, Category)
- [.] Implement Auth Routes (Register, Login, Logout)
- [.] Implement JWT Verification Middleware
- [.] Implement Admin Middleware
- [ ] Implement Admin Movie CRUD Operations
- [ ] Implement Admin User Management Routes (View, Ban, Delete)
- [ ] Implement User Favorites Routes (Add, Remove, View)
- [ ] Implement User Watch History Routes (Add, View)

## 3. Frontend Core Integration
- [ ] Setup Redux Store (`authSlice`, `movieSlice`, `uiSlice`)
- [ ] Setup Axios Interceptors for JWT token attachment
- [ ] Implement Authentication Pages (Login, Sign Up)
- [ ] Implement Protected Routes (Admin vs User vs Public)
- [ ] Implement Navbar & Footer

## 4. TMDB & Movie Features
- [ ] Create TMDB API Service (Axios instance configured with base URL & API Key)
- [ ] Implement Home Page components (Trending, Popular, Movies, TV Shows, People)
- [ ] Implement Infinite Scrolling for Movie lists
- [ ] Implement Movie Details Page (Info, Cast, Trailer Modal)

## 5. Search & Advanced Features
- [ ] Implement Real-Time Search Bar
- [ ] Add Debouncing logic to Search API calls
- [ ] Implement Favorites section in User Profile
- [ ] Implement Watch History section in User Profile

## 6. Admin Panel
- [ ] Implement Admin Dashboard Layout
- [ ] Implement Admin Movies Table (Create, Edit, Delete modals)
- [ ] Implement Admin Users Table (Ban, Delete actions)

## 7. UI/UX & Optimizations
- [ ] Implement Loaders / Skelton UI for all data fetching
- [ ] Apply responsive design for Mobile, Tablet, Desktop
- [ ] Implement Error boundaries and fallback UI (Missing Data placeholders)
- [ ] Implement Dark/Light Mode (Bonus)

## 8. Verification
- [ ] Test Auth flows (User and Admin)
- [ ] Test Movie Data fetching & Infinite Scroll
- [ ] Test TMDB integration & Search Debouncing
- [ ] Test Backend CRUD operations via Admin UI
