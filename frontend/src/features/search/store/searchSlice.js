import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { searchMulti } from "../services/search.api"

export const fetchSearchResults = createAsyncThunk(
  "search/fetch",
  async (query, { rejectWithValue }) => {
    try {
      const data = await searchMulti(query)
      return data.results
    } catch (error) {
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
    query: ""
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload
    },
    clearSearch: (state) => {
      state.results = []
      state.query = ""
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload
      })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setQuery, clearSearch } = searchSlice.actions
export default searchSlice.reducer