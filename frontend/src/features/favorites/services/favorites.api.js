import axiosClient from "../../../shared/api/axiosClient"

export const getFavorites = () => axiosClient.get("/users/favorites")
export const addFavorite = (data) => axiosClient.post("/users/favorites", data)
export const removeFavorite = (tmdbId) => axiosClient.delete(`/users/favorites/${tmdbId}`)