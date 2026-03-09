import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchSearchResults, clearSearch } from "../store/searchSlice"
import useDebounce from "../../../shared/hooks/useDebounce"

const TYPE_COLORS = {
  movie: { color: "#e63946", label: "FILM" },
  tv: { color: "#3b82f6", label: "TV" },
  person: { color: "#888", label: "PERSON" },
}

// ── Skeleton card
function SearchCardSkeleton() {
  return (
    <div className="search-skeleton">
      <div className="search-skeleton__poster skeleton" />
      <div className="search-skeleton__info">
        <div className="search-skeleton__title skeleton" />
        <div className="search-skeleton__meta skeleton" />
      </div>
    </div>
  )
}

// ── Single result card (memoized)
const SearchCard = memo(function SearchCard({ item, onClick, index }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const title = item.title || item.name || "Unknown"
  const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]
  const type = item.media_type || "movie"
  const badge = TYPE_COLORS[type] || TYPE_COLORS.movie
  const rating = item.vote_average?.toFixed(1)

  // w342 — smaller, faster than w500
  const image = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : item.profile_path
      ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
      : null

  const isClickable = type !== "person"

  return (
    <div
      className={`search-card ${isClickable ? "search-card--clickable" : ""}`}
      onClick={isClickable ? () => onClick(item) : undefined}
      style={{ animationDelay: `${Math.min(index * 0.03, 0.4)}s` }}
    >
      <div className="search-card__poster">
        {!imgLoaded && image && <div className="search-card__shimmer skeleton" />}
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            fetchPriority={index < 6 ? "high" : "auto"}
            onLoad={() => setImgLoaded(true)}
            className={`search-card__img ${imgLoaded ? "search-card__img--loaded" : ""}`}
          />
        ) : (
          <div className="search-card__no-img">
            {type === "person" ? "👤" : "🎬"}
          </div>
        )}
        <div className="search-card__overlay" />
        <div className="search-card__badge" style={{ color: badge.color, borderColor: badge.color }}>
          {badge.label}
        </div>
      </div>
      <div className="search-card__info">
        <p className="search-card__title">{title}</p>
        <div className="search-card__meta">
          {year && <span className="search-card__year">{year}</span>}
          {rating && parseFloat(rating) > 0 && (
            <span className="search-card__rating">★ {rating}</span>
          )}
        </div>
      </div>
    </div>
  )
})

export default function SearchPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { results, loading, query, fromCache } = useSelector(s => s.search)
  const [inputValue, setInputValue] = useState(query || "") // restore on back nav
  const debouncedQuery = useDebounce(inputValue, 300)

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Fire search when debounced query changes
  useEffect(() => {
    const q = debouncedQuery.trim()
    if (q.length >= 2) {
      dispatch(fetchSearchResults(q))
    } else if (q.length === 0) {
      dispatch(clearSearch())
    }
  }, [debouncedQuery, dispatch])

  const handleCardClick = useCallback((item) => {
    const type = item.media_type || "movie"
    navigate(`/${type}/${item.id}`)
  }, [navigate])

  const handleClear = useCallback(() => {
    setInputValue("")
    dispatch(clearSearch())
    inputRef.current?.focus()
  }, [dispatch])

  const filteredResults = results.filter(item => item.poster_path || item.profile_path)
  const showSkeleton = loading && !fromCache && filteredResults.length === 0
  const showResults = !loading || fromCache || filteredResults.length > 0

  return (
    <div className="search-page">

      {/* ── Header */}
      <div className="search-page__header">
        <button className="search-back" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ width: 13, height: 13 }}>
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>

        <h1 className="search-page__title">SEARCH ARCHIVE</h1>

        {/* Search input */}
        <div className="search-input-wrap">
          <svg className="search-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Movies, TV shows, people..."
            className="search-input"
            autoComplete="off"
            spellCheck="false"
          />
          {/* Inline spinner while loading */}
          {loading && !fromCache && (
            <div className="search-input__spinner" />
          )}
          {inputValue && !loading && (
            <button className="search-input__clear" onClick={handleClear}>✕</button>
          )}
        </div>

        {/* Status line */}
        <div className="search-status">
          {debouncedQuery.trim().length >= 2 && !loading && (
            <span>
              {filteredResults.length > 0
                ? <>{filteredResults.length} results for <em>"{query}"</em>{fromCache && <span className="search-cached"> (cached)</span>}</>
                : query ? "No records found" : null
              }
            </span>
          )}
          {debouncedQuery.trim().length === 1 && (
            <span>Type at least 2 characters...</span>
          )}
        </div>
      </div>

      {/* ── Results */}
      <div className="search-results">
        {showSkeleton ? (
          <div className="search-grid">
            {Array.from({ length: 10 }).map((_, i) => <SearchCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="search-grid">
            {filteredResults.map((item, i) => (
              <SearchCard
                key={item.id}
                item={item}
                index={i}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}