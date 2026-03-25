import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleFavorite, selectIsFavorite, selectToggleLoading } from "../../favorites/store/favoritesSlice"

/**
 * HistoryCard — renders a watch history entry from the DB.
 * The shape is { tmdbId, title, poster, mediaType, watchedAt }
 */
export default function HistoryCard({ historyItem }) {
    const navigate  = useNavigate()
    const dispatch  = useDispatch()

    const handleClick = () => navigate(`/${historyItem.mediaType}/${historyItem.tmdbId}`)

    // Format date in a nice way, e.g., "12 Oct 2023, 14:30"
    const watchedDate = historyItem.watchedAt
        ? new Date(historyItem.watchedAt).toLocaleString("en-IN", { 
            day: "2-digit", 
            month: "short", 
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : null

    const tmdbId = historyItem.tmdbId
    const title = historyItem.title
    const poster = historyItem.poster || ""
    const mediaType = historyItem.mediaType

    const isFav = useSelector(selectIsFavorite(tmdbId))
    const isLoading = useSelector(selectToggleLoading(tmdbId))

    const handleFavClick = useCallback((e) => {
        e.stopPropagation()
        if (isLoading) return
        dispatch(toggleFavorite({
            tmdbId,
            title,
            poster,
            mediaType,
        }))
    }, [dispatch, isLoading, tmdbId, title, poster, mediaType])

    return (
        <div
            onClick={handleClick}
            className="history-card group relative w-full aspect-[2/3] bg-[#0a0a0a] border border-[#333] hover:border-[#e63946] transition-colors cursor-pointer overflow-hidden"
        >
            {/* Poster */}
            {historyItem.poster ? (
                <img
                    src={historyItem.poster}
                    alt={historyItem.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
                    <span className="font-mono text-[10px] text-[#444] tracking-widest px-4 text-center">NO POSTER</span>
                </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

            {/* Media type badge */}
            <div className={`absolute top-2 left-2 font-mono text-[8px] tracking-widest px-1 py-0.5 border bg-[#0a0a0a]/80 ${historyItem.mediaType === 'tv' ? 'text-[#3b82f6] border-[#3b82f6]/50' : 'text-[#e63946] border-[#e63946]/50'}`}>
                {historyItem.mediaType?.toUpperCase()}
            </div>

            {/* Fav Button */}
            <button
                onClick={handleFavClick}
                disabled={isLoading}
                className={`movie-card__fav ${isFav ? "movie-card__fav--active" : ""}`}
                title={isFav ? "Remove from Favourites" : "Add to Favourites"}
            >
                {isLoading ? (
                    <span className="movie-card__fav-spinner" />
                ) : (
                    <svg viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                )}
            </button>

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-serif text-sm font-bold text-[#f4f3ed] uppercase leading-tight line-clamp-2 group-hover:text-[#e63946] transition-colors">
                    {historyItem.title}
                </p>
                {watchedDate && (
                    <p className="font-mono text-[9px] text-[#555] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Watched {watchedDate}
                    </p>
                )}
            </div>
        </div>
    )
}
