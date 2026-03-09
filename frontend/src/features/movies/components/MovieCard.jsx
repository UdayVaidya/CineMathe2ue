import { memo, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toggleFavorite, selectIsFavorite, selectToggleLoading } from "../../favorites/store/favoritesSlice"

// w342 instead of w500 — ~40% smaller file, still sharp on cards
const POSTER_BASE = "https://image.tmdb.org/t/p/w342"

function MovieCard({ movie, index = 0 }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [imgLoaded, setImgLoaded] = useState(false)

    const tmdbId = movie?.id
    const isFav = useSelector(selectIsFavorite(tmdbId))
    const isLoading = useSelector(selectToggleLoading(tmdbId))

    const image = movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : null
    const title = movie.title || movie.name || "Unknown"
    const year = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'
    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")
    const rating = movie.vote_average?.toFixed(1)

    // Stable references — prevent child re-renders when parent re-renders
    const handleClick = useCallback(() => navigate(`/${mediaType}/${movie.id}`), [navigate, mediaType, movie.id])
    const handleImgLoad = useCallback(() => setImgLoaded(true), [])

    const handleFavClick = useCallback((e) => {
        e.stopPropagation()
        if (isLoading) return
        dispatch(toggleFavorite({
            tmdbId,
            title,
            poster: movie.poster_path ? `${POSTER_BASE}${movie.poster_path}` : "",
            mediaType,
        }))
    }, [dispatch, isLoading, tmdbId, title, movie.poster_path, mediaType])

    const ratingColor = !rating ? "#666"
        : parseFloat(rating) >= 8 ? "#f5c518"
            : parseFloat(rating) >= 6 ? "#e63946"
                : "#999"

    return (
        <div
            onClick={handleClick}
            className="movie-card group"
            style={{ animationDelay: `${Math.min(index * 0.03, 0.5)}s` }}
        >
            {/* Poster */}
            <div className="movie-card__poster">
                {!imgLoaded && <div className="movie-card__shimmer skeleton" />}

                {image ? (
                    <img
                        src={image}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        fetchPriority={index < 5 ? "high" : "auto"}
                        onLoad={handleImgLoad}
                        className={`movie-card__img ${imgLoaded ? "movie-card__img--loaded" : ""}`}
                    />
                ) : (
                    <div className="movie-card__no-poster"><span>NO POSTER</span></div>
                )}

                <div className="movie-card__overlay" />

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

                {/* Media type badge */}
                <div className="movie-card__type-badge">
                    {mediaType === "tv" ? "TV" : "FILM"}
                </div>
            </div>

            {/* Info */}
            <div className="movie-card__info">
                <h3 className="movie-card__title">{title}</h3>
                <div className="movie-card__meta">
                    <span className="movie-card__year">{year}</span>
                    {rating && (
                        <span className="movie-card__rating" style={{ color: ratingColor, borderColor: ratingColor }}>
                            ★ {rating}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

// React.memo — only re-renders if movie data or index changes
export default memo(MovieCard, (prev, next) =>
    prev.movie.id === next.movie.id &&
    prev.index === next.index
)