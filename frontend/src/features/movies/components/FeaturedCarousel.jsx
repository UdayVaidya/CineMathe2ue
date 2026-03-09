import { useRef, useState, useEffect, useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"

const POSTER_BASE = "https://image.tmdb.org/t/p/w342"

// Single slide card  
const SlideCard = memo(function SlideCard({ item }) {
    const navigate = useNavigate()
    const [loaded, setLoaded] = useState(false)

    const title = item.title || item.name || "Unknown"
    const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]
    const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie")
    const rating = item.vote_average?.toFixed(1)
    const poster = item.poster_path ? `${POSTER_BASE}${item.poster_path}` : null
    const typeColor = mediaType === "tv" ? "#3b82f6" : "#e63946"
    const typeLabel = mediaType === "tv" ? "TV" : "FILM"

    return (
        <div
            className="featured-card"
            onClick={() => navigate(`/${mediaType}/${item.id}`)}
        >
            <div className="featured-card__poster">
                {!loaded && <div className="featured-card__shimmer skeleton" />}
                {poster ? (
                    <img
                        src={poster}
                        alt={title}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => setLoaded(true)}
                        className={`featured-card__img ${loaded ? "featured-card__img--loaded" : ""}`}
                    />
                ) : (
                    <div className="featured-card__no-img">🎬</div>
                )}
                <div className="featured-card__overlay" />
                <div className="featured-card__badge" style={{ color: typeColor, borderColor: typeColor }}>
                    {typeLabel}
                </div>
            </div>
            <div className="featured-card__info">
                <p className="featured-card__title">{title}</p>
                <div className="featured-card__meta">
                    {year && <span>{year}</span>}
                    {rating && parseFloat(rating) > 0 && (
                        <span style={{ color: "#e63946" }}>★ {rating}</span>
                    )}
                </div>
            </div>
        </div>
    )
})

/**
 * Auto-scrolling horizontal carousel
 * Mixes movies + tvShows into one row, auto-advances every `interval` ms
 */
function FeaturedCarousel({ movies = [], tvShows = [], interval = 3000 }) {
    const trackRef = useRef(null)
    const autoRef = useRef(null)
    const [canLeft, setCanLeft] = useState(false)
    const [canRight, setCanRight] = useState(true)
    const [paused, setPaused] = useState(false)

    // Interleave: movie, tv, movie, tv ...
    const items = []
    const maxLen = Math.max(movies.length, tvShows.length)
    for (let i = 0; i < maxLen; i++) {
        if (movies[i]) items.push({ ...movies[i], media_type: "movie" })
        if (tvShows[i]) items.push({ ...tvShows[i], media_type: "tv" })
    }

    const syncArrows = useCallback(() => {
        const el = trackRef.current
        if (!el) return
        setCanLeft(el.scrollLeft > 8)
        setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
    }, [])

    useEffect(() => {
        const el = trackRef.current
        if (!el) return
        syncArrows()
        el.addEventListener("scroll", syncArrows, { passive: true })
        return () => el.removeEventListener("scroll", syncArrows)
    }, [syncArrows, items.length])

    const scrollBy = useCallback((dir) => {
        const el = trackRef.current
        if (!el) return
        const cardW = 175 // approximate carousel-item width
        el.scrollBy({ left: dir === "left" ? -cardW * 3 : cardW * 3, behavior: "smooth" })
    }, [])

    // Auto-scroll: advance by 2 cards every interval
    useEffect(() => {
        if (paused) return
        autoRef.current = setInterval(() => {
            const el = trackRef.current
            if (!el) return
            const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 8
            if (atEnd) {
                el.scrollTo({ left: 0, behavior: "smooth" }) // loop back
            } else {
                el.scrollBy({ left: 175 * 2, behavior: "smooth" })
            }
        }, interval)
        return () => clearInterval(autoRef.current)
    }, [paused, interval])

    if (!items.length) return null

    return (
        <div
            className="featured-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Header */}
            <div className="featured-carousel__header">
                <div>
                    <h2 className="featured-carousel__title">FEATURED</h2>
                    <p className="featured-carousel__sub">Movies &amp; TV · Hand-picked</p>
                </div>
                <div className="featured-carousel__arrows">
                    <button
                        className={`carousel-arrow ${canLeft ? "carousel-arrow--visible" : ""}`}
                        onClick={() => { scrollBy("left"); setPaused(true) }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>
                    <button
                        className={`carousel-arrow carousel-arrow--right ${canRight ? "carousel-arrow--visible" : ""}`}
                        onClick={() => { scrollBy("right"); setPaused(true) }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Auto/pause indicator */}
                    <div className="featured-carousel__status">
                        <div className={`featured-carousel__dot ${!paused ? "featured-carousel__dot--active" : ""}`} />
                        <span>{paused ? "PAUSED" : "AUTO"}</span>
                    </div>
                </div>
            </div>

            {/* Track */}
            <div className="featured-carousel__wrap">
                <div className="carousel-fade carousel-fade--left  featured-carousel__fade-left carousel-fade--visible" />
                <div className="carousel-fade carousel-fade--right featured-carousel__fade-right carousel-fade--visible" />

                <div ref={trackRef} className="featured-carousel__track">
                    {items.map((item, i) => (
                        <div key={`${item.id}-${item.media_type}`} className="featured-carousel__item">
                            <SlideCard item={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(FeaturedCarousel)
