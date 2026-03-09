import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getFavorites, addFavorite, removeFavorite } from "../services/favorites.api"

export const fetchFavorites = createAsyncThunk(
    "favorites/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const res = await getFavorites()
            return res.data.favorites
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message)
        }
    }
)

export const toggleFavorite = createAsyncThunk(
    "favorites/toggle",
    async ({ tmdbId, title, poster, mediaType }, { getState, rejectWithValue }) => {
        try {
            const { favorites } = getState().favorites
            const isAlreadyFav = favorites.some((f) => f.tmdbId === tmdbId)

            if (isAlreadyFav) {
                await removeFavorite(tmdbId)
                return { tmdbId, action: "removed" }
            } else {
                const res = await addFavorite({ tmdbId, title, poster, mediaType })
                return { favorites: res.data.favorites, action: "added" }
            }
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message)
        }
    }
)

const favoritesSlice = createSlice({
    name: "favorites",
    initialState: {
        favorites:     [],
        loading:       false,
        toggleLoading: {},   // { [tmdbId]: true } — per-card spinner
        error:         null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.pending,   (state)          => { state.loading = true; state.error = null })
            .addCase(fetchFavorites.fulfilled,  (state, action)  => { state.loading = false; state.favorites = action.payload })
            .addCase(fetchFavorites.rejected,   (state, action)  => { state.loading = false; state.error = action.payload })

            .addCase(toggleFavorite.pending, (state, action) => {
                state.toggleLoading[action.meta.arg.tmdbId] = true
            })
            .addCase(toggleFavorite.fulfilled, (state, action) => {
                const id = action.meta.arg.tmdbId
                state.toggleLoading[id] = false
                if (action.payload.action === "removed") {
                    state.favorites = state.favorites.filter((f) => f.tmdbId !== action.payload.tmdbId)
                } else {
                    state.favorites = action.payload.favorites
                }
            })
            .addCase(toggleFavorite.rejected, (state, action) => {
                state.toggleLoading[action.meta.arg.tmdbId] = false
                state.error = action.payload
            })
    },
})

export default favoritesSlice.reducer

// Selectors
export const selectIsFavorite    = (tmdbId) => (state) => state.favorites.favorites.some((f) => f.tmdbId === tmdbId)
export const selectToggleLoading = (tmdbId) => (state) => !!state.favorites.toggleLoading[tmdbId]