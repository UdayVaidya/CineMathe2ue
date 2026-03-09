import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Film, User, Search, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/store/authSlice.js';

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (
        <aside className="fixed z-50 bg-[#0a0a0a] border-[#1a1a1a] flex items-center justify-between overflow-hidden text-[#999999] 
            md:top-0 md:left-0 md:w-[var(--sidebar-w)] md:h-screen md:border-r md:flex-col md:py-6 md:px-0
            bottom-0 left-0 w-full h-16 border-t flex-row px-4"
        >
            {/* Top Icon (Logo) */}
            <div className="flex md:flex-col items-center gap-6">
                <div className="w-10 h-10 border border-[#333] flex items-center justify-center bg-[#141414] md:mb-8 cursor-pointer hover:border-[#f4f3ed] hover:text-[#f4f3ed] transition-colors" onClick={() => navigate('/')}>
                    <Film size={20} />
                </div>
            </div>

            {/* Middle Navigation */}
            <nav className="flex-1 flex md:flex-col items-center justify-center gap-6 md:gap-32 w-full md:w-auto h-full md:h-auto">
                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="md:rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-[10px] md:text-xs font-mono uppercase font-bold">
                        Search
                    </div>
                </NavLink>

                <NavLink
                    to="/mood"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="md:rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-[10px] md:text-xs font-mono uppercase font-bold">
                        Mood Scanner
                    </div>
                </NavLink>

                <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="md:rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-[10px] md:text-xs font-mono uppercase font-bold">
                        Favorites
                    </div>
                </NavLink>
            </nav>

            {/* Bottom Avatar / Logout */}
            <div className="flex flex-row md:flex-col items-center gap-4 md:gap-6 md:mt-8">
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `w-8 h-8 flex items-center justify-center bg-[#1a1a1a] border ${isActive ? 'border-[#e63946] text-[#e63946]' : 'border-[#333] hover:border-[#f4f3ed] text-[#999]'} transition-colors`}
                >
                    <User size={16} />
                </NavLink>

                <button onClick={handleLogout} className="text-[#666] hover:text-[#e63946] transition-colors">
                    <LogOut size={16} />
                </button>
            </div>
        </aside>
    );
}
