import React from 'react';

export default function TitleLogo({ className = "" }) {
    return (
        <div className={`flex flex-col select-none ${className}`}>
            <h1 className="font-serif italic text-4xl md:text-5xl tracking-tighter text-[#eaeaea] leading-[0.8] drop-shadow-lg">
                CINEMATHEQUE <br />
                <span className="not-italic text-[#e63946] font-bold tracking-tight text-3xl md:text-4xl">ARCHIVAL</span>
            </h1>
        </div>
    );
}
