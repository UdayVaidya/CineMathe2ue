import { useState, memo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useMovieDetails from "../hooks/useMoviesDetails"

// ── Cast skeleton — shown while credits are loading
function CastSkeleton() {
    return (
        <div className="cast-grid">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="cast-skeleton">
                    <div className="cast-skeleton__avatar skeleton" />
                    <div className="cast-skeleton__name skeleton" />
                    <div className="cast-skeleton__role skeleton" />
                </div>
            ))}
        </div>
    )
}

// ── Single cast card
const CastCard = memo(function CastCard({ person, index }) {
    const [imgLoaded, setImgLoaded] = useState(false)
    const src = person.profile_path
        ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
        : null

    return (
        <div className="cast-card" style={{ animationDelay: `${Math.min(index * 0.04, 0.5)}s` }}>
            <div className="cast-card__avatar">
                {!imgLoaded && <div className="cast-card__shimmer skeleton" />}
                {src ? (
                    <img
                        src={src}
                        alt={person.name}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setImgLoaded(true)}
                        className={`cast-card__img ${imgLoaded ? "cast-card__img--loaded" : ""}`}
                    />
                ) : (
                    <div className="cast-card__no-img">?</div>
                )}
            </div>
            <p className="cast-card__name">{person.name}</p>
            {person.character && (
                <p className="cast-card__role">{person.character}</p>
            )}
        </div>
    )
})

// ── Page skeleton — shown while basic movie info loads
function PageSkeleton() {
    return (
        <div className="detail-page">
            <div className="detail-back">
                <div className="skeleton" style={{ width: 60, height: 14 }} />
            </div>
            <div className="detail-main">
                <div className="detail-poster skeleton" style={{ aspectRatio: "2/3", width: "100%", maxWidth: 280 }} />
                <div className="detail-info">
                    <div className="skeleton" style={{ height: 48, width: "70%", marginBottom: 16 }} />
                    <div className="skeleton" style={{ height: 20, width: "40%", marginBottom: 32 }} />
                    <div className="skeleton" style={{ height: 14, width: "100%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 8 }} />
                </div>
            </div>
        </div>
    )
}

export default function MoviesDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const type = window.location.pathname.startsWith("/tv") ? "tv" : "movie"

    const { movie, loading, creditsLoading, error } = useMovieDetails(id, type)
    const [showTrailer, setShowTrailer] = useState(false)

    if (loading) return <PageSkeleton />

    if (error || !movie) {
        return (
            <div className="detail-error">
                <p>RECORD NOT FOUND</p>
                <button onClick={() => navigate(-1)}>← GO BACK</button>
            </div>
        )
    }

    const title = movie.title || movie.name
    const year = movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
    const cast = movie.credits?.cast?.slice(0, 12) || []
    const trailer = movie.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube")
        || movie.videos?.results?.[0]

    const ratingColor = !movie.vote_average ? "#666"
        : movie.vote_average >= 8 ? "#f5c518"
            : movie.vote_average >= 6 ? "#e63946"
                : "#999"

    return (
        <div className="detail-page">

            {/* Backdrop */}
            {backdrop && (
                <div className="detail-backdrop">
                    <img src={backdrop} alt="" loading="eager" />
                    <div className="detail-backdrop__fade" />
                </div>
            )}

            {/* Back button */}
            <div className="detail-back">
                <button onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14 }}>
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    BACK
                </button>
            </div>

            {/* Main layout */}
            <div className="detail-main">

                {/* Poster */}
                <div className="detail-poster-wrap">
                    {poster ? (
                        <img src={poster} alt={title} className="detail-poster" />
                    ) : (
                        <div className="detail-poster detail-poster--empty">NO POSTER</div>
                    )}
                </div>

                {/* Info */}
                <div className="detail-info animate-fade-in">

                    <h1 className="detail-title">{title}</h1>

                    {/* Meta badges */}
                    <div className="detail-meta">
                        {year && <span className="detail-badge">{year}</span>}
                        {movie.vote_average > 0 && (
                            <span className="detail-badge detail-badge--rating" style={{ color: ratingColor, borderColor: ratingColor }}>
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                        )}
                        {movie.runtime && (
                            <span className="detail-badge">{movie.runtime} min</span>
                        )}
                        {(movie.number_of_seasons) && (
                            <span className="detail-badge">{movie.number_of_seasons} seasons</span>
                        )}
                        {movie.genres?.map(g => (
                            <span key={g.id} className="detail-badge detail-badge--genre">{g.name}</span>
                        ))}
                    </div>

                    {/* Trailer button — shows even before credits load */}
                    <div className="detail-trailer-wrap">
                        {movie.videos?.results?.length > 0 ? (
                            trailer ? (
                                <button className="detail-trailer-btn" onClick={() => setShowTrailer(true)}>
                                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}>
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    PLAY TRAILER
                                </button>
                            ) : null
                        ) : creditsLoading ? (
                            <div className="detail-trailer-skeleton skeleton" />
                        ) : (
                            <p className="detail-no-trailer">Trailer not available</p>
                        )}
                    </div>

                    {/* Overview */}
                    <div className="detail-section">
                        <h3 className="detail-section__label">Overview</h3>
                        <p className="detail-overview">
                            {movie.overview || "Description not available."}
                        </p>
                    </div>

                    {/* ── CAST — progressive: skeleton → real cards */}
                    <div className="detail-section">
                        <div className="detail-section__header">
                            <h3 className="detail-section__label">Cast</h3>
                            {creditsLoading && (
                                <span className="detail-credits-loading">
                                    <span className="detail-credits-spinner" />
                                    loading...
                                </span>
                            )}
                        </div>

                        {creditsLoading ? (
                            <CastSkeleton />
                        ) : cast.length > 0 ? (
                            <div className="cast-grid">
                                {cast.map((person, i) => (
                                    <CastCard key={person.id} person={person} index={i} />
                                ))}
                            </div>
                        ) : (
                            <p className="detail-no-cast">Cast information not available.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* Trailer modal */}
            {showTrailer && trailer && (
                <div className="trailer-overlay" onClick={() => setShowTrailer(false)}>
                    <div className="trailer-modal" onClick={e => e.stopPropagation()}>
                        <button className="trailer-close" onClick={() => setShowTrailer(false)}>
                            ✕ CLOSE
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title="Trailer"
                            className="trailer-iframe"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    )
}