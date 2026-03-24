import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceExpression from '../Components/FaceExpressions';
import tmdbClient from '../../../shared/api/tmdbClient';
import MovieGrid from '../../movies/components/MovieGrid';

const moodToGenres = {
    "Happy 😄": [35, 10751], // Comedy AND Family -> Pure lighthearted feel-good
    "Surprised 😲": [9648, 53], // Mystery AND Thriller -> High suspense / plot-twists
    "Sad 😢": [18, 10749], // Drama AND Romance -> Emotional / Tearjerkers
    "Naughty 😜": [28, 35], // Action AND Comedy -> Cheeky, edgy, badass (e.g., Deadpool)
    "Neutral 😐": [878], // Science Fiction -> Distanced, analytical, atmospheric
};

export default function MoodSearchPage() {
    const navigate = useNavigate();
    const [mood, setMood] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!mood || mood === "Detecting...") return;

        const fetchMoviesByMood = async () => {
            setLoading(true);
            try {
                const genres = moodToGenres[mood] || [28]; // Default to action if not found

                // Fetch recommended movies from our TMDB proxy
                const response = await tmdbClient.get('/discover/movie', {
                    params: {
                        with_genres: genres.join(','),
                        sort_by: 'popularity.desc',
                        page: 1
                    }
                });
                setMovies(response.data.results.slice(0, 10));
            } catch (error) {
                console.error("Error fetching mood movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMoviesByMood();
    }, [mood]);

    return (
        <div className="homepage" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="homepage__toolbar" style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/home')} className="toolbar-btn toolbar-btn--danger">← BACK TO HOME</button>
            </div>

            <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
                <h1 className="section-title">MOOD SCANNER</h1>
                <p style={{ color: "var(--muted-color)", marginBottom: "30px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "2px" }}>
                    Enable your camera to detect your mood and get personalized movie recommendations.
                </p>

                <div className="mood-scanner-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    <div style={{ background: 'var(--surface-color)', padding: '24px', border: '2px solid var(--border-color)', boxShadow: '8px 8px 0px rgba(0,0,0,0.8)' }}>
                        <FaceExpression onMoodChange={(detectedMood) => setMood(detectedMood)} />
                    </div>

                    <div style={{ background: 'var(--surface-color)', padding: '32px', border: '2px solid var(--border-color)', boxShadow: '8px 8px 0px rgba(0,0,0,0.8)', textAlign: 'left', minWidth: '340px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '3px', color: 'var(--muted-color)', borderBottom: '2px dotted var(--border-color)', paddingBottom: '12px', textTransform: 'uppercase', margin: 0 }}>
                            TARGET SIGNATURES
                        </h3>

                        {/* 2×2 grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                            {[
                                { emoji: '😄', mood: 'Happy',     genre: 'Feel-good Comedies',       tip: 'Smile widely, show teeth.' },
                                { emoji: '😲', mood: 'Surprised', genre: 'Mystery & Thrillers',       tip: 'Drop jaw, raise brows.' },
                                { emoji: '😢', mood: 'Sad',       genre: 'Romantic Dramas',           tip: 'Pull down lips hard.' },
                                { emoji: '😜', mood: 'Naughty',   genre: 'Edgy Action Comedies',      tip: 'Wink heavily.' },
                            ].map(({ emoji, mood, genre, tip }) => (
                                <div key={mood} style={{
                                    padding: '18px 14px',
                                    border: '1px solid var(--border-color)',
                                    background: '#0e0e0e',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    textAlign: 'center',
                                    transition: 'border-color 0.2s, background 0.2s',
                                }}>
                                    <span style={{ fontSize: '40px', lineHeight: 1 }}>{emoji}</span>
                                    <div style={{ fontWeight: 'bold', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase' }}>{mood}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--clr-danger)', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>{genre}</div>
                                    <div style={{ fontSize: '10px', color: '#555', fontStyle: 'italic', fontFamily: 'var(--font-sans)', lineHeight: 1.4 }}>{tip}</div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            </div>

            {(mood && mood !== "Detecting...") && (
                <div className="animate-fade-in">
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 className="section-title">RECOMMENDATIONS FOR: {mood.toUpperCase()}</h2>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--clr-danger)' }}>ANALYZING ARCHIVE...</div>
                    ) : (
                        <MovieGrid movies={movies} />
                    )}
                </div>
            )}
        </div>
    );
}
