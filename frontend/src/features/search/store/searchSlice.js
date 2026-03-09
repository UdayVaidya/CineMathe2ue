import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { searchMulti } from "../services/search.api"

// ── In-memory cache: query → results (lives for the session)
const cache = new Map()

export const fetchSearchResults = createAsyncThunk(
  "search/fetch",
  async (query, { rejectWithValue, signal }) => {
    // Cache hit → instant return, no network call
    const key = query.toLowerCase().trim()
    if (cache.has(key)) {
      return { results: cache.get(key), fromCache: true }
    }

    try {
      const data = await searchMulti(query, 1, signal)
      const results = data.results || []
      cache.set(key, results)  // store in cache
      return { results, fromCache: false }
    } catch (error) {
      if (error.name === "CanceledError" || error.name === "AbortError") {
        return rejectWithValue("cancelled")
      }
      return rejectWithValue(error.message)
    }
  }
)

const searchSlice = createSlice({
  name: "search",
  initialState: {
    results: [],
    loading: false,
    error: null,
    query: "",
    fromCache: false,
  },
  reducers: {
    setQuery: (state, action) => { state.query = action.payload },
    clearSearch: (state) => {
      state.results = []
      state.query = ""
      state.error = null
      state.loading = false
      state.fromCache = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state, action) => {
        // Don't show spinner for cache hits (they return immediately)
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.results
        state.fromCache = action.payload.fromCache
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        // Don't wipe results on abort — stale results are better than empty
        if (action.payload === "cancelled") return
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setQuery, clearSearch } = searchSlice.actions
export default searchSlice.reducer