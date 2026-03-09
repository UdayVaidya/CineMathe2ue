// MSW handlers — intercept all backend API calls and return fake data
import { http, HttpResponse } from 'msw'

const BASE = 'http://localhost:4000/api/tmdb'

// ── Shared fake data
export const FAKE_MOVIE = {
    id: 1, title: 'Test Movie', overview: 'A test overview.',
    poster_path: '/poster.jpg', backdrop_path: '/backdrop.jpg',
    vote_average: 8.2, release_date: '2024-01-15',
    media_type: 'movie', genre_ids: [28],
}

export const FAKE_TV = {
    id: 2, name: 'Test Show', overview: 'A test TV overview.',
    poster_path: '/tvposter.jpg', backdrop_path: '/tvbackdrop.jpg',
    vote_average: 7.5, first_air_date: '2024-03-01',
    media_type: 'tv', genre_ids: [18],
}

export const FAKE_CREDITS = {
    cast: [
        { id: 101, name: 'Actor One', character: 'Hero', profile_path: '/actor1.jpg', order: 0 },
        { id: 102, name: 'Actor Two', character: 'Villain', profile_path: '/actor2.jpg', order: 1 },
    ],
    crew: [],
}

export const FAKE_VIDEOS = {
    results: [
        { id: 'v1', key: 'abc123', type: 'Trailer', site: 'YouTube', name: 'Official Trailer' },
    ],
}

export const FAKE_GENRES = {
    genres: [
        { id: 28, name: 'Action' },
        { id: 18, name: 'Drama' },
        { id: 35, name: 'Comedy' },
    ],
}

const makePagedResponse = (results, page = 1, totalPages = 3) => ({
    results, page, total_pages: totalPages, total_results: results.length * totalPages,
})

// ── Handlers
export const handlers = [
    // Trending
    http.get(`${BASE}/trending/movie/week`, () =>
        HttpResponse.json(makePagedResponse([FAKE_MOVIE]))
    ),
    // Popular movies
    http.get(`${BASE}/movie/popular`, () =>
        HttpResponse.json(makePagedResponse([FAKE_MOVIE]))
    ),
    // Popular TV
    http.get(`${BASE}/tv/popular`, () =>
        HttpResponse.json(makePagedResponse([FAKE_TV]))
    ),
    // Genres
    http.get(`${BASE}/genre/movie/list`, () => HttpResponse.json(FAKE_GENRES)),
    http.get(`${BASE}/genre/tv/list`, () => HttpResponse.json(FAKE_GENRES)),
    // Movie details, credits, videos
    http.get(`${BASE}/movie/:id`, () => HttpResponse.json({ ...FAKE_MOVIE, genres: [{ id: 28, name: 'Action' }], runtime: 120 })),
    http.get(`${BASE}/movie/:id/credits`, () => HttpResponse.json(FAKE_CREDITS)),
    http.get(`${BASE}/movie/:id/videos`, () => HttpResponse.json(FAKE_VIDEOS)),
    // TV details, credits, videos
    http.get(`${BASE}/tv/:id`, () => HttpResponse.json({ ...FAKE_TV, genres: [{ id: 18, name: 'Drama' }], number_of_seasons: 3 })),
    http.get(`${BASE}/tv/:id/credits`, () => HttpResponse.json(FAKE_CREDITS)),
    http.get(`${BASE}/tv/:id/videos`, () => HttpResponse.json(FAKE_VIDEOS)),
    // Discover
    http.get(`${BASE}/discover/movie`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        return HttpResponse.json(makePagedResponse([FAKE_MOVIE], page, 5))
    }),
    http.get(`${BASE}/discover/tv`, ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        return HttpResponse.json(makePagedResponse([FAKE_TV], page, 5))
    }),
    // Search
    http.get(`${BASE}/search/multi`, ({ request }) => {
        const q = new URL(request.url).searchParams.get('query') || ''
        const results = q.length >= 2
            ? [{ ...FAKE_MOVIE, media_type: 'movie' }, { ...FAKE_TV, media_type: 'tv' }]
            : []
        return HttpResponse.json(makePagedResponse(results))
    }),
    // TMDB ping
    http.get(`${BASE}/__ping`, () => HttpResponse.json({ reachable: true })),
    // Auth
    http.post('http://localhost:4000/api/auth/login', () =>
        HttpResponse.json({ token: 'fake-jwt', user: { _id: 'u1', email: 'test@test.com', role: 'user' } })
    ),
    http.post('http://localhost:4000/api/auth/register', () =>
        HttpResponse.json({ token: 'fake-jwt', user: { _id: 'u1', email: 'test@test.com', role: 'user' } })
    ),
    // Favorites
    http.get('http://localhost:4000/api/user/favorites', () => HttpResponse.json({ favorites: [] })),
]
