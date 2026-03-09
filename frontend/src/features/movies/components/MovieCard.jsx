import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleFavorite, selectIsFavorite, selectToggleLoading } from "../../favorites/store/favoritesSlice"

export default function MovieCard({ movie }) {
    const navigate  = useNavigate()
    const dispatch  = useDispatch()

    const tmdbId    = movie?.id
    const isFav     = useSelector(selectIsFavorite(tmdbId))
    const isLoading = useSelector(selectToggleLoading(tmdbId))

    const image     = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null
    const title     = movie.title || movie.name || "Unknown"
    const year      = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'
    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")

    const handleClick = () => navigate(`/${mediaType}/${movie.id}`)

    const handleFavClick = (e) => {
        e.stopPropagation()   // card click ko navigate hone se rokta hai
        if (isLoading) return
        dispatch(toggleFavorite({
            tmdbId,
            title,
            poster:    movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "",
            mediaType,
        }))
    }

    return (
        <div
            onClick={handleClick}
            className="group relative w-full aspect-[2/3] bg-[#0a0a0a] border border-[#333] hover:border-[#e63946] transition-colors cursor-pointer overflow-hidden"
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(230,57,70,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />

            {/* Poster Image */}
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
                    <span className="font-mono text-[10px] text-[#444] tracking-widest text-center px-4">NO POSTER</span>
                </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* ❤ Heart Button — top left, hover pe dikhta hai */}
            <button
                onClick={handleFavClick}
                disabled={isLoading}
                className={`
                    absolute top-3 left-3 z-20
                    w-8 h-8 flex items-center justify-center
                    border transition-all duration-200
                    opacity-0 group-hover:opacity-100
                    ${isFav
                        ? "bg-[#e63946] border-[#e63946] text-white"
                        : "bg-[#0a0a0a]/80 border-[#555] text-[#999] hover:border-[#e63946] hover:text-[#e63946]"
                    }
                    disabled:cursor-not-allowed
                `}
                title={isFav ? "Favourites se hatao" : "Favourites mein add karo"}
            >
                {isLoading ? (
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin block" />
                ) : (
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                )}
            </button>

            {/* Info Block */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#f4f3ed] uppercase tracking-tight leading-none group-hover:text-[#e63946] transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>
                <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-4">
                    <span className="font-mono text-[10px] tracking-widest text-[#999] bg-[#141414] px-2 py-1 border border-[#333]">
                        {year}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-[#e63946] border border-[#e63946] px-2 py-1 font-bold">
                        {movie.vote_average?.toFixed(1) || 'NR'}
                    </span>
                </div>
            </div>

            {/* REC badge */}
            <div className="absolute top-3 right-3 font-mono text-[8px] tracking-widest text-[#e63946] opacity-0 group-hover:opacity-100 border border-[#e63946] px-1 bg-[#0a0a0a]">
                REC
            </div>
        </div>
    )
}