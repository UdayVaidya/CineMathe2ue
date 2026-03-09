import { useDispatch, useSelector } from "react-redux"
import { toggleFavorite, selectIsFavorite, selectToggleLoading } from "../store/favoritesSlice"

/**
 * useFavorite(movie)
 * Returns { isFav, isLoading, handleToggle }
 * Works for both TMDB movies and TV shows.
 */
export default function useFavorite(movie) {
    const dispatch = useDispatch()

    const tmdbId   = movie?.id
    const isFav    = useSelector(selectIsFavorite(tmdbId))
    const isLoading = useSelector(selectToggleLoading(tmdbId))

    const handleToggle = (e) => {
        e?.stopPropagation()   // prevent card click / navigation
        if (!movie || isLoading) return

        const title     = movie.title || movie.name || "Unknown"
        const poster    = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : ""
        const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")

        dispatch(toggleFavorite({ tmdbId, title, poster, mediaType }))
    }

    return { isFav, isLoading, handleToggle }
}
