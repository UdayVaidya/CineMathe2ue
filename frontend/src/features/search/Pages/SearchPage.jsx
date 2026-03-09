import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchSearchResults, setQuery, clearSearch } from "../store/searchSlice"
import useDebounce from "../../../shared/hooks/useDebounce"

export default function SearchPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { results, loading, query } = useSelector(state => state.search)
  const [inputValue, setInputValue] = useState("")
  const debouncedQuery = useDebounce(inputValue, 500)

  useEffect(() => {
    if (debouncedQuery.trim().length > 2) {
      dispatch(setQuery(debouncedQuery))
      dispatch(fetchSearchResults(debouncedQuery))
    } else {
      dispatch(clearSearch())
    }
  }, [debouncedQuery, dispatch])

  const handleCardClick = (item) => {
    const type = item.media_type || "movie"
    if (type === "person") return
    navigate(`/${type}/${item.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4f3ed] font-sans px-8 md:px-16 lg:px-24 py-12">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="font-mono text-xs tracking-widest text-[#999] hover:text-[#f4f3ed] transition-colors mb-8 block"
      >
        ← BACK
      </button>

      {/* Search Input */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold uppercase tracking-tight mb-6">SEARCH ARCHIVE</h1>
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search movies, TV shows, people..."
            autoFocus
            className="w-full bg-[#0a0a0a] border border-[#333] focus:border-[#e63946] outline-none px-4 py-4 font-mono text-sm text-[#f4f3ed] placeholder-[#444] transition-colors"
          />
          {inputValue && (
            <button
              onClick={() => { setInputValue(""); dispatch(clearSearch()) }}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-[#666] hover:text-[#f4f3ed]"
            >
              ✕
            </button>
          )}
        </div>
        {query && (
          <p className="font-mono text-xs text-[#666] mt-3 tracking-widest">
            {loading ? "SEARCHING..." : `${results.length} RESULTS FOR "${query.toUpperCase()}"`}
          </p>
        )}
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="font-mono text-xs text-[#666] tracking-widest">SCANNING DATABASE...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {results
            .filter(item => item.poster_path || item.profile_path)
            .map(item => {
              const title = item.title || item.name || "Unknown"
              const image = item.poster_path
                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                : item.profile_path
                ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
                : null
              const type = item.media_type
              const year = item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]

              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className={`group relative w-full aspect-[2/3] bg-[#0a0a0a] border border-[#333] overflow-hidden ${type !== "person" ? "hover:border-[#e63946] cursor-pointer" : "cursor-default"} transition-colors`}
                >
                  {image && (
                    <img
                      src={image}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                  {/* Type Badge */}
                  <div className="absolute top-2 left-2 font-mono text-[8px] tracking-widest px-1 border bg-[#0a0a0a]"
                    style={{ color: type === "movie" ? "#e63946" : type === "tv" ? "#3b82f6" : "#888", borderColor: type === "movie" ? "#e63946" : type === "tv" ? "#3b82f6" : "#888" }}>
                    {type?.toUpperCase()}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-3">
                    <p className="font-serif text-sm font-bold text-[#f4f3ed] uppercase leading-tight line-clamp-2">{title}</p>
                    {year && <p className="font-mono text-[9px] text-[#666] mt-1">{year}</p>}
                  </div>
                </div>
              )
            })}
        </div>
      ) : query && !loading ? (
        <div className="font-mono text-xs text-[#555] tracking-widest">NO RECORDS FOUND</div>
      ) : null}

    </div>
  )
}