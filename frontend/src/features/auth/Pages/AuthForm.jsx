import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);

    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const imageRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Brutalist harsh reveal
        tl.fromTo(leftRef.current,
            { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)", duration: 1.5, ease: "expo.inOut" }
        )
            .fromTo(imageRef.current,
                { scale: 1.2, filter: "brightness(0) blur(10px)" },
                { scale: 1, filter: "brightness(0.7) blur(0px)", duration: 2, ease: "power3.out" },
                "-=1"
            )
            .fromTo(rightRef.current,
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=1.2"
            )
            .fromTo(titleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                "-=0.8"
            );
    }, []);

    return (
        <div className="min-h-screen flex bg-[#0a0a0a] text-[#f4f3ed] overflow-hidden font-sans select-none page-content pb-0">

            {/* LEFT PANEL: THE VISUAL ARCHIVE */}
            <div
                ref={leftRef}
                className="hidden lg:flex w-[55%] relative items-center justify-center bg-[#141414] border-r border-[#1a1a1a] overflow-hidden group"
            >
                <div
                    ref={imageRef}
                    className="absolute inset-0 bg-cover bg-center grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-[2s] ease-out"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop')` }}
                ></div>

                {/* Overlay Grid lines for editorial feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

                <div className="absolute top-12 left-12 flex flex-col gap-2">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#e63946] border border-[#e63946] w-fit px-3 py-1 font-bold">
                        RESTRICTED ACCESS
                    </span>
                    <span className="font-mono text-xs tracking-widest text-[#999] bg-[#0a0a0a] px-2 py-1 w-fit">
                        DEPT. OF DIGITAL PRESERVATION
                    </span>
                </div>

                <div className="relative z-10 w-full px-12 mt-auto pb-20">
                    <h1 className="font-serif italic text-6xl xl:text-8xl tracking-tighter text-[#eaeaea] leading-[0.9] drop-shadow-2xl">
                        CINEMATHEQUE <br /> <span className="not-italic text-[#e63946] font-bold tracking-tight">ARCHIVAL</span>
                    </h1>
                    <div className="h-px w-full bg-[#333] mt-8 mb-6"></div>
                    <div className="flex justify-between items-end font-mono text-[10px] tracking-[0.2em] text-[#999]">
                        <p>VOL. 84 - SECURE TERMINAL</p>
                        <p className="text-[#f4f3ed]">EST. 1997</p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: THE TERMINAL ENTRY */}
            <div
                ref={rightRef}
                className="flex w-full lg:w-[45%] items-center justify-center p-8 md:p-16 lg:p-24 relative bg-[#0a0a0a]"
            >
                {/* Crosshairs decorative */}
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-[#666]"></div>
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-[#666]"></div>
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-[#666] lg:hidden"></div>
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-[#666] lg:hidden"></div>

                <div className="w-full max-w-sm">

                    <div className="mb-12" ref={titleRef}>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
                            {isLogin ? "AUTHORIZE." : "ENROL."}
                        </h2>
                        <p className="font-mono text-xs tracking-[0.1em] text-[#666]">
                            {isLogin ? "ENTER YOUR ASSIGNED CREDENTIALS" : "REQUEST ARCHIVE ACCESS REGISTRATION"}
                        </p>
                    </div>

                    <div className="min-h-[280px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "register"}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: "easeOut" }} 
                            >
                                {isLogin ? <LoginForm /> : <RegisterForm />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 pt-8 border-t border-[#1a1a1a] flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-[#666] uppercase">
                            {isLogin ? "NO ACCESS PASS?" : "HAVE A PASSKEY?"}
                        </p>

                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="font-mono text-xs tracking-[0.2em] text-[#f4f3ed] hover:text-[#e63946] border-b border-transparent hover:border-[#e63946] pb-1 transition-all uppercase"
                        >
                            {isLogin ? "Request One" : "Return to Auth"}
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default AuthForm;