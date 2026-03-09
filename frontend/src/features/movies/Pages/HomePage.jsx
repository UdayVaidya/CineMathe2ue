import useTrendingMovies from "../hooks/useTrendingMovies"
import usePopularMovies from "../hooks/usePopularMovies"
import useTVShows from "../hooks/useTVShows"
import useInfiniteDiscover from "../hooks/useInfiniteDiscover"
import MovieGrid from "../components/MovieGrid"
import FeaturedCarousel from "../components/FeaturedCarousel"
import HeroArchive from "../components/HeroArchive"
import FilterBar from "../components/FilterBar"
import { SkeletonGrid } from "../components/SkeletonCard"
import { useDispatch } from "react-redux"
import { fetchGenres } from "../store/movieSlice"
import { logout } from "../../auth/store/authSlice"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useCallback } from "react"
import tmdbClient from "../../../shared/api/tmdbClient"

// ── Detect why TMDB failed
async function diagnoseTMDB() {
    try {
        const res = await tmdbClient.get("/__ping", { timeout: 5000 })
        if (res.data?.reachable === false) return "isp_block"
        return "ok"
    } catch (e) {
        const code = e.response?.data?.code
        if (code === "NO_KEY") return "no_key"
        if (code === "NETWORK_ERROR") return "isp_block"
        return "server_down"
    }
}

function SectionHeader({ title, subtitle, count }) {
    return (
        <div className="section-header">
            <div>
                <h2 className="section-header__title">{title}</h2>
                <p className="section-header__sub">{subtitle}</p>
            </div>
            <span className="section-header__count">[{count} RECORDS]</span>
        </div>
    )
}

function ScrollSentinel({ sentinelRef, appending, hasMore }) {
    return (
        <div ref={sentinelRef} className="scroll-sentinel">
            {appending && (
                <div className="scroll-sentinel__loader">
                    <div className="scroll-sentinel__spinner" />
                    <span>Loading more...</span>
                </div>
            )}
            {!hasMore && !appending && (
                <div className="scroll-sentinel__end">
                    <span>— END OF RESULTS —</span>
                </div>
            )}
        </div>
    )
}

function TMDBErrorBanner({ diagnosis, onRetry }) {
    const msgs = {
        isp_block: { icon: "⚡", text: "TMDB is blocked on your network. Use a VPN or change DNS to 1.1.1.1", fixes: ["VPN: Cloudflare WARP / ProtonVPN", "DNS: Set 1.1.1.1 or 8.8.8.8", "Hotspot: Try Airtel/BSNL"] },
        no_key: { icon: "🔑", text: "TMDB API key missing in backend .env", fixes: ["Add VITE_TMDB_API_KEY_READ_ACCESS to backend/.env", "Restart backend server"] },
        server_down: { icon: "🔌", text: "Backend server is not responding", fixes: ["Run: npm run dev (in /backend)", "Check port 4000 is free"] },
        unknown: { icon: "⚠", text: "Unable to connect to TMDB", fixes: [] },
    }
    const m = msgs[diagnosis] || msgs.unknown
    return (
        <div className="tmdb-error-banner">
            <div className="tmdb-error-banner__icon">{m.icon}</div>
            <div className="tmdb-error-banner__body">
                <p className="tmdb-error-banner__text">{m.text}</p>
                {m.fixes.length > 0 && (
                    <ul className="tmdb-error-banner__fixes">
                        {m.fixes.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                )}
            </div>
            <button className="tmdb-error-banner__retry" onClick={onRetry}>Retry ↺</button>
        </div>
    )
}

export default function HomePage() {
    const { trending, loading: trendingLoading, error: trendingError } = useTrendingMovies()
    const { popular, loading: popularLoading } = usePopularMovies()
    const { tvShows } = useTVShows()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState("trending")
    const [diagnosis, setDiagnosis] = useState(null)
    const [diagnosing, setDiagnosing] = useState(false)

    const {
        movies: browseMovies,
        loading: browseLoading,
        appending,
        hasMore,
        filters,
        genres,
        updateFilters,
        sentinelRef,
    } = useInfiniteDiscover()

    const isLoading = trendingLoading || popularLoading

    useEffect(() => { dispatch(fetchGenres()) }, [dispatch])

    useEffect(() => {
        if (!trendingError || diagnosing || diagnosis) return
        setDiagnosing(true)
        diagnoseTMDB().then(result => { setDiagnosis(result); setDiagnosing(false) })
    }, [trendingError])

    const handleRetry = useCallback(() => {
        setDiagnosis(null)
        window.location.reload()
    }, [])

    if (isLoading) {
        return (
            <div className="init-screen">
                <div className="init-screen__blob" />
                <div className="init-screen__spinner" />
                <span className="init-screen__text">INITIALIZING ARCHIVE...</span>
                <div className="init-screen__bar"><div className="init-screen__bar-fill" /></div>
            </div>
        )
    }

    if (trendingError || !trending?.length) {
        return (
            <div className="homepage">
                <div className="error-full">
                    <div className="error-full__icon">⊘</div>
                    <h2 className="error-full__title">CONNECTION FAILED</h2>
                    <p className="error-full__sub">
                        {diagnosing ? "Diagnosing network issue..." : "Could not reach TMDB."}
                    </p>
                    {diagnosis && <TMDBErrorBanner diagnosis={diagnosis} onRetry={handleRetry} />}
                    <div className="error-full__actions">
                        <button className="error-screen__retry" onClick={handleRetry}>Retry Connection ↺</button>
                        <button className="error-screen__logout" onClick={() => dispatch(logout())}>Log Out</button>
                    </div>
                </div>
            </div>
        )
    }

    const featuredMovie = trending[0]
    const otherMovies = trending.slice(1)

    return (
        <div className="homepage">
            {/* Hero */}
            <HeroArchive movie={featuredMovie} />

            {/* ── FEATURED CAROUSEL — mixed movies + TV, auto-scrolling */}
            <FeaturedCarousel movies={otherMovies} tvShows={tvShows} interval={3500} />

            {/* Section Tabs */}
            <div className="section-tabs">
                <button
                    className={`section-tab ${activeSection === "trending" ? "section-tab--active" : ""}`}
                    onClick={() => setActiveSection("trending")}
                >
                    TRENDING &amp; POPULAR
                </button>
                <button
                    className={`section-tab ${activeSection === "browse" ? "section-tab--active" : ""}`}
                    onClick={() => setActiveSection("browse")}
                >
                    BROWSE &amp; FILTER
                    <span className="section-tab__badge">NEW</span>
                </button>
            </div>

            {/* ── TRENDING — grid layout */}
            {activeSection === "trending" && (
                <div className="homepage__sections animate-fade-in">
                    <div className="content-section">
                        <SectionHeader title="TRENDING NOW" subtitle="Global Data Feed" count={otherMovies.length} />
                        <MovieGrid movies={otherMovies} />
                    </div>
                    <div className="content-section">
                        <SectionHeader title="POPULAR MOVIES" subtitle="Most Watched" count={popular.length} />
                        <MovieGrid movies={popular} />
                    </div>
                    <div className="content-section">
                        <SectionHeader title="POPULAR TV SHOWS" subtitle="Top Series" count={tvShows.length} />
                        <MovieGrid movies={tvShows} />
                    </div>
                </div>
            )}

            {/* ── BROWSE / INFINITE SCROLL */}
            {activeSection === "browse" && (
                <div className="homepage__sections animate-fade-in">
                    <div className="content-section">
                        <FilterBar genres={genres} filters={filters} onFilterChange={updateFilters} />
                        {browseLoading ? (
                            <SkeletonGrid count={10} />
                        ) : browseMovies.length === 0 ? (
                            <div className="browse-empty">
                                <span>⊘</span>
                                <p>No results found. Try changing filters.</p>
                            </div>
                        ) : (
                            <>
                                <MovieGrid movies={browseMovies} />
                                <ScrollSentinel
                                    sentinelRef={sentinelRef}
                                    appending={appending}
                                    hasMore={hasMore}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}