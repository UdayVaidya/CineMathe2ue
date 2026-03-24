import { useState, useEffect } from "react"
import {
  getMovieBasic, getMovieCredits, getMovieVideos,
  getTVBasic, getTVCredits, getTVVideos,
} from "../services/movie.api"

// ── Client-side session cache — survives route changes, cleared on page refresh
// Key: `${type}:${id}:basic|credits|videos`
const detailCache = new Map()

function cacheKey(type, id, part) { return `${type}:${id}:${part}` }
function fromCache(type, id, part) { return detailCache.get(cacheKey(type, id, part)) || null }
function toCache(type, id, part, data) { detailCache.set(cacheKey(type, id, part), data) }

/**
 * Fetch strategy:
 * - Cache hit  → return instantly, no network call, no loading states
 * - Cache miss → fire all 3 requests in parallel (basic + credits + videos)
 *   Basic info populates immediately, credits/videos stream in after
 */
export default function useMovieDetails(id, type = "movie") {
  const [movie,          setMovie]          = useState(null)
  const [credits,        setCredits]        = useState(null)
  const [videos,         setVideos]         = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [creditsLoading, setCreditsLoading] = useState(true)
  const [error,          setError]          = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const fetchBasic   = type === "tv" ? getTVBasic    : getMovieBasic
    const fetchCredits = type === "tv" ? getTVCredits  : getMovieCredits
    const fetchVideos  = type === "tv" ? getTVVideos   : getMovieVideos

    // ── Check cache first ───────────────────────────────────────────────────
    const cachedBasic   = fromCache(type, id, "basic")
    const cachedCredits = fromCache(type, id, "credits")
    const cachedVideos  = fromCache(type, id, "videos")

    if (cachedBasic) {
      // Everything already cached — render instantly, skip all loading states
      setMovie(cachedBasic)
      setCredits(cachedCredits)
      setVideos(cachedVideos)
      setLoading(false)
      setCreditsLoading(!cachedCredits && !cachedVideos ? false : false)
      setError(null)
      return
    }

    // ── Fresh fetch — reset state ───────────────────────────────────────────
    setMovie(null); setCredits(null); setVideos(null)
    setLoading(true); setCreditsLoading(true); setError(null)

    // Fire all 3 in parallel — basic resolves fast and unlocks the page,
    // credits/videos arrive slightly after
    fetchBasic(id)
      .then(data => {
        if (cancelled) return
        toCache(type, id, "basic", data)
        setMovie(data)
        setLoading(false)
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })

    Promise.all([fetchCredits(id), fetchVideos(id)])
      .then(([c, v]) => {
        if (cancelled) return
        toCache(type, id, "credits", c)
        toCache(type, id, "videos",  v)
        setCredits(c)
        setVideos(v)
        setCreditsLoading(false)
      })
      .catch(() => {
        if (!cancelled) setCreditsLoading(false)
      })

    return () => { cancelled = true }
  }, [id, type])

  const merged = movie ? { ...movie, credits: credits || null, videos: videos || null } : null
  return { movie: merged, loading, creditsLoading, error }
}