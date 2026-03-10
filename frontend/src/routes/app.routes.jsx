import { lazy, Suspense, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import useAuth from "../features/auth/hooks/useAuth"
import { fetchFavorites } from "../features/favorites/store/favoritesSlice"
import Sidebar from "../shared/components/Sidebar"

// ── Eager load auth (tiny, always needed on first paint)
import AuthForm from "../features/auth/Pages/AuthForm"

// ── Lazy load everything else — these bundles are only fetched when the route is visited
const HomePage = lazy(() => import("../features/movies/Pages/HomePage"))
const TmdbDashboard = lazy(() => import("../features/tmdbDashboard/Pages/TmdbDashboard"))
const MoviesDetailPage = lazy(() => import("../features/movies/Pages/MoviesDetailPage"))
const SearchPage = lazy(() => import("../features/search/Pages/SearchPage"))
const AdminDashboard = lazy(() => import("../features/admin/Pages/AdminDashboard"))
const FavoritesPage = lazy(() => import("../features/favorites/Pages/FavoritesPage"))
const MoodSearchPage = lazy(() => import("../features/Expression/Pages/MoodSearchPage"))
const ProfilePage = lazy(() => import("../features/profile/Pages/ProfilePage"))

// Minimal fallback — avoids flash of unstyled content
function PageShell() {
    return (
        <div style={{
            minHeight: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <div style={{
                width: 32, height: 32,
                border: "2px solid #1e1e1e",
                borderTopColor: "#e63946",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
            }} />
        </div>
    )
}

const AppRoutes = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()

    useEffect(() => {
        if (user) dispatch(fetchFavorites())
    }, [user, dispatch])

    const homeRedirect = user?.role === "admin" ? "/admin" : "/home"

    return (
        <Suspense fallback={<PageShell />}>
            {user && <Sidebar />}
            <div className={user ? "page-content" : ""}>
                <Routes>
                    <Route path="/" element={!user ? <AuthForm /> : <Navigate to={homeRedirect} />} />
                    <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
                    <Route path="/tmdb" element={user ? <TmdbDashboard /> : <Navigate to="/" />} />
                    <Route path="/search" element={user ? <SearchPage /> : <Navigate to="/" />} />
                    <Route path="/movie/:id" element={user ? <MoviesDetailPage /> : <Navigate to="/" />} />
                    <Route path="/tv/:id" element={user ? <MoviesDetailPage /> : <Navigate to="/" />} />
                    <Route path="/favorites" element={user ? <FavoritesPage /> : <Navigate to="/" />} />
                    <Route path="/mood" element={user ? <MoodSearchPage /> : <Navigate to="/" />} />
                    <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
                    <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Suspense>
    )
}

export default AppRoutes