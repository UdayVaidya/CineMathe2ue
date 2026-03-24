import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Search, Heart, Smile, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/store/authSlice.js';
import Logo from './Logo.jsx';

const CLR_ACTIVE   = '#e63946';
const CLR_INACTIVE = '#888888';
const CLR_HOVER    = '#e63946';

function NavItem({ to, icon: Icon, label, desktopLabel }) {
    const [hovered, setHovered] = useState(false);
    return (
        <NavLink
            to={to}
            className="relative flex flex-col md:flex-row items-center md:items-center md:justify-start gap-1 md:gap-0 md:w-full md:py-4 transition-all duration-300 cursor-pointer overflow-hidden group/item"
            style={({ isActive }) => ({
                color: isActive ? CLR_ACTIVE : hovered ? CLR_HOVER : CLR_INACTIVE,
                backgroundColor: isActive ? 'rgba(230,57,70,0.05)' : hovered ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderLeft: isActive ? '4px solid #e63946' : '4px solid transparent'
            })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Absolute accent background gradient on active */}
            <div className="absolute inset-0 bg-gradient-to-r from-[rgba(230,57,70,0.1)] to-transparent opacity-0 md:group-[.active]/item:opacity-100 transition-opacity"></div>

            {/* Icon - Centered in the remaining 60px space */}
            <div className="relative z-10 w-[60px] flex items-center justify-center flex-shrink-0">
                <Icon size={24} className="hidden md:block transition-transform duration-300 group-hover/item:scale-110" />
                <Icon size={19} className="md:hidden" />
            </div>

            {/* Mobile: Label below icon */}
            <span className="md:hidden text-[10px] font-mono uppercase tracking-wide font-bold leading-none mt-1">
                {label}
            </span>

            {/* Desktop: Label that fades in when sidebar expands */}
            <span className="hidden md:block text-[11px] font-mono uppercase tracking-[0.2em] font-bold whitespace-nowrap opacity-0 translate-x-[-10px] transition-all duration-300 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 ml-1">
                {desktopLabel}
            </span>
        </NavLink>
    );
}

export default function Sidebar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navItems = [
        { to: '/search',    icon: Search, label: 'Search',    desktopLabel: 'Search' },
        { to: '/mood',      icon: Smile,  label: 'Mood',      desktopLabel: 'Mood Scanner' },
        { to: '/favorites', icon: Heart,  label: 'Saved',     desktopLabel: 'Favorites' },
    ];

    return (
        <aside className="group/sidebar fixed z-50 bg-[#070707]/95 backdrop-blur-xl border-[#1a1a1a] flex items-center justify-between overflow-hidden
            md:top-0 md:left-0 md:w-[var(--sidebar-w)] hover:md:w-[240px] md:h-screen md:border-r md:flex-col md:py-6 md:px-0 md:items-start
            bottom-0 left-0 w-full h-16 border-t flex-row px-2 transition-all duration-400 ease-[cubic-bezier(0.19,1,0.22,1)] shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
        >
            {/* Logo Section */}
            <div className="flex md:flex-row items-center md:w-full md:px-[12px] md:mb-10 cursor-pointer group/logo" onClick={() => navigate('/')}>
                 <div
                    className="flex-shrink-0 w-8 h-8 md:w-11 md:h-11 flex items-center justify-center bg-[#141414] border border-[#333] transition-all duration-300 group-hover/logo:border-[#e63946]"
                    style={{ color: '#888' }}
                >
                    <Logo size={20} className="group-hover/logo:scale-110 transition-transform duration-300" />
                </div>
                {/* Branding text fades in */}
                <span className="hidden md:block font-serif italic font-black text-[#eaeaea] text-[16px] ml-4 opacity-0 translate-x-[-10px] whitespace-nowrap transition-all duration-300 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 tracking-tighter">
                    CINE<span className="text-[#e63946] not-italic">MATHÈQUE</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex md:flex-col items-center md:items-start justify-evenly md:justify-start w-full md:w-full h-full md:h-auto md:gap-2 md:mt-4">
                {navItems.map((item) => (
                    <NavItem key={item.to} {...item} />
                ))}
            </nav>

            {/* Profile + Logout Bottom Section */}
            <div className="flex flex-row md:flex-col items-center md:items-start md:w-full gap-3 md:gap-2 md:mt-auto md:pb-4">
                
                {/* Profile Link */}
                <NavLink
                    to="/profile"
                    className="group/profile relative flex flex-row items-center md:justify-start gap-3 md:gap-0 md:w-full md:py-4 transition-all cursor-pointer"
                    style={({ isActive }) => ({
                        borderLeft: isActive ? '4px solid #e63946' : '4px solid transparent',
                        backgroundColor: isActive ? 'rgba(230,57,70,0.05)' : 'transparent',
                    })}
                >
                    <div className="relative z-10 w-[60px] flex items-center justify-center flex-shrink-0">
                        <div className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center bg-[#1a1a1a] border rounded border-[#333] transition-colors group-hover/profile:border-[#f4f3ed]">
                            <User size={18} className="text-[#999] group-[.active]/profile:text-[#e63946] transition-colors" />
                        </div>
                    </div>
                    <span className="hidden md:block text-[10px] font-mono uppercase tracking-widest font-bold text-[#888] whitespace-nowrap opacity-0 translate-x-[-10px] transition-all duration-300 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/profile:text-[#f4f3ed] ml-2">
                        Operator Profile
                    </span>
                </NavLink>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="group/logout relative flex flex-row items-center md:justify-start gap-4 md:gap-0 md:w-full md:py-4 transition-all cursor-pointer border-l-4 border-transparent hover:bg-[rgba(255,255,255,0.02)]"
                >
                    <div className="relative z-10 w-[60px] flex items-center justify-center flex-shrink-0 text-[#666] group-hover/logout:text-[#e63946] transition-colors">
                        <LogOut size={20} className="hidden md:block" />
                        <LogOut size={18} className="md:hidden" />
                    </div>
                    <span className="hidden md:block text-[10px] font-mono uppercase tracking-widest font-bold text-[#666] whitespace-nowrap opacity-0 translate-x-[-10px] transition-all duration-300 group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/logout:text-[#e63946] ml-2">
                        Terminate Session
                    </span>
                </button>

            </div>
        </aside>
    );
}
