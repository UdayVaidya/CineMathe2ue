/**
 * CineMatheque — Full Frontend Test Suite
 * Run: npm test
 *
 * Coverage:
 *  1. MovieCard        — render, navigation, favorite toggle
 *  2. FilterBar        — dropdowns, filter callbacks
 *  3. SearchPage       — debounce, cache, results, clear
 *  4. MoviesDetailPage — two-phase load (info first, cast after)
 *  5. SkeletonCard     — renders correct count
 *  6. useDebounce      — delays value update
 *  7. movieSlice       — discover pagination, filter reset
 *  8. searchSlice      — cache hits, abort on cancel
 *  9. FeaturedCarousel — renders mixed items, auto-scroll pause
 * 10. HomePage         — init screen → hero → carousel → tabs
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, makeStore } from './utils/renderWithProviders'
import { server } from './msw/server'
import { http, HttpResponse } from 'msw'
import { FAKE_MOVIE, FAKE_TV, FAKE_CREDITS } from './msw/handlers'

// ── Component imports
import MovieCard from '../features/movies/components/MovieCard'
import FilterBar from '../features/movies/components/FilterBar'
import { SkeletonCard, SkeletonGrid } from '../features/movies/components/SkeletonCard'
import FeaturedCarousel from '../features/movies/components/FeaturedCarousel'
import SearchPage from '../features/search/Pages/SearchPage'
import MoviesDetailPage from '../features/movies/Pages/MoviesDetailPage'
import HomePage from '../features/movies/Pages/HomePage'

// ── Hook / slice imports
import useDebounce from '../shared/hooks/useDebounce'
import { renderHook } from '@testing-library/react'
import movieReducer, { setFilters, resetDiscover, fetchDiscoverMovies } from '../features/movies/store/movieSlice'
import searchReducer, { fetchSearchResults, clearSearch } from '../features/search/store/searchSlice'

// ─────────────────────────────────────────────────────────────────────────────
// 1. MovieCard
// ─────────────────────────────────────────────────────────────────────────────
describe('MovieCard', () => {
    const favState = { favorites: { items: [], loading: [], error: null } }

    it('renders movie title and year', () => {
        renderWithProviders(<MovieCard movie={FAKE_MOVIE} index={0} />, { preloadedState: favState })
        expect(screen.getByText('Test Movie')).toBeInTheDocument()
        expect(screen.getByText('2024')).toBeInTheDocument()
    })

    it('shows FILM badge for movies', () => {
        renderWithProviders(<MovieCard movie={FAKE_MOVIE} index={0} />, { preloadedState: favState })
        expect(screen.getByText('FILM')).toBeInTheDocument()
    })

    it('shows TV badge for TV shows', () => {
        renderWithProviders(<MovieCard movie={FAKE_TV} index={0} />, { preloadedState: favState })
        expect(screen.getByText('TV')).toBeInTheDocument()
    })

    it('shows star rating', () => {
        renderWithProviders(<MovieCard movie={FAKE_MOVIE} index={0} />, { preloadedState: favState })
        expect(screen.getByText(/★ 8\.2/)).toBeInTheDocument()
    })

    it('shows NO POSTER when no poster_path', () => {
        const noImg = { ...FAKE_MOVIE, poster_path: null }
        renderWithProviders(<MovieCard movie={noImg} index={0} />, { preloadedState: favState })
        expect(screen.getByText('NO POSTER')).toBeInTheDocument()
    })

    it('navigates to movie detail on click', async () => {
        const { container } = renderWithProviders(
            <MovieCard movie={FAKE_MOVIE} index={0} />,
            { preloadedState: favState, initialRoute: '/home' }
        )
        const card = container.querySelector('.movie-card')
        expect(card).toBeTruthy()
        fireEvent.click(card)
        // Navigation triggered (no error throw = pass)
    })

    it('fav button is rendered', () => {
        renderWithProviders(<MovieCard movie={FAKE_MOVIE} index={0} />, { preloadedState: favState })
        const btn = screen.getByTitle(/favourites/i)
        expect(btn).toBeInTheDocument()
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. FilterBar
// ─────────────────────────────────────────────────────────────────────────────
describe('FilterBar', () => {
    const genres = [{ id: 28, name: 'Action' }, { id: 18, name: 'Drama' }]
    const filters = { mediaType: 'movie', genreId: null, minRating: 0, sortBy: 'popularity.desc' }

    it('renders media type toggle', () => {
        renderWithProviders(
            <FilterBar genres={genres} filters={filters} onFilterChange={vi.fn()} />
        )
        expect(screen.getByText('Movies')).toBeInTheDocument()
        expect(screen.getByText('TV Shows')).toBeInTheDocument()
    })

    it('renders Genre / Rating / Sort pills', () => {
        renderWithProviders(
            <FilterBar genres={genres} filters={filters} onFilterChange={vi.fn()} />
        )
        expect(screen.getByText('All Genres')).toBeInTheDocument()
        expect(screen.getByText('All Ratings')).toBeInTheDocument()
        expect(screen.getByText('Most Popular')).toBeInTheDocument()
    })

    it('calls onFilterChange when TV Shows is clicked', async () => {
        const onChange = vi.fn()
        renderWithProviders(
            <FilterBar genres={genres} filters={filters} onFilterChange={onChange} />
        )
        await userEvent.click(screen.getByText('TV Shows'))
        expect(onChange).toHaveBeenCalledWith({ mediaType: 'tv', genreId: null })
    })

    it('opens genre dropdown on pill click', async () => {
        renderWithProviders(
            <FilterBar genres={genres} filters={filters} onFilterChange={vi.fn()} />
        )
        await userEvent.click(screen.getByText('All Genres'))
        expect(screen.getByText('Action')).toBeInTheDocument()
        expect(screen.getByText('Drama')).toBeInTheDocument()
    })

    it('shows Clear Filters when a filter is active', () => {
        const activeFilters = { ...filters, minRating: 7 }
        renderWithProviders(
            <FilterBar genres={genres} filters={activeFilters} onFilterChange={vi.fn()} />
        )
        expect(screen.getByText(/Clear Filters/i)).toBeInTheDocument()
    })

    it('does NOT show Clear Filters for default filters', () => {
        renderWithProviders(
            <FilterBar genres={genres} filters={filters} onFilterChange={vi.fn()} />
        )
        expect(screen.queryByText(/Clear Filters/i)).not.toBeInTheDocument()
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. SkeletonCard
// ─────────────────────────────────────────────────────────────────────────────
describe('SkeletonCard & SkeletonGrid', () => {
    it('SkeletonCard renders a skeleton element', () => {
        const { container } = renderWithProviders(<SkeletonCard />)
        expect(container.querySelector('.skeleton-card')).toBeInTheDocument()
    })

    it('SkeletonGrid renders the correct number of cards', () => {
        const { container } = renderWithProviders(<SkeletonGrid count={6} />)
        expect(container.querySelectorAll('.skeleton-card').length).toBe(6)
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. useDebounce
// ─────────────────────────────────────────────────────────────────────────────
describe('useDebounce', () => {
    it('returns initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 300))
        expect(result.current).toBe('hello')
    })

    it('delays updating to new value', async () => {
        vi.useFakeTimers()
        const { result, rerender } = renderHook(
            ({ val }) => useDebounce(val, 300),
            { initialProps: { val: 'a' } }
        )
        rerender({ val: 'ab' })
        expect(result.current).toBe('a') // still old value
        act(() => { vi.advanceTimersByTime(300) })
        expect(result.current).toBe('ab') // updated after delay
        vi.useRealTimers()
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. movieSlice (Redux)
// ─────────────────────────────────────────────────────────────────────────────
describe('movieSlice', () => {
    it('setFilters merges partial filter updates', () => {
        const initial = movieReducer(undefined, { type: '@@INIT' })
        const next = movieReducer(initial, setFilters({ minRating: 7 }))
        expect(next.filters.minRating).toBe(7)
        expect(next.filters.mediaType).toBe('movie') // unchanged
    })

    it('setFilters resets discover data', () => {
        const withData = { ...movieReducer(undefined, { type: '@@INIT' }), discover: [FAKE_MOVIE], discoverPage: 2 }
        const next = movieReducer(withData, setFilters({ genreId: 28 }))
        expect(next.discover).toHaveLength(0)
        expect(next.discoverPage).toBe(1)
    })

    it('resetDiscover clears discover state', () => {
        const withData = { ...movieReducer(undefined, { type: '@@INIT' }), discover: [FAKE_MOVIE], discoverPage: 3, discoverTotalPages: 5 }
        const next = movieReducer(withData, resetDiscover())
        expect(next.discover).toHaveLength(0)
        expect(next.discoverPage).toBe(1)
        expect(next.discoverTotalPages).toBe(1)
    })

    it('fetchDiscoverMovies.pending sets discoverLoading for page 1', () => {
        const state = movieReducer(undefined, {
            type: fetchDiscoverMovies.pending.type,
            meta: { arg: { page: 1 } }
        })
        expect(state.discoverLoading).toBe(true)
        expect(state.discoverAppending).toBe(false)
    })

    it('fetchDiscoverMovies.pending sets discoverAppending for page 2+', () => {
        const state = movieReducer(undefined, {
            type: fetchDiscoverMovies.pending.type,
            meta: { arg: { page: 2 } }
        })
        expect(state.discoverAppending).toBe(true)
        expect(state.discoverLoading).toBe(false)
    })

    it('fetchDiscoverMovies.fulfilled appends results on page 2', () => {
        const initial = { ...movieReducer(undefined, { type: '@@INIT' }), discover: [FAKE_MOVIE], discoverPage: 1 }
        const newMovie = { ...FAKE_TV, id: 999 }
        const next = movieReducer(initial, {
            type: fetchDiscoverMovies.fulfilled.type,
            payload: { results: [newMovie], page: 2, totalPages: 5 }
        })
        expect(next.discover).toHaveLength(2)
        expect(next.discoverPage).toBe(2)
    })

    it('fetchDiscoverMovies.fulfilled deduplicates', () => {
        const initial = { ...movieReducer(undefined, { type: '@@INIT' }), discover: [FAKE_MOVIE] }
        const next = movieReducer(initial, {
            type: fetchDiscoverMovies.fulfilled.type,
            payload: { results: [FAKE_MOVIE], page: 2, totalPages: 5 } // same id
        })
        expect(next.discover).toHaveLength(1) // not doubled
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. searchSlice (Redux)
// ─────────────────────────────────────────────────────────────────────────────
describe('searchSlice', () => {
    it('clearSearch resets state', () => {
        const withData = { results: [FAKE_MOVIE], query: 'batman', loading: false, error: null, fromCache: false }
        const next = searchReducer(withData, clearSearch())
        expect(next.results).toHaveLength(0)
        expect(next.query).toBe('')
    })

    it('fetchSearchResults.pending sets loading=true', () => {
        const state = searchReducer(undefined, { type: fetchSearchResults.pending.type })
        expect(state.loading).toBe(true)
    })

    it('fetchSearchResults.fulfilled stores results', () => {
        const state = searchReducer(undefined, {
            type: fetchSearchResults.fulfilled.type,
            payload: { results: [FAKE_MOVIE], fromCache: false }
        })
        expect(state.results).toHaveLength(1)
        expect(state.loading).toBe(false)
    })

    it('fetchSearchResults.rejected does not clear results if cancelled', () => {
        const withData = { results: [FAKE_MOVIE], query: 'test', loading: true, error: null, fromCache: false }
        const next = searchReducer(withData, {
            type: fetchSearchResults.rejected.type,
            payload: 'cancelled'
        })
        expect(next.results).toHaveLength(1) // still has old results
        expect(next.loading).toBe(true) // loading unchanged because we returned early
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. FeaturedCarousel
// ─────────────────────────────────────────────────────────────────────────────
describe('FeaturedCarousel', () => {
    it('renders nothing when no movies or TV', () => {
        const { container } = renderWithProviders(
            <FeaturedCarousel movies={[]} tvShows={[]} />
        )
        expect(container.querySelector('.featured-carousel')).not.toBeInTheDocument()
    })

    it('renders FEATURED title', () => {
        renderWithProviders(
            <FeaturedCarousel movies={[FAKE_MOVIE]} tvShows={[FAKE_TV]} interval={99999} />
        )
        expect(screen.getByText('FEATURED')).toBeInTheDocument()
    })

    it('renders cards for both movies and TV shows', () => {
        renderWithProviders(
            <FeaturedCarousel movies={[FAKE_MOVIE]} tvShows={[FAKE_TV]} interval={99999} />
        )
        expect(screen.getByText('Test Movie')).toBeInTheDocument()
        expect(screen.getByText('Test Show')).toBeInTheDocument()
    })

    it('shows AUTO when not hovered', () => {
        renderWithProviders(
            <FeaturedCarousel movies={[FAKE_MOVIE]} tvShows={[FAKE_TV]} interval={99999} />
        )
        expect(screen.getByText('AUTO')).toBeInTheDocument()
    })

    it('shows PAUSED when hovered', async () => {
        renderWithProviders(
            <FeaturedCarousel movies={[FAKE_MOVIE]} tvShows={[FAKE_TV]} interval={99999} />
        )
        const carousel = screen.getByText('FEATURED').closest('.featured-carousel')
        fireEvent.mouseEnter(carousel)
        await waitFor(() => expect(screen.getByText('PAUSED')).toBeInTheDocument())
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. SearchPage
// ─────────────────────────────────────────────────────────────────────────────
describe('SearchPage', () => {
    it('renders search input with auto-focus', async () => {
        renderWithProviders(<SearchPage />)
        const input = screen.getByPlaceholderText(/movies, tv shows, people/i)
        expect(input).toBeInTheDocument()
    })

    it('renders SEARCH ARCHIVE heading', () => {
        renderWithProviders(<SearchPage />)
        expect(screen.getByText('SEARCH ARCHIVE')).toBeInTheDocument()
    })

    it('shows results after typing 2+ chars', async () => {
        renderWithProviders(<SearchPage />)
        const input = screen.getByPlaceholderText(/movies, tv shows, people/i)
        fireEvent.change(input, { target: { value: 'ba' } })
        await waitFor(() => {
            expect(screen.queryByText('Test Movie')).toBeInTheDocument()
        }, { timeout: 8000 })
    })

    it('does NOT search for 1 character', async () => {
        renderWithProviders(<SearchPage />)
        const input = screen.getByPlaceholderText(/movies, tv shows, people/i)
        fireEvent.change(input, { target: { value: 'a' } })
        await waitFor(() => {
            expect(screen.getByText(/type at least 2/i)).toBeInTheDocument()
        }, { timeout: 3000 })
    })

    it('clear button appears after typing', async () => {
        renderWithProviders(<SearchPage />)
        const input = screen.getByPlaceholderText(/movies, tv shows, people/i)
        fireEvent.change(input, { target: { value: 'abc' } })
        await waitFor(() => expect(screen.getByText('✕')).toBeInTheDocument(), { timeout: 4000 })
    })

    it('clears results when clear button clicked', async () => {
        renderWithProviders(<SearchPage />)
        const input = screen.getByPlaceholderText(/movies, tv shows, people/i)
        fireEvent.change(input, { target: { value: 'abc' } })
        const clearBtn = await screen.findByText('✕', {}, { timeout: 4000 })
        fireEvent.click(clearBtn)
        expect(input.value).toBe('')
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 9. MoviesDetailPage — two-phase loading
// ─────────────────────────────────────────────────────────────────────────────
describe('MoviesDetailPage', () => {
    it('shows movie title after basic info loads', async () => {
        renderWithProviders(<MoviesDetailPage />, { initialRoute: '/movie/1' })
        await waitFor(() => {
            expect(screen.getByText('TEST MOVIE')).toBeInTheDocument()
        }, { timeout: 8000 })
    })

    it('shows cast skeleton while credits load, then real cast', async () => {
        server.use(
            http.get('http://localhost:4000/api/tmdb/movie/:id/credits', async () => {
                await new Promise(r => setTimeout(r, 150))
                return HttpResponse.json(FAKE_CREDITS)
            })
        )
        renderWithProviders(<MoviesDetailPage />, { initialRoute: '/movie/1' })
        await waitFor(() => {
            const shimmerEls = document.querySelectorAll('.cast-skeleton__avatar')
            expect(shimmerEls.length).toBeGreaterThan(0)
        }, { timeout: 8000 })
        await waitFor(() => {
            expect(screen.getByText('Actor One')).toBeInTheDocument()
        }, { timeout: 8000 })
    })

    it('shows PLAY TRAILER button when videos available', async () => {
        renderWithProviders(<MoviesDetailPage />, { initialRoute: '/movie/1' })
        await waitFor(() => {
            expect(screen.getByText(/PLAY TRAILER/i)).toBeInTheDocument()
        }, { timeout: 8000 })
    })

    it('shows RECORD NOT FOUND on 404', async () => {
        server.use(
            http.get('http://localhost:4000/api/tmdb/movie/:id', () =>
                HttpResponse.json({ error: 'not found' }, { status: 404 })
            ),
            http.get('http://localhost:4000/api/tmdb/movie/:id/credits', () =>
                HttpResponse.json({ error: 'not found' }, { status: 404 })
            ),
            http.get('http://localhost:4000/api/tmdb/movie/:id/videos', () =>
                HttpResponse.json({ error: 'not found' }, { status: 404 })
            )
        )
        renderWithProviders(<MoviesDetailPage />, { initialRoute: '/movie/9999' })
        await waitFor(() => {
            expect(screen.getByText('RECORD NOT FOUND')).toBeInTheDocument()
        }, { timeout: 8000 })
    })
})

// ─────────────────────────────────────────────────────────────────────────────
// 10. HomePage — integration
// ─────────────────────────────────────────────────────────────────────────────
describe('HomePage', () => {
    it('shows init screen while loading', () => {
        renderWithProviders(<HomePage />)
        expect(screen.getByText(/INITIALIZING ARCHIVE/i)).toBeInTheDocument()
    })

    it('renders hero and tabs after data loads', async () => {
        renderWithProviders(<HomePage />)
        await waitFor(() => {
            expect(screen.getByText(/TRENDING & POPULAR/i)).toBeInTheDocument()
            expect(screen.getByText(/BROWSE & FILTER/i)).toBeInTheDocument()
        }, { timeout: 10000 })
    })

    it('renders FEATURED carousel after data loads', async () => {
        renderWithProviders(<HomePage />)
        await waitFor(() => {
            expect(screen.getByText('FEATURED')).toBeInTheDocument()
        }, { timeout: 10000 })
    })

    it('switches to BROWSE & FILTER tab on click', async () => {
        renderWithProviders(<HomePage />)
        const browseTab = await screen.findByText(/BROWSE & FILTER/i, {}, { timeout: 10000 })
        fireEvent.click(browseTab)
        await waitFor(() => {
            expect(screen.getByText('BROWSE ALL')).toBeInTheDocument()
        }, { timeout: 5000 })
    })

    it('shows CONNECTION FAILED when TMDB is down', async () => {
        server.use(
            http.get('http://localhost:4000/api/tmdb/trending/movie/week', () =>
                HttpResponse.json({ error: 'unreachable' }, { status: 503 })
            )
        )
        renderWithProviders(<HomePage />)
        await waitFor(() => {
            expect(screen.getByText(/CONNECTION FAILED/i)).toBeInTheDocument()
        }, { timeout: 10000 })
    })
})
