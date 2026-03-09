import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getTrendingMovies, getPopularMovies, getPopularTVShows } from "../services/movie.api"

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

const movieSlice = createSlice({
    name: "movies",
    initialState: {
        trending: [],
        popular: [],
        tvShows: [],
        trendingLoading: false,
        popularLoading: false,
        tvLoading: false,
        error: null
    },
    reducers: {},
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
    }
})

export default movieSlice.reducer