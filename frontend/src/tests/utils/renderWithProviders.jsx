// Shared test utilities
import React from 'react'
import { render } from '@testing-library/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

import authReducer from '../../features/auth/store/authSlice'
import movieReducer from '../../features/movies/store/movieSlice'
import searchReducer from '../../features/search/store/searchSlice'
import favoritesReducer from '../../features/favorites/store/favoritesSlice'

// Pre-built auth state — "logged in" user
const LOGGED_IN_AUTH = {
    user: { _id: 'u1', email: 'test@test.com', role: 'user' },
    token: 'fake-jwt',
    loading: false,
    error: null,
}

export function makeStore(preloadedState = {}) {
    return configureStore({
        reducer: {
            auth: authReducer,
            movies: movieReducer,
            search: searchReducer,
            favorites: favoritesReducer,
        },
        preloadedState,
    })
}

/**
 * renderWithProviders — wraps component in Redux store + MemoryRouter
 * @param {React.ReactElement} ui
 * @param {{ initialRoute, preloadedState, store }} options
 */
export function renderWithProviders(ui, {
    initialRoute = '/',
    preloadedState = {},
    store = makeStore({ auth: LOGGED_IN_AUTH, ...preloadedState }),
} = {}) {
    function Wrapper({ children }) {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[initialRoute]}>
                    {children}
                </MemoryRouter>
            </Provider>
        )
    }
    return { store, ...render(ui, { wrapper: Wrapper }) }
}

export { LOGGED_IN_AUTH }
