import tmdbClient from "../../../shared/api/tmdbClient"

// Pass AbortSignal so inflight requests get cancelled when a newer one fires
export const searchMulti = async (query, page = 1, signal) => {
  const res = await tmdbClient.get("/search/multi", {
    params: { query, page, include_adult: false, language: "en-US" },
    signal,
  })
  return res.data
}