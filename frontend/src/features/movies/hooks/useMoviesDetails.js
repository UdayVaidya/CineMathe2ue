import { useState, useEffect } from "react"
import { getMovieDetails, getTVShowDetails } from "../services/movie.api"

export default function useMovieDetails(id, type = "movie") {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetch = async () => {
      try {
        setLoading(true)
        const data = type === "tv"
          ? await getTVShowDetails(id)
          : await getMovieDetails(id)
        setMovie(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [id, type])

  return { movie, loading, error }
}