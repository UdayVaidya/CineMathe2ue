import React from "react";
import { motion } from "motion/react";
import useAuth from "../hooks/useAuth"

const LoginForm = () => {

    const { login, loading, error } = useAuth()

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
                    placeholder="Enter assigned email"
                    name="email"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Security Passkey
                </label>
                <input
                    type="password"
                    required
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="••••••••"
                    name="password"
                />
            </div>

            <div className="flex flex-col gap-2 relative">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Clearance Level
                </label>
                <select
                    required
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none appearance-none cursor-pointer"
                    defaultValue="user"
                    name="role"
                >
                    <option value="user" className="bg-[#0a0a0a] text-[#f4f3ed]">Standard Operator</option>
                    <option value="admin" className="bg-[#0a0a0a] text-[#e63946]">System Administrator</option>
                </select>
                <div className="absolute right-0 bottom-4 pointer-events-none text-[#666] pr-2 font-xs">
                    ▼
                </div>
            </div>

            <button
                type="submit"
                className="mt-6 w-full py-4 bg-[#e63946] hover:bg-[#b82d38] text-white font-mono text-xs tracking-[0.2em] font-bold uppercase transition-colors rounded-none"
            >
                Authorize Access
            </button>
        </motion.form>
    );
};

export default LoginForm;