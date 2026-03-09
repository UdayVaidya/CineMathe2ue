import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchFavorites } from "../store/favoritesSlice"
import FavoriteCard from "../components/FavoriteCard"

export default function FavoritesPage() {
    const dispatch  = useDispatch()
    const navigate  = useNavigate()
    const { favorites, loading, error } = useSelector((state) => state.favorites)

    useEffect(() => {
        dispatch(fetchFavorites())
    }, [dispatch])

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] gap-4">
                <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm tracking-widest text-[#666] uppercase">Loading Favourites...</span>
            </div>
        )
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] p-8 gap-4">
                <h2 className="text-2xl text-[#e63946] uppercase font-bold tracking-widest">Error</h2>
                <p className="text-[#999] text-sm text-center max-w-md">{error}</p>
                <button
                    onClick={() => dispatch(fetchFavorites())}
                    className="border border-[#666] px-6 py-2 text-xs tracking-widest hover:border-[#f4f3ed] transition-colors uppercase"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans px-8 md:px-16 lg:px-24 py-12">

            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="font-mono text-xs tracking-widest text-[#999] hover:text-[#f4f3ed] transition-colors mb-10 block"
            >
                ← BACK
            </button>

            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold uppercase tracking-tight">
                        MY FAVOURITES
                    </h1>
                    <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">
                        Your personal collection
                    </p>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-[#e63946]">
                    [{favorites.length} SAVED]
                </span>
            </div>

            {/* Empty state */}
            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#222]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <div className="text-center">
                        <p className="font-mono text-xs tracking-widest text-[#555] uppercase">No favourites yet</p>
                        <p className="text-[#444] text-sm mt-2">
                            Hover over any movie card and click the ❤ button to save it here.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        className="border border-[#333] px-6 py-2 text-xs font-mono tracking-widest hover:border-[#f4f3ed] transition-colors uppercase"
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                /* Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {favorites.map((fav) => (
                        <FavoriteCard key={fav.tmdbId} fav={fav} />
                    ))}
                </div>
            )}
        </div>
    )
}
