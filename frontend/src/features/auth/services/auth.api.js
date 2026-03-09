import api from "../../../shared/api/axiosClient"

export const handleLogin = async (data) => {
    const res = await api.post("/auth/login", data)
    return res.data
}

export const handleRegister = async (data) => {
    const res = await api.post("/auth/register", data)
    return res.data
}