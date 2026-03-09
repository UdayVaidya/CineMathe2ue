import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import useMovieDetails from "../hooks/useMoviesDetails"

export default function MoviesDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    // URL se type detect karo
    const type = window.location.pathname.startsWith("/tv") ? "tv" : "movie"
    const { movie, loading, error } = useMovieDetails(id, type)
    const [showTrailer, setShowTrailer] = useState(false)

    // Trailer dhundho
    const trailer = movie?.videos?.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
    ) || movie?.videos?.results?.[0]

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-mono text-[#f4f3ed]">
                LOADING ARCHIVE...
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center font-mono text-[#f4f3ed]">
                <p className="text-[#e63946] text-xl mb-4">RECORD NOT FOUND</p>
                <button onClick={() => navigate(-1)} className="border border-[#333] px-4 py-2 text-xs tracking-widest hover:border-[#f4f3ed] transition-colors">
                    ← GO BACK
                </button>
            </div>
        )
    }

    const title = movie.title || movie.name
    const year = movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]
    const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
    const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null
    const cast = movie.credits?.cast?.slice(0, 8) || []

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans">

            {/* Backdrop */}
            {backdrop && (
                <div className="absolute inset-0 h-[60vh] overflow-hidden">
                    <img src={backdrop} alt="" className="w-full h-full object-cover opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
                </div>
            )}

            {/* Back Button */}
            <div className="relative z-10 p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="font-mono text-xs tracking-widest text-[#999] hover:text-[#f4f3ed] transition-colors"
                >
                    ← BACK
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-16 flex flex-col md:flex-row gap-12">

                {/* Poster */}
                <div className="w-full md:w-64 lg:w-80 flex-shrink-0">
                    {poster ? (
                        <img src={poster} alt={title} className="w-full rounded-sm border border-[#333]" />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-[#141414] border border-[#333] flex items-center justify-center font-mono text-xs text-[#444]">
                            NO POSTER
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold uppercase tracking-tight mb-2">{title}</h1>

                    <div className="flex flex-wrap gap-3 mb-6 font-mono text-xs">
                        {year && <span className="text-[#999] border border-[#333] px-2 py-1">{year}</span>}
                        {movie.vote_average > 0 && (
                            <span className="text-[#e63946] border border-[#e63946] px-2 py-1 font-bold">
                                ★ {movie.vote_average?.toFixed(1)}
                            </span>
                        )}
                        {movie.runtime && <span className="text-[#999] border border-[#333] px-2 py-1">{movie.runtime} min</span>}
                        {movie.genres?.map(g => (
                            <span key={g.id} className="text-[#666] border border-[#222] px-2 py-1">{g.name}</span>
                        ))}
                    </div>

                    {/* Trailer Button */}
                    <div className="mb-8">
                        {trailer ? (
                            <button
                                onClick={() => setShowTrailer(true)}
                                className="bg-[#e63946] text-red-500 px-6 py-3 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#f4f3ed] transition-colors flex items-center gap-2 "
                            >
                                ▶ PLAY TRAILER
                            </button>
                        ) : (
                            <p className="font-mono text-xs text-[#555] border border-[#222] px-4 py-3 inline-block">
                                Trailer for this movie is currently unavailable.
                            </p>
                        )}
                    </div>

                    {/* Overview */}
                    <div className="mb-8">
                        <h3 className="font-mono text-xs tracking-widest text-[#e63946] mb-3 uppercase">Overview</h3>
                        <p className="text-[#aaa] leading-relaxed max-w-2xl">
                            {movie.overview || "Description not available."}
                        </p>
                    </div>

                    {/* Cast */}
                    {cast.length > 0 && (
                        <div>
                            <h3 className="font-mono text-xs tracking-widest text-[#e63946] mb-4 uppercase">Cast</h3>
                            <div className="flex flex-wrap gap-3">
                                {cast.map(person => (
                                    <div key={person.id} className="text-center w-16">
                                        {person.profile_path ? (
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                                                alt={person.name}
                                                className="w-16 h-16 object-cover rounded-full border border-[#333] mb-1"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#333] mb-1 flex items-center justify-center text-[#444] text-xs">?</div>
                                        )}
                                        <p className="font-mono text-[8px] text-[#666] leading-tight line-clamp-2">{person.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="relative w-full max-w-4xl aspect-video"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute -top-10 right-0 font-mono text-xs text-[#999] hover:text-[#f4f3ed] tracking-widest"
                        >
                            ✕ CLOSE
                        </button>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                            title="Trailer"
                            className="w-full h-full border border-[#333]"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

        </div>
    )
}