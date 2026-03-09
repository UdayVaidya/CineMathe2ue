import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Film, User, Search, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/store/authSlice.js';

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logoutUser()).unwrap();
        navigate('/login');
    };

    return (
        <aside className="fixed top-0 left-0 w-[var(--sidebar-w)] h-screen bg-[#0a0a0a] border-r border-[#1a1a1a] flex flex-col items-center justify-between py-6 z-50 text-[#999999] overflow-hidden">

            {/* Top Icon (Logo) */}
            <div className="flex flex-col items-center gap-6">
                <div className="w-10 h-10 border border-[#333] flex items-center justify-center bg-[#141414] mb-8 cursor-pointer hover:border-[#f4f3ed] hover:text-[#f4f3ed] transition-colors" onClick={() => navigate('/')}>
                    <Film size={20} />
                </div>
            </div>

            {/* Middle Navigation (Rotated Text) */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-32 w-full">
                <NavLink
                    to="/search"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-xs font-mono uppercase font-bold">
                        Search
                    </div>
                </NavLink>

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-xs font-mono uppercase font-bold">
                        Techniques
                    </div>
                </NavLink>

                <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                        `group flex flex-col items-center justify-center transition-all cursor-pointer ${isActive ? 'text-[#e63946]' : 'hover:text-[#f4f3ed]'}`
                    }
                >
                    <div className="rotate-[-90deg] whitespace-nowrap tracking-[0.2em] text-xs font-mono uppercase font-bold">
                        Archives
                    </div>
                </NavLink>
            </nav>

            {/* Bottom Avatar / Logout */}
            <div className="flex flex-col items-center gap-6 mt-8">
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
