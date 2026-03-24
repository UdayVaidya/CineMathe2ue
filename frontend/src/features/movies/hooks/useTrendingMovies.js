import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrendingMovies } from "../store/movieSlice"

export default function useTrendingMovies() {
    const dispatch = useDispatch()
    const { trending, trendingLoading, error } = useSelector((state) => state.movies)

    useEffect(() => {
        // Skip fetch if data is already cached in the store
        if (trending.length === 0) {
            dispatch(fetchTrendingMovies())
        }
    }, [dispatch])

    return { trending, loading: trendingLoading, error }
}