import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";
import useAuth from "../hooks/useAuth"
import { clearError } from "../store/authSlice"

const LoginForm = () => {
    const dispatch = useDispatch()
    const { login, loading, error } = useAuth()
    const clearErr = () => { if (error) dispatch(clearError()) }

    const handleSubmit = (e) => {
        e.preventDefault()
        login({
            email: e.target.email.value,
            password: e.target.password.value,
            role: e.target.role.value
        })
    }

    return (
        <motion.form
            className="flex flex-col gap-8 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Email Address
                </label>
                <input
                    type="email"
                    required
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="Enter your email"
                    name="email"
                    onChange={clearErr}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Password
                </label>
                <input
                    type="password"
                    required
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="Enter your password"
                    name="password"
                    onChange={clearErr}
                />
            </div>

            <div className="flex flex-col gap-2 relative">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Role
                </label>
                <select
                    required
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none appearance-none cursor-pointer"
                    defaultValue="user"
                    name="role"
                >
                    <option value="user" className="bg-[#0a0a0a] text-[#f4f3ed]">System User</option>
                    <option value="admin" className="bg-[#0a0a0a] text-[#e63946]">System Administrator</option>
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none text-[#666] pr-2 font-xs">▼</div>
            </div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-start gap-3 bg-[#1a0a0b] border border-[#e63946]/40 px-4 py-3"
                    >
                        <span className="text-[#e63946] text-base leading-none mt-0.5">⚠</span>
                        <p className="font-mono text-[11px] text-[#e63946] tracking-wide leading-snug">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-4 bg-[#e63946] hover:bg-[#b82d38] text-white font-mono text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 rounded-none hover:shadow-[0_0_18px_rgba(230,57,70,0.75)] disabled:opacity-60 flex items-center justify-center gap-3"
            >
                {loading ? (
                    <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authorizing...
                    </>
                ) : (
                    "Authorize"
                )}
            </button>
        </motion.form>
    );
};

export default LoginForm;