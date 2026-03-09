import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Camera, Calendar } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#141414] text-[#f4f3ed] font-sans border-t border-[#1a1a1a] pb-12">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 pt-20">

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24">

                    {/* Brand Branding Area */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        <Link to="/" className="font-serif font-bold text-3xl md:text-4xl text-[#e63946] tracking-tighter hover:opacity-80 transition-opacity">
                            CINEMATHEQUE
                        </Link>
                        <p className="text-[#999] text-sm md:text-base leading-relaxed max-w-sm">
                            Established 1997. Dedicated to the preservation, study, and screening of our cinematic heritage. Every frame is a piece of history.
                        </p>

                        {/* Social / Action Icons */}
                        <div className="flex items-center gap-4 mt-4">
                            <button className="w-10 h-10 border border-[#333] flex items-center justify-center hover:bg-[#e63946] hover:border-[#e63946] hover:text-[#f4f3ed] text-[#999] transition-all">
                                <Facebook size={16} />
                            </button>
                            <button className="w-10 h-10 border border-[#333] flex items-center justify-center hover:bg-[#e63946] hover:border-[#e63946] hover:text-[#f4f3ed] text-[#999] transition-all">
                                <Camera size={16} />
                            </button>
                            <button className="w-10 h-10 border border-[#333] flex items-center justify-center hover:bg-[#e63946] hover:border-[#e63946] hover:text-[#f4f3ed] text-[#999] transition-all">
                                <Calendar size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Columns */}
                    <div className="md:col-span-7 grid grid-cols-2 gap-8 md:gap-16">
                        {/* Department Col */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-mono text-[#e63946] text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold">Department</h4>
                            <div className="flex flex-col gap-4 font-mono text-[10px] sm:text-xs tracking-widest text-[#999]">
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">CURATOR'S NOTES</Link>
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">FILM RESTORATION</Link>
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">LENDING LIBRARY</Link>
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">EXHIBITION SCHEDULE</Link>
                            </div>
                        </div>

                        {/* Information Col */}
                        <div className="flex flex-col gap-6">
                            <h4 className="font-mono text-[#e63946] text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold">Information</h4>
                            <div className="flex flex-col gap-4 font-mono text-[10px] sm:text-xs tracking-widest text-[#999]">
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">ACCESS POLICY</Link>
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">PRIVACY PROTOCOL</Link>
                                <Link to="#" className="hover:text-[#f4f3ed] hover:translate-x-1 transition-all">TERMS OF USE</Link>

                                <div className="mt-4 border border-[#333] px-4 py-2 text-center text-[10px] w-fit">
                                    Archive ID: 091-S
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[#1a1a1a] font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-[#666] uppercase">
                    <p>© 1997-2024 THE CINEMATHEQUE ARCHIVE PROJECT</p>
                    <p className="mt-4 md:mt-0">VOL. 84 - RELEASE 2.1.0</p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
