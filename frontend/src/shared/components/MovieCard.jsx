import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Tv, Film } from 'lucide-react';
import { getPosterUrl } from '../../features/movies/services/tmdb.api.js';

export default function MovieCard({ item, type = 'movie' }) {
    // TMDB sometimes mixes movies and TV shows in multi-searches or trending
    const mediaType = item.media_type || type;
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date;
    const year = date ? new Date(date).getFullYear() : 'N/A';
    const link = `/${mediaType}/${item.id}`;

    return (
        <Link to={link} className="card group relative flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-900/20">
            {/* Poster Image */}
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-800">
                {item.poster_path ? (
                    <img
                        src={getPosterUrl(item.poster_path)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {mediaType === 'tv' ? <Tv size={48} /> : <Film size={48} />}
                    </div>
                )}

                {/* Rating Badge */}
                {item.vote_average > 0 && (
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-sm font-bold text-yellow-500 flex items-center gap-1 border border-white/10">
                        <Star size={14} fill="currentColor" />
                        {item.vote_average.toFixed(1)}
                    </div>
                )}

                {/* Media Type Badge */}
                {mediaType === 'tv' && (
                    <div className="absolute top-2 left-2 bg-blue-600/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-bold text-white uppercase tracking-wider">
                        TV
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-semibold text-gray-100 text-sm md:text-base line-clamp-1 mb-1" title={title}>
                    {title}
                </h3>
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <span>{year}</span>
                </div>
            </div>
        </Link>
    );
}
