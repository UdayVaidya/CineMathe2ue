import { useState, useEffect } from "react"
import {
  getMovieBasic, getMovieCredits, getMovieVideos,
  getTVBasic, getTVCredits, getTVVideos,
} from "../services/movie.api"

/**
 * Two-phase fetch:
 *   Phase 1 — basic movie info (fast), renders the page skeleton immediately
 *   Phase 2 — credits + videos fired in parallel, streams in when ready
 *
 * This way the user sees the poster, title, overview, genres in ~300-500ms
 * instead of waiting for credits (~800-1200ms extra) before anything shows.
 */
export default function useMovieDetails(id, type = "movie") {
  const [movie, setMovie] = useState(null)
  const [credits, setCredits] = useState(null)  // separate state — arrives later
  const [videos, setVideos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creditsLoading, setCreditsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const fetchBasic = type === "tv" ? getTVBasic : getMovieBasic
    const fetchCredits = type === "tv" ? getTVCredits : getMovieCredits
    const fetchVideos = type === "tv" ? getTVVideos : getMovieVideos

    // Reset state on id/type change
    setMovie(null)
    setCredits(null)
    setVideos(null)
    setLoading(true)
    setCreditsLoading(true)
    setError(null)

    // ── Phase 1: Basic info — renders page immediately
    fetchBasic(id)
      .then(data => {
        if (!cancelled) { setMovie(data); setLoading(false) }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })

    // ── Phase 2: Credits + videos in parallel — streams in after
    Promise.all([fetchCredits(id), fetchVideos(id)])
      .then(([c, v]) => {
        if (!cancelled) {
          setCredits(c)
          setVideos(v)
          setCreditsLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setCreditsLoading(false)
      })

    return () => { cancelled = true }
  }, [id, type])

  // Merge into single movie object for backward compat with the page component
  const merged = movie ? {
    ...movie,
    credits: credits || null,
    videos: videos || null,
  } : null

  return { movie: merged, loading, creditsLoading, error }
}