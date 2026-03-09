import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, selectUser, selectIsLoggedIn, selectIsAdmin } from '../../features/auth/store/authSlice.js';
import { clearUserData } from '../../features/user/store/userSlice.js';
import { Search, Film, Heart, Clock, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const isAdmin = useSelector(selectIsAdmin);
    const user = useSelector(selectUser);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        dispatch(clearUserData());
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                {/* Logo */}
                <Link to="/" className="navbar__logo">
                    <Film size={22} />
                    Cine<span>Scope</span>
                </Link>

                {/* Desktop nav links */}
                <div className="navbar__links">
                    <Link to="/" className="navbar__link">Home</Link>
                    <Link to="/search" className="navbar__link">Movies</Link>
                    <Link to="/search?type=tv" className="navbar__link">TV Shows</Link>
                    <Link to="/search?type=person" className="navbar__link">People</Link>
                </div>

                {/* Right actions */}
                <div className="navbar__actions">
                    <Link to="/search" className="btn btn-icon" title="Search">
                        <Search size={18} />
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/favorites" className="btn btn-icon" title="Favorites">
                                <Heart size={18} />
                            </Link>
                            <Link to="/history" className="btn btn-icon" title="History">
                                <Clock size={18} />
                            </Link>
                            {isAdmin && (
                                <Link to="/admin" className="btn btn-icon" title="Admin Panel">
                                    <LayoutDashboard size={18} />
                                </Link>
                            )}
                            <div className="navbar__user-menu">
                                <Link to="/profile" className="navbar__avatar" title={user?.username}>
                                    {user?.avatar
                                        ? <img src={user.avatar} alt={user.username} />
                                        : <User size={18} />
                                    }
                                </Link>
                                <button onClick={handleLogout} className="btn btn-ghost navbar__logout">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    <button className="navbar__hamburger btn btn-icon" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="navbar__mobile-menu">
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/search" onClick={() => setMenuOpen(false)}>Movies</Link>
                    <Link to="/search?type=tv" onClick={() => setMenuOpen(false)}>TV Shows</Link>
                    <Link to="/search?type=person" onClick={() => setMenuOpen(false)}>People</Link>
                    {isLoggedIn && <Link to="/favorites" onClick={() => setMenuOpen(false)}>Favorites</Link>}
                    {isLoggedIn && <Link to="/history" onClick={() => setMenuOpen(false)}>Watch History</Link>}
                    {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
                    {!isLoggedIn && <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>}
                    {isLoggedIn && (
                        <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
                    )}
                </div>
            )}
        </nav>
    );
}
