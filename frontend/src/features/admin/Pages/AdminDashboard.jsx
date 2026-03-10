import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { adminGetMovies, adminCreateMovie, adminUpdateMovie, adminDeleteMovie, adminGetUsers, adminToggleBan, adminDeleteUser } from "../services/admin.api"

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("movies")
    const [movies, setMovies] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editMovie, setEditMovie] = useState(null)
    const [form, setForm] = useState({
        title: "", poster: "", description: "", tmdbId: "",
        releaseDate: "", trailerUrl: "", genre: "", category: "movie", rating: ""
    })

    useEffect(() => {
        if (activeTab === "movies") loadMovies()
        if (activeTab === "users") loadUsers()
    }, [activeTab])

    const loadMovies = async () => {
        try {
            setLoading(true)
            const res = await adminGetMovies()
            setMovies(res.data.movies)
        } catch (e) {
            console.error(e)
        } finally { setLoading(false) }
    }

    const loadUsers = async () => {
        try {
            setLoading(true)
            const res = await adminGetUsers()
            setUsers(res.data.users)
        } catch (e) {
            console.error(e)
        } finally { setLoading(false) }
    }

    const handleSubmit = async () => {
        try {
            const data = { ...form, genre: form.genre.split(",").map(g => g.trim()), rating: Number(form.rating) }
            if (editMovie) {
                await adminUpdateMovie(editMovie._id, data)
            } else {
                await adminCreateMovie(data)
            }
            setShowForm(false)
            setEditMovie(null)
            setForm({ title: "", poster: "", description: "", tmdbId: "", releaseDate: "", trailerUrl: "", genre: "", category: "movie", rating: "" })
            loadMovies()
        } catch (e) { console.error(e) }
    }

    const handleEdit = (movie) => {
        setEditMovie(movie)
        setForm({
            title: movie.title || "", poster: movie.poster || "", description: movie.description || "",
            tmdbId: movie.tmdbId || "", releaseDate: movie.releaseDate || "", trailerUrl: movie.trailerUrl || "",
            genre: movie.genre?.join(", ") || "", category: movie.category || "movie", rating: movie.rating || ""
        })
        setShowForm(true)
    }

    const handleDeleteMovie = async (id) => {
        if (!confirm("Delete this movie?")) return
        await adminDeleteMovie(id)
        loadMovies()
    }

    const handleToggleBan = async (id) => {
        await adminToggleBan(id)
        loadUsers()
    }

    const handleDeleteUser = async (id) => {
        if (!confirm("Delete this user?")) return
        await adminDeleteUser(id)
        loadUsers()
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans">

            {/* Header */}
            <div className="border-b border-[#1a1a1a] px-8 py-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-serif font-bold uppercase tracking-tight">ADMIN DASHBOARD</h1>
                    <p className="font-mono text-xs text-[#666] mt-1 tracking-widest">SYSTEM CONTROL PANEL</p>
                </div>
                <button onClick={() => navigate("/home")} className="font-mono text-xs text-[#999] hover:text-[#f4f3ed] tracking-widest transition-colors">
                    ← BACK TO APP
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#1a1a1a] px-8">
                {["movies", "users"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`font-mono text-xs tracking-widest py-4 px-6 border-b-2 transition-colors uppercase ${activeTab === tab ? "border-[#e63946] text-[#e63946]" : "border-transparent text-[#666] hover:text-[#f4f3ed]"}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="px-8 py-8">

                {/* MOVIES TAB */}
                {activeTab === "movies" && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-mono text-xs tracking-widest text-[#666] uppercase">{movies.length} MOVIES IN DATABASE</h2>
                            <button
                                onClick={() => { setShowForm(true); setEditMovie(null); setForm({ title: "", poster: "", description: "", tmdbId: "", releaseDate: "", trailerUrl: "", genre: "", category: "movie", rating: "" }) }}
                                className="bg-[#e63946] text-white hover:text-red-500 px-4 py-2 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#f4f3ed] transition-colors"
                            >
                                + ADD MOVIE
                            </button>
                        </div>

                        {/* Movie Form */}
                        {showForm && (
                            <div className="bg-[#0f0f0f] border border-[#333] p-6 mb-8">
                                <h3 className="font-mono text-xs tracking-widest text-[#e63946] mb-6 uppercase">{editMovie ? "EDIT MOVIE" : "ADD NEW MOVIE"}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { key: "title", label: "MOVIE TITLE *" },
                                        { key: "poster", label: "POSTER IMAGE URL" },
                                        { key: "tmdbId", label: "TMDB ID" },
                                        { key: "releaseDate", label: "RELEASE DATE" },
                                        { key: "trailerUrl", label: "TRAILER YOUTUBE LINK" },
                                        { key: "genre", label: "GENRES (comma separated)" },
                                        { key: "rating", label: "RATING (0-10)" },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="font-mono text-[10px] text-[#666] tracking-widest block mb-1">{label}</label>
                                            <input
                                                value={form[key]}
                                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                                className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#e63946] outline-none px-3 py-2 font-mono text-sm text-[#f4f3ed] transition-colors"
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="font-mono text-[10px] text-[#666] tracking-widest block mb-1">CATEGORY</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#e63946] outline-none px-3 py-2 font-mono text-sm text-[#f4f3ed]"
                                        >
                                            {["movie", "tv", "anime", "documentary", "other"].map(c => (
                                                <option key={c} value={c}>{c.toUpperCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="font-mono text-[10px] text-[#666] tracking-widest block mb-1">DESCRIPTION</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#e63946] outline-none px-3 py-2 font-mono text-sm text-[#f4f3ed] transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button onClick={handleSubmit} className="bg-[#e63946] text-white hover:text-red-500 px-6 py-2 font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#f4f3ed] transition-colors">
                                        {editMovie ? "UPDATE" : "CREATE"}
                                    </button>
                                    <button onClick={() => { setShowForm(false); setEditMovie(null) }} className="border border-[#333] px-6 py-2 font-mono text-xs tracking-widest uppercase text-white hover:border-red-500 hover:text-red-500 transition-colors">
                                        CANCEL
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Movies List */}
                        {loading ? (
                            <div className="font-mono text-xs text-[#666] tracking-widest">LOADING...</div>
                        ) : movies.length === 0 ? (
                            <div className="font-mono text-xs text-[#555] tracking-widest border border-[#1a1a1a] p-8 text-center">NO MOVIES IN DATABASE</div>
                        ) : (
                            <div className="space-y-3">
                                {movies.map(movie => (
                                    <div key={movie._id} className="flex items-center gap-4 border border-[#1a1a1a] p-4 hover:border-[#333] transition-colors">
                                        {movie.poster && <img src={movie.poster} alt={movie.title} className="w-10 h-14 object-cover border border-[#333]" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-serif font-bold text-sm uppercase truncate">{movie.title}</p>
                                            <p className="font-mono text-[10px] text-[#666] mt-1">{movie.category?.toUpperCase()} • {movie.releaseDate || "N/A"} • ★ {movie.rating || "N/A"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(movie)} className="border border-[#3b82f6] text-[#3b82f6] px-3 py-1 font-mono text-[10px] tracking-widest hover:bg-[#3b82f6] hover:text-white transition-colors">
    EDIT
</button>
                                            <button onClick={() => handleDeleteMovie(movie._id)} className="border border-[#e63946] text-[#e63946] px-3 py-1 font-mono text-[10px] tracking-widest hover:bg-[#e63946] hover:text-white transition-colors">
    DELETE
</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === "users" && (
                    <div>
                        <h2 className="font-mono text-xs tracking-widest text-[#666] uppercase mb-6">{users.length} REGISTERED USERS</h2>
                        {loading ? (
                            <div className="font-mono text-xs text-[#666] tracking-widest">LOADING...</div>
                        ) : (
                            <div className="space-y-3">
                                {users.map(user => (
                                    <div key={user._id} className={`flex items-center gap-4 border p-4 transition-colors ${user.isBanned ? "border-[#e63946]/30 bg-[#e63946]/5" : "border-[#1a1a1a] hover:border-[#333]"}`}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-serif font-bold text-sm uppercase">{user.username}</p>
                                                {user.role === "admin" && <span className="font-mono text-[8px] text-[#e63946] border border-[#e63946] px-1">ADMIN</span>}
                                                {user.isBanned && <span className="font-mono text-[8px] text-[#666] border border-[#666] px-1">BANNED</span>}
                                            </div>
                                            <p className="font-mono text-[10px] text-[#666] mt-1">{user.email}</p>
                                        </div>
                                        {user.role !== "admin" && (
                                            <div className="flex gap-2">
                                                <button onClick={() => handleToggleBan(user._id)} className={`border px-3 py-1 font-mono text-[10px] tracking-widest transition-colors ${user.isBanned ? "border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-[#f4f3ed]" : "border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-[#f4f3ed]"}`}>
                                                    {user.isBanned ? "UNBAN" : "BAN"}
                                                </button>
                                                <button onClick={() => handleDeleteUser(user._id)} className="border border-[#e63946] text-[#e63946] px-3 py-1 font-mono text-[10px] tracking-widest hover:bg-[#e63946] hover:text-[#f4f3ed] transition-colors">
                                                    DELETE
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}