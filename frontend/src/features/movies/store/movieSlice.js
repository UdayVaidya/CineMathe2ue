import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
    getTrendingMovies,
    getPopularMovies,
    getPopularTVShows,
    getMovieGenres,
    getTVGenres,
    discoverMedia,
} from "../services/movie.api"

export const fetchTrendingMovies = createAsyncThunk(
    "movies/trending",
    async (_, { rejectWithValue }) => {
        try { return await getTrendingMovies() }
        catch (error) { return rejectWithValue(error.response?.data || error.message) }
    }
)

export const fetchPopularMovies = createAsyncThunk(
    "movies/popular",
    async (_, { rejectWithValue }) => {
        try { return await getPopularMovies() }
        catch (error) { return rejectWithValue(error.response?.data || error.message) }
    }
)

export const fetchPopularTVShows = createAsyncThunk(
    "movies/tvShows",
    async (_, { rejectWithValue }) => {
        try { return await getPopularTVShows() }
        catch (error) { return rejectWithValue(error.response?.data || error.message) }
    }
)

export const fetchGenres = createAsyncThunk(
    "movies/genres",
    async (_, { rejectWithValue }) => {
        try {
            const [movies, tv] = await Promise.all([getMovieGenres(), getTVGenres()])
            // Merge and dedupe by id
            const map = {}
                ;[...movies, ...tv].forEach(g => { map[g.id] = g })
            return Object.values(map)
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

// Infinite scroll discover — pass { reset: true } to start fresh
export const fetchDiscoverMovies = createAsyncThunk(
    "movies/discover",
    async ({ genreId, minRating, sortBy, mediaType, page }, { rejectWithValue }) => {
        try {
            return await discoverMedia({ genreId, minRating, sortBy, mediaType, page })
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message)
        }
    }
)

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        trending: [],
        popular: [],
        tvShows: [],
        trendingLoading: false,
        popularLoading: false,
        tvLoading: false,
        error: null,

        // Genres
        genres: [],
        genresLoading: false,

        // Discover / Filtered Browse with Infinite Scroll
        discover: [],
        discoverPage: 1,
        discoverTotalPages: 1,
        discoverLoading: false,
        discoverAppending: false, // true when loading next pages (not first)

        // Active Filters
        filters: {
            mediaType: "movie",
            genreId: null,
            minRating: 0,
            sortBy: "popularity.desc",
        },
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload }
            // Reset discover when filters change
            state.discover = []
            state.discoverPage = 1
            state.discoverTotalPages = 1
        },
        resetDiscover(state) {
            state.discover = []
            state.discoverPage = 1
            state.discoverTotalPages = 1
        },
    },
    extraReducers: (builder) => {
        builder
            // Trending
            .addCase(fetchTrendingMovies.pending, (state) => { state.trendingLoading = true })
            .addCase(fetchTrendingMovies.fulfilled, (state, action) => { state.trendingLoading = false; state.trending = action.payload })
            .addCase(fetchTrendingMovies.rejected, (state, action) => { state.trendingLoading = false; state.error = action.payload })

            // Popular
            .addCase(fetchPopularMovies.pending, (state) => { state.popularLoading = true })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => { state.popularLoading = false; state.popular = action.payload })
            .addCase(fetchPopularMovies.rejected, (state, action) => { state.popularLoading = false; state.error = action.payload })

            // TV Shows
            .addCase(fetchPopularTVShows.pending, (state) => { state.tvLoading = true })
            .addCase(fetchPopularTVShows.fulfilled, (state, action) => { state.tvLoading = false; state.tvShows = action.payload })
            .addCase(fetchPopularTVShows.rejected, (state, action) => { state.tvLoading = false; state.error = action.payload })

            // Genres
            .addCase(fetchGenres.pending, (state) => { state.genresLoading = true })
            .addCase(fetchGenres.fulfilled, (state, action) => { state.genresLoading = false; state.genres = action.payload })
            .addCase(fetchGenres.rejected, (state, action) => { state.genresLoading = false })

            // Discover (Infinite Scroll)
            .addCase(fetchDiscoverMovies.pending, (state, action) => {
                const page = action.meta.arg?.page || 1
                if (page === 1) state.discoverLoading = true
                else state.discoverAppending = true
            })
            .addCase(fetchDiscoverMovies.fulfilled, (state, action) => {
                const { results, totalPages, page } = action.payload
                state.discoverLoading = false
                state.discoverAppending = false
                if (page === 1) {
                    state.discover = results
                } else {
                    // Append, dedupe by id
                    const existingIds = new Set(state.discover.map(m => m.id))
                    state.discover = [...state.discover, ...results.filter(m => !existingIds.has(m.id))]
                }
                state.discoverPage = page
                state.discoverTotalPages = totalPages
            })
            .addCase(fetchDiscoverMovies.rejected, (state) => {
                state.discoverLoading = false
                state.discoverAppending = false
            })
    }
})

export const { setFilters, resetDiscover } = movieSlice.actions
export default movieSlice.reducer