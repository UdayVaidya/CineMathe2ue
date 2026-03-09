import React from "react";
import { motion } from "motion/react";
import useAuth from "../hooks/useAuth";

const RegisterForm = () => {

    const { register, loading, error } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        register({
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value
        });
    };

    return (
        <motion.form
            className="flex flex-col gap-6 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Operative Alias
                </label>
                <input
                    type="text"
                    required
                    name="username"
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="Apna username batao"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Email Address
                </label>
                <input
                    type="email"
                    required
                    name="email"
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="Sahi email daalna"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] sm:text-xs tracking-[0.2em] text-[#e63946] uppercase font-bold">
                    Security Passkey
                </label>
                <input
                    type="password"
                    required
                    name="password"
                    className="w-full bg-transparent border-b border-[#333] text-[#f4f3ed] py-3 focus:outline-none focus:border-[#e63946] focus:bg-[#141414] transition-all font-sans text-sm rounded-none"
                    placeholder="••••••••"
                />
            </div>


            <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-4 bg-[#e63946] hover:bg-[#b82d38] text-white font-mono text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 rounded-none hover:shadow-[0_0_12px_rgba(230,57,70,0.7)] disabled:opacity-50"
            >
                {loading ? "Account ban raha hai..." : "Access Authorization"}
            </button>

            {error && (
                <div className="text-[#e63946] font-mono text-xs mt-2 text-center">
                    ERROR: {error}
                </div>
            )}
        </motion.form>
    );
};

export default RegisterForm;