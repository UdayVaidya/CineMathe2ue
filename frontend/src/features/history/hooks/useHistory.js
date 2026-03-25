import { useDispatch } from "react-redux"
import { useCallback } from "react"
import { addMovieToHistory } from "../store/historySlice"

/**
 * useHistory()
 * Provides a function to add a movie/tv show to the watch history.
 */
export default function useHistory() {
    const dispatch = useDispatch()

    const handleAddToHistory = useCallback((movie) => {
        if (!movie) return

        const tmdbId   = movie.id
        const title     = movie.title || movie.name || "Unknown"
        const poster    = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : ""
        const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")

        dispatch(addMovieToHistory({ tmdbId, title, poster, mediaType }))
    }, [dispatch])

    return { handleAddToHistory }
}
