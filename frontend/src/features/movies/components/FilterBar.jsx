import { useState, useRef, useEffect, memo, useCallback } from "react"

const SORT_OPTIONS = [
    { value: "popularity.desc", label: "Most Popular" },
    { value: "vote_average.desc", label: "Top Rated" },
    { value: "release_date.desc", label: "Newest First" },
    { value: "release_date.asc", label: "Oldest First" },
    { value: "revenue.desc", label: "Highest Grossing" },
]

const RATING_OPTIONS = [
    { value: 0, label: "All Ratings" },
    { value: 5, label: "5+ ★" },
    { value: 6, label: "6+ ★" },
    { value: 7, label: "7+ ★" },
    { value: 8, label: "8+ ★" },
    { value: 9, label: "9+ ★" },
]

const MEDIA_OPTIONS = [
    { value: "movie", label: "Movies" },
    { value: "tv", label: "TV Shows" },
]

// Memoized so it only re-renders when its own options/value change
const FilterPill = memo(function FilterPill({ label, options, value, onChange }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        if (!open) return
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [open])

    const selected = options.find(o => o.value === value) || options[0]

    return (
        <div className="filter-pill-wrapper" ref={ref} style={{ position: "relative" }}>
            <button
                className={`filter-pill ${open ? "filter-pill--open" : ""}`}
                onClick={() => setOpen(v => !v)}
            >
                <span className="filter-pill__label">{selected.label}</span>
                <svg
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                    style={{
                        width: 12, height: 12, flexShrink: 0, transition: "transform 0.2s",
                        transform: open ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {open && (
                <div className="filter-dropdown">
                    {options.map(opt => (
                        <button
                            key={String(opt.value)}
                            className={`filter-dropdown__item ${opt.value === value ? "filter-dropdown__item--active" : ""}`}
                            onClick={() => { onChange(opt.value); setOpen(false) }}
                        >
                            {opt.label}
                            {opt.value === value && (
                                <svg viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
                                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth={2.5} fill="none" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
})

function FilterBar({ genres, filters, onFilterChange }) {
    const topGenres = (genres || []).slice(0, 20)
    const genreOptions = [{ id: null, name: "All Genres" }, ...topGenres].map(g => ({
        value: g.id,
        label: g.name,
    }))

    // Stable callbacks — prevent child re-renders on every parent render
    const handleGenreChange = useCallback((v) => onFilterChange({ genreId: v }), [onFilterChange])
    const handleRatingChange = useCallback((v) => onFilterChange({ minRating: v }), [onFilterChange])
    const handleSortChange = useCallback((v) => onFilterChange({ sortBy: v }), [onFilterChange])
    const handleMediaChange = useCallback((v) => onFilterChange({ mediaType: v, genreId: null }), [onFilterChange])
    const handleClear = useCallback(() => onFilterChange({ genreId: null, minRating: 0, sortBy: "popularity.desc" }), [onFilterChange])

    const hasActiveFilters = filters.genreId !== null || filters.minRating > 0 || filters.sortBy !== "popularity.desc"

    return (
        <div className="filter-bar">
            <div className="filter-bar__title">
                <span className="filter-bar__icon">⬡</span>
                BROWSE ALL
            </div>

            <div className="filter-bar__controls">
                {/* Media type toggle */}
                <div className="filter-toggle">
                    {MEDIA_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            className={`filter-toggle__btn ${filters.mediaType === opt.value ? "filter-toggle__btn--active" : ""}`}
                            onClick={() => handleMediaChange(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="filter-bar__pills">
                    <FilterPill label="Genre" options={genreOptions} value={filters.genreId} onChange={handleGenreChange} />
                    <FilterPill label="Rating" options={RATING_OPTIONS} value={filters.minRating} onChange={handleRatingChange} />
                    <FilterPill label="Sort" options={SORT_OPTIONS} value={filters.sortBy} onChange={handleSortChange} />
                </div>

                {hasActiveFilters && (
                    <button className="filter-clear" onClick={handleClear}>
                        Clear Filters ✕
                    </button>
                )}
            </div>
        </div>
    )
}

export default memo(FilterBar)
