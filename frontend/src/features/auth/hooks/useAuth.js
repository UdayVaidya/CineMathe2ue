import { useDispatch, useSelector } from "react-redux"
import { loginUser, registerUser } from "../store/authSlice.js"

export default function useAuth() {

    const dispatch = useDispatch()

    const { user, loading, error } = useSelector(
        (state) => state.auth
    )

    const login = (credentials) => {
        dispatch(loginUser(credentials))
    }

    const register = (credentials) => {
        dispatch(registerUser(credentials))
    }

    return {
        user,
        loading,
        error,
        login,
        register
    }
}