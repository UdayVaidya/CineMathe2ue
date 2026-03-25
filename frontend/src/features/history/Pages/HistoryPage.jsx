import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchHistory, clearAllHistory } from "../store/historySlice"
import HistoryCard from "../components/HistoryCard"

export default function HistoryPage() {
    const dispatch  = useDispatch()
    const navigate  = useNavigate()
    const { history, loading, error, clearLoading } = useSelector((state) => state.history)

    useEffect(() => {
        // Fetch on mount
        dispatch(fetchHistory())
    }, [dispatch])

    const handleClearHistory = () => {
        if (window.confirm("Are you sure you want to clear your entire watch history?")) {
            dispatch(clearAllHistory())
        }
    }

    // ── Loading ──────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] gap-4">
                <div className="w-8 h-8 border-2 border-[#e63946] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm tracking-widest text-[#666] uppercase">Loading History...</span>
            </div>
        )
    }

    // ── Error ────────────────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed] p-8 gap-4">
                <h2 className="text-2xl text-[#e63946] uppercase font-bold tracking-widest">Error</h2>
                <p className="text-[#999] text-sm text-center max-w-md">{error}</p>
                <button
                    onClick={() => dispatch(fetchHistory())}
                    className="border border-[#666] px-6 py-2 text-xs tracking-widest hover:border-[#f4f3ed] transition-colors uppercase"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans px-8 md:px-16 lg:px-24 py-12">

            {/* Back */}
            <div className="flex justify-between items-center mb-10 w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="font-mono text-sm tracking-widest text-[#999] hover:text-red-500 transition-colors"
                >
                    ← BACK
                </button>

                {history.length > 0 && (
                     <button
                        onClick={handleClearHistory}
                        disabled={clearLoading}
                        className="border border-[#e63946] text-[#e63946] px-4 py-1 text-[10px] sm:text-xs font-mono tracking-widest hover:bg-[#e63946] hover:text-[#0a0a0a] transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                     >
                        {clearLoading ? "Clearing..." : "Clear History"}
                     </button>
                )}
            </div>

            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-[#333] pb-4">
                <div>
                    <h1 className="text-4xl font-serif font-bold uppercase tracking-tight">
                        WATCH HISTORY
                    </h1>
                    <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">
                        Recently viewed media
                    </p>
                </div>
                <span className="font-mono text-[10px] tracking-widest text-[#e63946]">
                    [{history.length} ITEMS]
                </span>
            </div>

            {/* Empty state */}
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 text-[#222]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <div className="text-center">
                        <p className="font-mono text-xs tracking-widest text-[#555] uppercase">No watch history</p>
                        <p className="text-[#444] text-sm mt-2">
                            Movies and TV shows you view will appear here.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        className="border border-[#333] px-6 py-2 text-xs font-mono tracking-widest hover:border-[#f4f3ed] transition-colors uppercase"
                    >
                        Browse Movies
                    </button>
                </div>
            ) : (
                /* Grid */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {history.map((item) => (
                        <HistoryCard key={item.tmdbId} historyItem={item} />
                    ))}
                </div>
            )}
        </div>
    )
}
