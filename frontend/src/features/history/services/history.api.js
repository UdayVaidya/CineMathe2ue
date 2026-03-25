import axiosClient from "../../../shared/api/axiosClient"

export const getHistory = () => axiosClient.get("/users/history")
export const addToHistory = (data) => axiosClient.post("/users/history", data)
export const clearHistory = () => axiosClient.delete("/users/history")
