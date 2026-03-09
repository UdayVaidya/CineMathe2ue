import { memo } from "react"

function HeroArchive({ movie }) {
    if (!movie) return null

    const image = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`

    return (
        <section className="relative w-full h-[70vh] flex items-end border-b-2 border-[#e63946] overflow-hidden group">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-[2s] ease-out"
                style={{ backgroundImage: `url(${image})`, willChange: "filter, opacity" }}
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

            {/* Dark Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

            <div className="relative z-10 p-8 md:p-16 lg:p-24 w-full md:w-2/3">
                <div className="flex items-center gap-4 mb-6">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#0a0a0a] bg-[#e63946] px-3 py-1 font-bold">
                        TOP TIER ACCESS
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-[#999]">
                        RATING: {movie.vote_average?.toFixed(1) || "N/A"}
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-[#eaeaea] leading-[0.9] mb-6 uppercase drop-shadow-2xl">
                    {movie.title || movie.name}
                </h1>

                <p className="font-mono text-xs md:text-sm tracking-wide text-[#b3b3b3] leading-relaxed mb-8 max-w-2xl line-clamp-3 md:line-clamp-none">
                    {movie.overview}
                </p>

                <button className="border border-[#e63946] bg-transparent text-[#e63946] hover:bg-[#e63946] hover:text-[#0a0a0a] transition-colors py-4 px-8 font-mono text-xs tracking-[0.2em] font-bold uppercase cursor-pointer">
                    Access Record
                </button>
            </div>

            {/* Decorative corner */}
            <div className="absolute bottom-12 right-12 w-8 h-8 border-b-2 border-r-2 border-[#e63946] opacity-50 hidden md:block" />

        </section>
    )
}

// Hero only changes when the featured movie changes
export default memo(HeroArchive, (prev, next) => prev.movie?.id === next.movie?.id)