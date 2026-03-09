import useTrendingMovies from "../hooks/useTrendingMovies"
import usePopularMovies from "../hooks/usePopularMovies"
import MovieGrid from "../components/MovieGrid"
import HeroArchive from "../components/HeroArchive"
import { useDispatch } from "react-redux"
import { logout } from "../../auth/store/authSlice"
import { useNavigate } from "react-router-dom"
import useTVShows from "../hooks/useTVShows"
import { useState, useEffect } from "react"

export default function HomePage() {
    const { trending, loading: trendingLoading, error: trendingError } = useTrendingMovies()
    const { popular, loading: popularLoading } = usePopularMovies()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { tvShows } = useTVShows()
    const [timedOut, setTimedOut] = useState(false)

    const loading = trendingLoading || popularLoading

    // Agar 10 seconds mein TMDB se response na aaye toh timeout
    useEffect(() => {
        if (!loading) return
        const timer = setTimeout(() => setTimedOut(true), 10000)
        return () => clearTimeout(timer)
    }, [loading])

    if (loading && timedOut) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col gap-4 items-center justify-center font-mono text-[#f4f3ed] p-8">
                <h2 className="text-2xl text-[#e63946] uppercase font-bold tracking-widest">CONNECTION FAILED</h2>
                <p className="text-[#999] text-sm text-center max-w-md">
                    TMDB server tak nahi pahunch paye. Aapka ISP (Jio etc.) is domain ko block kar sakta hai.
                </p>
                <div className="bg-[#111] border border-[#333] p-4 text-xs font-mono text-[#ccc] max-w-md w-full space-y-2">
                    <p className="text-[#e63946] font-bold mb-2">FIX:</p>
                    <p>1. VPN chalao (Cloudflare WARP ya ProtonVPN)</p>
                    <p>2. Ya Airtel/BSNL hotspot use karo</p>
                    <p>3. DNS change karo: 1.1.1.1 ya 8.8.8.8</p>
                </div>
                <button
                    onClick={() => { setTimedOut(false); window.location.reload() }}
                    className="border border-[#666] px-6 py-2 text-xs tracking-widest hover:border-[#f4f3ed] transition-colors uppercase"
                >
                    Retry
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    className="text-[#e63946] text-xs tracking-widest underline underline-offset-4"
                >
                    Log Out
                </button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] gap-4">
                <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm tracking-widest text-[#666] uppercase">Initializing Archive...</span>
            </div>
        )
    }

    if (trendingError) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] p-8">
                <h2 className="text-3xl text-[#e63946] mb-4 uppercase font-bold">Protocol Error</h2>
                <p className="text-red-400 max-w-lg text-center bg-[#141414] p-4 border border-red-900 border-dashed">{JSON.stringify(trendingError)}</p>
                <button
                    onClick={() => dispatch(logout())}
                    className="mt-8 border border-[#333] px-4 py-2 text-xs tracking-widest hover:border-[#f4f3ed] transition-colors"
                >
                    Abort & Log Out
                </button>
            </div>
        )
    }

    if (!trending || trending.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-[#e63946]">
                NO ARCHIVES FOUND
            </div>
        )
    }

    const featuredMovie = trending[0]
    const otherMovies = trending.slice(1)

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans overflow-x-hidden relative">

            {/* Global Actions */}
            <div className="absolute z-50 top-8 right-8 flex gap-4">
                <button
                    onClick={() => navigate('/search')}
                    className="border border-red-500 text-red-500  px-4 py-2 hover:bg-[#f4f3ed] hover:text-[#0a0a0a] transition-all text-md  font-extrabold tracking-widest uppercase"
                >
                    SEARCH
                </button>
                <button
                    onClick={() => navigate('/tmdb')}
                    className="border border-[#3b82f6] text-[#3b82f6] px-4 py-2 hover:bg-[#3b82f6] hover:text-[#0a0a0a] transition-all text-xs font-mono tracking-widest uppercase"
                >
                    TMDB APIs
                </button>
                <button
                    onClick={() => dispatch(logout())}
                    className="border border-[#e63946] text-[#e63946] px-4 py-2 hover:bg-[#e63946] hover:text-[#0a0a0a] transition-all text-xs font-mono tracking-widest uppercase"
                >
                    Log Out
                </button>
            </div>

            {/* Hero Section */}
            <HeroArchive movie={featuredMovie} />

            {/* Trending Section */}
            <div className="px-8 md:px-16 lg:px-24 py-16">
                <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-4">
                    <div>
                        <h2 className="text-3xl font-serif tracking-tight text-[#eaeaea]">TRENDING NOW</h2>
                        <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">Global Data Feed</p>
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#e63946]">[{otherMovies.length} RECORDS]</span>
                </div>
                <MovieGrid movies={otherMovies} />
            </div>

            {/* Popular Section */}
            <div className="px-8 md:px-16 lg:px-24 py-16 border-t border-[#1a1a1a]">
                <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-4">
                    <div>
                        <h2 className="text-3xl font-serif tracking-tight text-[#eaeaea]">POPULAR MOVIES</h2>
                        <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">Most Watched</p>
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#e63946]">[{popular.length} RECORDS]</span>
                </div>
                <MovieGrid movies={popular} />
            </div>

            {/* TV Shows Section */}
            <div className="px-8 md:px-16 lg:px-24 py-16 border-t border-[#1a1a1a]">
                <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-4">
                    <div>
                        <h2 className="text-3xl font-serif tracking-tight text-[#eaeaea]">POPULAR TV SHOWS</h2>
                        <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">Top Series</p>
                    </div>
                    <span className="font-mono text-[10px] tracking-widest text-[#e63946]">[{tvShows.length} RECORDS]</span>
                </div>
                <MovieGrid movies={tvShows} />
            </div>

        </div>
    )
}