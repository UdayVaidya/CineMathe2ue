import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard.jsx';

export default function Carousel({ title, items, loading, type = 'movie' }) {
    const scrollRef = useRef(null);

    const scroll = (dir) => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = dir === 'left' ? -clientWidth + 100 : clientWidth - 100;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="mb-8 relative w-full">
                {title && <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-8">{title}</h2>}
                <div className="flex gap-4 overflow-hidden px-4 md:px-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex-none w-36 md:w-48 xl:w-56 aspect-[2/3] skeleton rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!items || items.length === 0) return null;

    return (
        <div className="mb-10 relative w-full group">
            {title && <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-10 border-l-4 border-red-600 ml-4 md:ml-8 pl-2">{title}</h2>}

            <div className="relative">
                {/* Scroll Indicators / Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-red-600 text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-all duration-300 h-full backdrop-blur-sm sm:h-auto sm:py-6 ml-2 sm:ml-4"
                >
                    <ChevronLeft size={28} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-4 md:px-10 pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar specifically for the carousel
                >
                    {items.map((item) => (
                        <div key={item.id} className="flex-none w-[140px] md:w-[180px] xl:w-[220px] snap-start">
                            <MovieCard item={item} type={type} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-red-600 text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300 h-full backdrop-blur-sm sm:h-auto sm:py-6 mr-2 sm:mr-4"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Custom inline style for hiding scrollbar specifically here just in case */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}} />
        </div>
    );
}
