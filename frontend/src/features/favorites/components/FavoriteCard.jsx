import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleFavorite, selectToggleLoading } from "../store/favoritesSlice"

/**
 * FavoriteCard — renders a saved favourite from the DB.
 * The shape is { tmdbId, title, poster, mediaType, addedAt }
 * (different from a TMDB movie object, so it has its own card)
 */
export default function FavoriteCard({ fav }) {
    const navigate  = useNavigate()
    const dispatch  = useDispatch()
    const isLoading = useSelector(selectToggleLoading(fav.tmdbId))

    const handleClick = () => navigate(`/${fav.mediaType}/${fav.tmdbId}`)

    const handleRemove = (e) => {
        e.stopPropagation()
        dispatch(toggleFavorite({
            tmdbId:    fav.tmdbId,
            title:     fav.title,
            poster:    fav.poster,
            mediaType: fav.mediaType,
        }))
    }

    const addedDate = fav.addedAt
        ? new Date(fav.addedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        : null

    return (
        <div
            onClick={handleClick}
            className="group relative w-full aspect-[2/3] bg-[#0a0a0a] border border-[#333] hover:border-[#e63946] transition-colors cursor-pointer overflow-hidden"
        >
            {/* Poster */}
            {fav.poster ? (
                <img
                    src={fav.poster}
                    alt={fav.title}
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
            <div className={`absolute top-2 left-2 font-mono text-[8px] tracking-widest px-1 py-0.5 border bg-[#0a0a0a]/80 ${fav.mediaType === 'tv' ? 'text-[#3b82f6] border-[#3b82f6]/50' : 'text-[#e63946] border-[#e63946]/50'}`}>
                {fav.mediaType?.toUpperCase()}
            </div>

            {/* Remove button */}
            <button
                onClick={handleRemove}
                disabled={isLoading}
                className="absolute top-2 right-2 z-20 w-7 h-7 flex items-center justify-center bg-[#e63946] border border-[#e63946] text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#c02d39] disabled:opacity-50"
                title="Remove from Favourites"
            >
                {isLoading ? (
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                )}
            </button>

            {/* Info */}
            <div className="absolute bottom-0 left-0 w-full p-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="font-serif text-sm font-bold text-[#f4f3ed] uppercase leading-tight line-clamp-2 group-hover:text-[#e63946] transition-colors">
                    {fav.title}
                </p>
                {addedDate && (
                    <p className="font-mono text-[9px] text-[#555] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Saved {addedDate}
                    </p>
                )}
            </div>
        </div>
    )
}
