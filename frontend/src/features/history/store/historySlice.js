import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getHistory, addToHistory, clearHistory } from "../services/history.api"

export const fetchHistory = createAsyncThunk(
    "history/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getHistory()
            return res.data.watchHistory
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message)
        }
    }
)

export const addMovieToHistory = createAsyncThunk(
    "history/add",
    async ({ tmdbId, title, poster, mediaType }, { rejectWithValue }) => {
        try {
            const res = await addToHistory({ tmdbId, title, poster, mediaType })
            return res.data.watchHistory
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message)
        }
    }
)

export const clearAllHistory = createAsyncThunk(
    "history/clear",
    async (_, { rejectWithValue }) => {
        try {
            await clearHistory()
            return []
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message)
        }
    }
)

const historySlice = createSlice({
    name: "history",
    initialState: {
        history: [],
        loading: false,
        addLoading: false,
        clearLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch history
            .addCase(fetchHistory.pending, (state) => { state.loading = true; state.error = null })
            .addCase(fetchHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload })
            .addCase(fetchHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload })

            // Add to history
            .addCase(addMovieToHistory.pending, (state) => { state.addLoading = true })
            .addCase(addMovieToHistory.fulfilled, (state, action) => {
                state.addLoading = false
                state.history = action.payload
            })
            .addCase(addMovieToHistory.rejected, (state, action) => {
                state.addLoading = false
                state.error = action.payload
            })

            // Clear history
            .addCase(clearAllHistory.pending, (state) => { state.clearLoading = true })
            .addCase(clearAllHistory.fulfilled, (state, action) => {
                state.clearLoading = false
                state.history = action.payload
            })
            .addCase(clearAllHistory.rejected, (state, action) => {
                state.clearLoading = false
                state.error = action.payload
            })
    },
})

export default historySlice.reducer
