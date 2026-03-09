import { useCallback, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchDiscoverMovies, setFilters } from "../store/movieSlice"

const selectDiscover = (state) => ({
    discover: state.movies.discover,
    discoverPage: state.movies.discoverPage,
    discoverTotalPages: state.movies.discoverTotalPages,
    discoverLoading: state.movies.discoverLoading,
    discoverAppending: state.movies.discoverAppending,
    filters: state.movies.filters,
    genres: state.movies.genres,
})

export default function useInfiniteDiscover() {
    const dispatch = useDispatch()
    const {
        discover, discoverPage, discoverTotalPages,
        discoverLoading, discoverAppending, filters, genres,
    } = useSelector(selectDiscover)

    // Refs that always hold the latest values
    const loadingRef = useRef(discoverLoading)
    const appendingRef = useRef(discoverAppending)
    const pageRef = useRef(discoverPage)
    const totalPagesRef = useRef(discoverTotalPages)
    const filtersRef = useRef(filters)
    const observerRef = useRef(null)

    loadingRef.current = discoverLoading
    appendingRef.current = discoverAppending
    pageRef.current = discoverPage
    totalPagesRef.current = discoverTotalPages
    filtersRef.current = filters

    // Fetch page 1 whenever filters change
    useEffect(() => {
        dispatch(fetchDiscoverMovies({ ...filters, page: 1 }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, filters.genreId, filters.minRating, filters.sortBy, filters.mediaType])

    // ── CALLBACK REF: Observer is attached the moment sentinel enters the DOM
    //    (fixes the bug where observer was set up before sentinel was rendered)
    const sentinelRef = useCallback((el) => {
        // Disconnect previous observer if sentinel unmounts
        if (observerRef.current) {
            observerRef.current.disconnect()
            observerRef.current = null
        }
        if (!el) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    !loadingRef.current &&
                    !appendingRef.current &&
                    pageRef.current < totalPagesRef.current
                ) {
                    dispatch(fetchDiscoverMovies({
                        ...filtersRef.current,
                        page: pageRef.current + 1,
                    }))
                }
            },
            { rootMargin: "400px", threshold: 0 }
        )

        observer.observe(el)
        observerRef.current = observer
    }, [dispatch]) // stable — only dispatch, which never changes

    const updateFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters))
    }, [dispatch])

    return {
        movies: discover,
        loading: discoverLoading,
        appending: discoverAppending,
        hasMore: discoverPage < discoverTotalPages,
        filters,
        genres,
        updateFilters,
        sentinelRef, // this is now a callback ref, not a useRef
    }
}
