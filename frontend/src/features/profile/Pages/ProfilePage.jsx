import React from 'react';
import useAuth from '../../auth/hooks/useAuth';
import { User, Mail, Shield, Film, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/store/authSlice';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans p-6 md:p-16 flex justify-center items-center">
            {/* Top Back/Home Button */}
            <button
                onClick={() => navigate('/home')}
                className="absolute top-8 left-8 md:top-12 md:left-12 font-mono text-xs tracking-widest text-[#999] hover:text-[#f4f3ed] z-10 transition-colors uppercase flex items-center gap-2 border border-[#333] px-4 py-2 hover:border-[#f4f3ed]"
            >
                ← BACK TO HOME
            </button>

            <div className="w-full max-w-4xl border-4 border-[#1a1a1a] bg-[#0f0f0f] relative flex flex-col md:flex-row mt-16 md:mt-0 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">

                {/* Abstract Generalized Photo Section */}
                <div className="border-b-4 md:border-b-0 md:border-r-4 border-[#1a1a1a] bg-[#141414] p-8 md:w-2/5 flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
                    {/* Brutalist Pattern Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #e63946 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />

                    {/* The Generalized Abstract Avatar */}
                    <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 border-[6px] border-[#333] group-hover:border-[#e63946] transition-colors bg-[#0a0a0a] flex items-center justify-center -rotate-3 hover:rotate-0 duration-300">
                        <User size={64} className="text-[#666] group-hover:text-[#e63946] transition-colors" />

                        {/* Overlay elements for brutalist vibe */}
                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#e63946]" />
                        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[#f4f3ed]" />
                    </div>

                    <div className="mt-8 relative z-10 text-center">
                        <p className="font-mono text-[10px] tracking-[0.3em] text-[#666] uppercase">IDENTITY VERIFIED</p>
                        <p className="font-mono tracking-widest text-xs text-[#e63946] mt-2 underline decoration-[#333] underline-offset-4">
                            ID: CINE_{user?.username ? user.username.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 123 : 99827}
                        </p>
                    </div>
                </div>

                {/* User Details Section */}
                <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-between relative bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f]">
                    <div className="absolute top-0 right-0 w-32 h-32 border-l border-b border-[#222] opacity-50" />

                    <div className="relative z-10">
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-tighter text-[#eaeaea] break-all leading-none mb-3 drop-shadow-[4px_4px_0_rgba(230,57,70,0.2)]">
                                {user.username || 'ANONYMOUS'}
                            </h1>
                            <div className="inline-block bg-[#e63946] text-[#000] text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] px-3 py-1 uppercase border-b-2 border-r-2 border-[#fff] shadow-[2px_2px_0px_rgba(255,255,255,0.2)]">
                                {user.role || 'Member'}
                            </div>
                        </div>

                        <div className="space-y-6 mt-12 bg-[#111] p-6 border border-[#222]">
                            <div className="flex items-center gap-4 text-[#999] hover:text-[#fff] transition-colors">
                                <Mail size={18} className="text-[#e63946]" />
                                <div className="font-mono text-xs md:text-sm tracking-widest break-all">
                                    {user.email || 'NO_EMAIL_FOUND'}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-[#999] hover:text-[#fff] transition-colors">
                                <Shield size={18} className="text-[#e63946]" />
                                <div className="font-mono text-xs md:text-sm tracking-widest uppercase">
                                    Access Level: <span className="text-[#f4f3ed]">{user.role === 'admin' ? 'MAXIMUM (LEVEL 9)' : 'STANDARD (LEVEL 1)'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-[#999] hover:text-[#fff] transition-colors">
                                <Film size={18} className="text-[#e63946]" />
                                <div className="font-mono text-xs md:text-sm tracking-widest uppercase">
                                    Status: <span className="text-green-500 animate-pulse">ACTIVE ⬤</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex gap-4 md:justify-end relative z-10">
                        <button
                            onClick={handleLogout}
                            className="w-full md:w-auto border-2 border-[#333] bg-[#0a0a0a] hover:border-[#e63946] hover:bg-[#e63946] text-[#999] hover:text-[#000] px-8 py-3 flex items-center justify-center gap-3 font-mono text-xs md:text-sm tracking-[0.2em] uppercase transition-all font-bold"
                        >
                            <LogOut size={16} />
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Decorative absolute corners */}
                <div className="absolute top-[-6px] left-[-6px] w-3 h-3 bg-[#e63946]"></div>
                <div className="absolute top-[-6px] right-[-6px] w-3 h-3 bg-[#f4f3ed]"></div>
                <div className="absolute bottom-[-6px] left-[-6px] w-3 h-3 bg-[#f4f3ed]"></div>
                <div className="absolute bottom-[-6px] right-[-6px] w-3 h-3 bg-[#e63946]"></div>

            </div>
        </div>
    );
}
