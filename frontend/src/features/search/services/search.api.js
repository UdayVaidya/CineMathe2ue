import tmdbClient from "../../../shared/api/tmdbClient"

export const searchMulti = async (query, page = 1) => {
  const res = await tmdbClient.get("/search/multi", {
    params: { query, page, include_adult: false }
  })
  return res.data
}