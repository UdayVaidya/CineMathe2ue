import tmdbClient from "../../../shared/api/tmdbClient"

export const getPosterUrl = (path, size = 'w500') => {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export const getTrendingMovies = async () => {
  const res = await tmdbClient.get("/trending/movie/week")
  return res.data.results
}

export const getPopularMovies = async () => {
  const res = await tmdbClient.get("/movie/popular", {
    params: { language: "en-US", page: 1 }
  })
  return res.data.results
}

export const getPopularTVShows = async () => {
  const res = await tmdbClient.get("/tv/popular", {
    params: { language: "en-US", page: 1 }
  })
  return res.data.results
}

// TMDB genre list
export const getMovieGenres = async () => {
  const res = await tmdbClient.get("/genre/movie/list", {
    params: { language: "en-US" }
  })
  return res.data.genres
}

export const getTVGenres = async () => {
  const res = await tmdbClient.get("/genre/tv/list", {
    params: { language: "en-US" }
  })
  return res.data.genres
}

// Paginated discover — supports genre, rating, sort_by, page, mediaType
export const discoverMedia = async ({ mediaType = 'movie', page = 1, genreId = null, minRating = 0, sortBy = 'popularity.desc' } = {}) => {
  const endpoint = mediaType === 'tv' ? '/discover/tv' : '/discover/movie'
  const params = {
    language: 'en-US',
    page,
    sort_by: sortBy,
    'vote_average.gte': minRating,
    'vote_count.gte': 50,
  }
  if (genreId) params.with_genres = genreId
  const res = await tmdbClient.get(endpoint, { params })
  return { results: res.data.results, totalPages: res.data.total_pages, page: res.data.page }
}

export const getMovieDetails = async (id) => {
  const [details, credits, videos] = await Promise.all([
    tmdbClient.get(`/movie/${id}`),
    tmdbClient.get(`/movie/${id}/credits`),
    tmdbClient.get(`/movie/${id}/videos`),
  ])
  return {
    ...details.data,
    credits: credits.data,
    videos: videos.data,
  }
}

export const getMovieBasic = async (id) => {
  const res = await tmdbClient.get(`/movie/${id}`)
  return res.data
}

export const getMovieCredits = async (id) => {
  const res = await tmdbClient.get(`/movie/${id}/credits`)
  return res.data
}

export const getMovieVideos = async (id) => {
  const res = await tmdbClient.get(`/movie/${id}/videos`)
  return res.data
}

export const getTVShowDetails = async (id) => {
  const [details, credits, videos] = await Promise.all([
    tmdbClient.get(`/tv/${id}`),
    tmdbClient.get(`/tv/${id}/credits`),
    tmdbClient.get(`/tv/${id}/videos`),
  ])
  return {
    ...details.data,
    credits: credits.data,
    videos: videos.data,
  }
}

export const getTVBasic = async (id) => {
  const res = await tmdbClient.get(`/tv/${id}`)
  return res.data
}

export const getTVCredits = async (id) => {
  const res = await tmdbClient.get(`/tv/${id}/credits`)
  return res.data
}

export const getTVVideos = async (id) => {
  const res = await tmdbClient.get(`/tv/${id}/videos`)
  return res.data
}