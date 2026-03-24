import React from 'react';

export default function Logo({ className = "", size = 24 }) {
    return (
        <div 
            className={`flex items-center justify-center font-serif italic tracking-tighter leading-none ${className}`}
            style={{ fontSize: size, fontWeight: 900, color: '#f4f3ed' }}
        >
            <span style={{ transform: 'translateX(4px)' }}>C</span>
            <span style={{ color: '#e63946', transform: 'translateX(-4px) translateY(2px)' }}>M</span>
        </div>
    );
}
