import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/auth/store/authSlice"
import movieReducer from "../features/movies/store/movieSlice"
import searchReducer from "../features/search/store/searchSlice"
import favoritesReducer from "../features/favorites/store/favoritesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
})