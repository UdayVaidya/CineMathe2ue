import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPopularMovies } from "../store/movieSlice"

export default function usePopularMovies() {
    const dispatch = useDispatch()
    const { popular, popularLoading, error } = useSelector((state) => state.movies)

    useEffect(() => {
        // Skip fetch if data is already cached in the store
        if (popular.length === 0) {
            dispatch(fetchPopularMovies())
        }
    }, [dispatch])

    return { popular, loading: popularLoading, error }
}