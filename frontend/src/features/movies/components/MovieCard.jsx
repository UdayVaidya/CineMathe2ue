import { useNavigate } from "react-router-dom"
export default function MovieCard({ movie }) {

    const navigate = useNavigate();

    const image = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null

    const title = movie.title || movie.name || "Unknown"
    const year = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || 'N/A'
    const mediaType = movie.media_type || (movie.first_air_date ? "tv" : "movie")

    const handleClick = () => {
    navigate(`/${mediaType}/${movie.id}`)
    console.log("movie deatails clicked!")
    }

    return (
        <div 
        onClick={handleClick}
        className="group relative w-full aspect-[2/3] bg-[#0a0a0a] border border-[#333] hover:border-[#e63946] transition-colors cursor-pointer overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(230,57,70,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:10px_10px]" />

            {/* Poster Image */}
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            ) : (
                /* Fallback — no image */
                <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
                    <span className="font-mono text-[10px] text-[#444] tracking-widest text-center px-4">NO POSTER</span>
                </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Info Block */}
            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">

                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-[#f4f3ed] uppercase tracking-tight leading-none group-hover:text-[#e63946] transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>

                <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-4">
                    <span className="font-mono text-[10px] tracking-widest text-[#999] bg-[#141414] px-2 py-1 border border-[#333]">
                        {year}
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-[#e63946] border border-[#e63946] px-2 py-1 font-bold">
                        {movie.vote_average?.toFixed(1) || 'NR'}
                    </span>
                </div>

            </div>

            {/* REC badge */}
            <div className="absolute top-4 right-4 font-mono text-[8px] tracking-widest text-[#e63946] opacity-0 group-hover:opacity-100 border border-[#e63946] px-1 bg-[#0a0a0a]">
                REC
            </div>

        </div>
    )
}

