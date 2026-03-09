import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { handleLogin, handleRegister } from "../services/auth.api"

export const loginUser = createAsyncThunk(
  "auth/handleLogin",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await handleLogin(credentials)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred during login"
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  "auth/handleRegister",
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await handleRegister(credentials)
      return data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred during registration"
      )
    }
  }
)

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: JSON.parse(localStorage.getItem("cs_user")) || null,
    token: localStorage.getItem("cs_token") || null,
    loading: false,
    error: null
  },

  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.removeItem("cs_token")
      localStorage.removeItem("cs_user")
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem("cs_token", action.payload.token)
        localStorage.setItem("cs_user", JSON.stringify(action.payload.user))
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem("cs_token", action.payload.token)
        localStorage.setItem("cs_user", JSON.stringify(action.payload.user))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  }
})

export const { logout } = authSlice.actions

export default authSlice.reducer