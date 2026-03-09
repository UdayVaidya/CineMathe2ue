import React from 'react';
import { useNavigate } from 'react-router-dom';

const apiSections = [
    {
        title: "ACCOUNT",
        items: [
            { name: "Lists", method: "GET" },
            { name: "Favorite Movies", method: "GET" },
            { name: "Favorite TV Shows", method: "GET" },
            { name: "Rated Movies", method: "GET" },
            { name: "Rated TV Shows", method: "GET" },
            { name: "Recommended Movies", method: "GET" },
            { name: "Recommended TV Shows", method: "GET" },
            { name: "Watchlist Movies", method: "GET" },
            { name: "Watchlist TV Shows", method: "GET" },
        ]
    },
    {
        title: "AUTH",
        items: [
            { name: "Create Access Token", method: "POST" },
            { name: "Create Request Token", method: "POST" },
            { name: "Logout", method: "DEL" },
        ]
    },
    {
        title: "LISTS",
        items: [
            { name: "Details", method: "GET" },
            { name: "Add Items", method: "POST" },
            { name: "Clear", method: "GET" },
            { name: "Create", method: "POST" },
            { name: "Delete", method: "DEL" },
            { name: "Item Status", method: "GET" },
            { name: "Remove Items", method: "DEL" },
            { name: "Update", method: "PUT" },
            { name: "Update Items", method: "PUT" },
        ]
    }
];

const getMethodStyle = (method) => {
    switch (method) {
        case 'GET':
            return 'text-[#10b981] border border-[#10b981] bg-[#10b981]/10'; // Green
        case 'POST':
            return 'text-[#3b82f6] border border-[#3b82f6] bg-[#3b82f6]/10'; // Blue
        case 'PUT':
            return 'text-[#8b5cf6] border border-[#8b5cf6] bg-[#8b5cf6]/10'; // Purple
        case 'DEL':
            return 'text-[#ef4444] border border-[#ef4444] bg-[#ef4444]/10'; // Red
        default:
            return 'text-gray-400 border border-gray-400 bg-gray-800';
    }
};

export default function TmdbDashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans p-6 md:p-12 lg:p-20 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12 border-b border-[#333] pb-6">
                <div>
                    <h1 className="text-4xl font-serif tracking-tight text-[#eaeaea]">API REFERENCE</h1>
                    <p className="font-mono text-xs tracking-widest text-[#666] mt-2 uppercase">TMDB System Tools</p>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="font-mono text-[10px] tracking-widest text-[#e63946] border border-[#333] px-4 py-2 hover:bg-[#141414] transition-colors uppercase"
                >
                    [ RETURN ]
                </button>
            </div>

            {/* Sections */}
            <div className="max-w-3xl mx-auto space-y-12">
                {apiSections.map((section, idx) => (
                    <div key={idx}>
                        <h2 className="font-mono text-sm tracking-[0.2em] text-[#888] mb-6 uppercase border-b border-[#222] pb-2">
                            {section.title}
                        </h2>

                        <div className="flex flex-col">
                            {section.items.map((item, idy) => (
                                <div
                                    key={idy}
                                    className="group flex justify-between items-center py-4 px-4 border-b border-[#1a1a1a] hover:bg-[#111] transition-colors cursor-pointer"
                                >
                                    <span className="text-base text-[#ccc] group-hover:text-[#fff] transition-colors font-medium">
                                        {item.name}
                                    </span>
                                    <span className={`font-mono text-[10px] tracking-wider px-2 py-1 rounded-[2px] ${getMethodStyle(item.method)}`}>
                                        {item.method}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
