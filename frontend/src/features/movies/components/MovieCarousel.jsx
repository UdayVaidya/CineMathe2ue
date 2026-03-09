import { useRef, useState, useEffect, useCallback, memo } from "react"
import MovieCard from "./MovieCard"

function ArrowBtn({ direction, onClick, visible }) {
    return (
        <button
            className={`carousel-arrow carousel-arrow--${direction} ${visible ? "carousel-arrow--visible" : ""}`}
            onClick={onClick}
            aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                {direction === "left"
                    ? <polyline points="15 18 9 12 15 6" />
                    : <polyline points="9 18 15 12 9 6" />
                }
            </svg>
        </button>
    )
}

function MovieCarousel({ title, subtitle, movies = [], count }) {
    const trackRef = useRef(null)
    const [canLeft, setCanLeft] = useState(false)
    const [canRight, setCanRight] = useState(true)

    // Update arrow visibility on scroll
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
    }, [syncArrows, movies.length])

    const scrollBy = useCallback((dir) => {
        const el = trackRef.current
        if (!el) return
        const amount = Math.floor(el.clientWidth * 0.75)
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
    }, [])

    // Drag-to-scroll (mouse)
    const drag = useRef({ active: false, startX: 0, startScroll: 0 })
    const onMouseDown = useCallback((e) => {
        const el = trackRef.current
        if (!el) return
        drag.current = { active: true, startX: e.pageX, startScroll: el.scrollLeft }
        el.style.cursor = "grabbing"
        el.style.userSelect = "none"
    }, [])
    const onMouseMove = useCallback((e) => {
        if (!drag.current.active) return
        const el = trackRef.current
        if (!el) return
        el.scrollLeft = drag.current.startScroll - (e.pageX - drag.current.startX)
    }, [])
    const onMouseUp = useCallback(() => {
        drag.current.active = false
        const el = trackRef.current
        if (el) { el.style.cursor = "grab"; el.style.userSelect = "" }
    }, [])

    if (!movies.length) return null

    return (
        <div className="carousel-section">
            <div className="carousel-header">
                <div>
                    <h2 className="carousel-header__title">{title}</h2>
                    {subtitle && <p className="carousel-header__sub">{subtitle}</p>}
                </div>
                <div className="carousel-header__right">
                    {count !== undefined && (
                        <span className="carousel-header__count">[{count} RECORDS]</span>
                    )}
                    <div className="carousel-header__arrows">
                        <ArrowBtn direction="left" onClick={() => scrollBy("left")} visible={canLeft} />
                        <ArrowBtn direction="right" onClick={() => scrollBy("right")} visible={canRight} />
                    </div>
                </div>
            </div>

            <div className="carousel-wrap">
                {/* Left fade edge */}
                <div className={`carousel-fade carousel-fade--left  ${canLeft ? "carousel-fade--visible" : ""}`} />
                {/* Right fade edge */}
                <div className={`carousel-fade carousel-fade--right ${canRight ? "carousel-fade--visible" : ""}`} />

                <div
                    ref={trackRef}
                    className="carousel-track"
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    {movies.map((movie, i) => (
                        <div key={movie.id} className="carousel-item">
                            <MovieCard movie={movie} index={i} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default memo(MovieCarousel)
