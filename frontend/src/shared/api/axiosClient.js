import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

// Attach token to every request
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("cs_token")
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Auto-logout on expired / invalid token — but NOT on failed login/register attempts
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || ""
            const isAuthEndpoint = requestUrl.includes("/auth/login") || requestUrl.includes("/auth/register")
            const hasStoredToken = !!localStorage.getItem("cs_token")

            // Only auto-logout if this was a protected route with a real (now expired) token
            // Not if the user simply typed the wrong password on the login form
            if (!isAuthEndpoint && hasStoredToken) {
                localStorage.removeItem("cs_token")
                localStorage.removeItem("cs_user")
                window.location.href = "/"
            }
        }
        return Promise.reject(error)
    }
)

export default axiosClient
