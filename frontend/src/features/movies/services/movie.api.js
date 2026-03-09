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

export const getMovieDetails = async (id) => {
  const res = await tmdbClient.get(`/movie/${id}`, {
    params: { append_to_response: "videos,credits" }
  })
  console.log("✅ Movie Details:", res.data)
  return res.data
}


export const getTVShowDetails = async (id) => {
  const res = await tmdbClient.get(`/tv/${id}`, {
    params: { append_to_response: "videos,credits" }
  })
  return res.data
}