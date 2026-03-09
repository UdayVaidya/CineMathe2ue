import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchPopularMovies } from "../store/movieSlice"

export default function usePopularMovies() {
    const dispatch = useDispatch()
    const { popular, popularLoading, error } = useSelector((state) => state.movies)

    useEffect(() => {
        dispatch(fetchPopularMovies())
    }, [dispatch])

    return { popular, loading: popularLoading, error }
}