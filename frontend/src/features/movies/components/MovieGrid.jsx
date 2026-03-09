import { memo } from "react"
import MovieCard from "./MovieCard"

function MovieGrid({ movies }) {
    return (
        <div className="movie-grid">
            {movies.map((movie, i) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                    index={i}
                />
            ))}
        </div>
    )
}

// Only re-render when movies array reference changes
export default memo(MovieGrid)