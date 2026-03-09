import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { useDispatch } from "react-redux"

import AuthForm         from "../features/auth/Pages/AuthForm"
import HomePage         from "../features/movies/Pages/HomePage"
import TmdbDashboard    from "../features/tmdbDashboard/Pages/TmdbDashboard"
import MoviesDetailPage from "../features/movies/Pages/MoviesDetailPage"
import SearchPage       from "../features/search/Pages/SearchPage"
import AdminDashboard   from "../features/admin/Pages/AdminDashboard"
import FavoritesPage    from "../features/favorites/Pages/FavoritesPage"

import useAuth            from "../features/auth/hooks/useAuth"
import { fetchFavorites } from "../features/favorites/store/favoritesSlice"

const AppRoutes = () => {
    const { user } = useAuth()
    const dispatch = useDispatch()

    // Login hote hi favourites load ho jaayein
    useEffect(() => {
        if (user) dispatch(fetchFavorites())
    }, [user, dispatch])

    const homeRedirect = user?.role === "admin" ? "/admin" : "/home"

    return (
        <Routes>
            <Route path="/"          element={!user ? <AuthForm />         : <Navigate to={homeRedirect} />} />
            <Route path="/home"      element={user  ? <HomePage />         : <Navigate to="/" />} />
            <Route path="/tmdb"      element={user  ? <TmdbDashboard />    : <Navigate to="/" />} />
            <Route path="/search"    element={user  ? <SearchPage />       : <Navigate to="/" />} />
            <Route path="/movie/:id" element={user  ? <MoviesDetailPage /> : <Navigate to="/" />} />
            <Route path="/tv/:id"    element={user  ? <MoviesDetailPage /> : <Navigate to="/" />} />
            <Route path="/favorites" element={user  ? <FavoritesPage />    : <Navigate to="/" />} />
            <Route path="/admin"     element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
    )
}

export default AppRoutes