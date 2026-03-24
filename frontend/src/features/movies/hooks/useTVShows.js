import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPopularTVShows } from "../store/movieSlice"

export default function useTVShows() {
    const dispatch = useDispatch()
    const { tvShows, tvLoading, error } = useSelector((state) => state.movies)

    useEffect(() => {
        // Skip fetch if data is already cached in the store
        if (tvShows.length === 0) {
            dispatch(fetchPopularTVShows())
        }
    }, [dispatch])

    return { tvShows, loading: tvLoading, error }
}