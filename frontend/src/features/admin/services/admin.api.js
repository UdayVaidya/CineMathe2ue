import axiosClient from "../../../shared/api/axiosClient"

// Movies
export const adminGetMovies = () => axiosClient.get("/admin/movies")
export const adminCreateMovie = (data) => axiosClient.post("/admin/movies", data)
export const adminUpdateMovie = (id, data) => axiosClient.put(`/admin/movies/${id}`, data)
export const adminDeleteMovie = (id) => axiosClient.delete(`/admin/movies/${id}`)

// Users
export const adminGetUsers = () => axiosClient.get("/admin/users")
export const adminToggleBan = (id) => axiosClient.put(`/admin/users/${id}/ban`)
export const adminDeleteUser = (id) => axiosClient.delete(`/admin/users/${id}`)