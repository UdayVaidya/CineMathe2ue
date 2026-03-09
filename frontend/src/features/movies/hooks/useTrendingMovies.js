import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTrendingMovies } from "../store/movieSlice"

export default function useTrendingMovies() {
    const dispatch = useDispatch()
    const { trending, trendingLoading, error } = useSelector((state) => state.movies)

    useEffect(() => {
        dispatch(fetchTrendingMovies())
    }, [dispatch])

    return { trending, loading: trendingLoading, error }
}