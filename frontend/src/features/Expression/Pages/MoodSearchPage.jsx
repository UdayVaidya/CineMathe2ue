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
            <div style={{ textAlign: "center", marginBottom: "40px", paddingTop: "20px" }}>
                <h1 className="section-title">MOOD SCANNER</h1>
                <p style={{ color: "var(--muted-color)", marginBottom: "30px", fontFamily: "var(--font-mono)", fontSize: "0.8rem", letterSpacing: "2px" }}>
                    Enable your camera to detect your mood and get personalized movie recommendations.
                </p>

                <div className="mood-scanner-wrapper" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', alignItems: 'stretch' }}>
                    <div style={{ background: 'var(--surface-color)', padding: '24px', border: '2px solid var(--border-color)', boxShadow: '8px 8px 0px rgba(0,0,0,0.8)' }}>
                        <FaceExpression onMoodChange={(detectedMood) => setMood(detectedMood)} />
                    </div>

                    <div style={{ background: 'var(--surface-color)', padding: '32px', border: '2px solid var(--border-color)', boxShadow: '8px 8px 0px rgba(0,0,0,0.8)', textAlign: 'left', minWidth: '340px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', letterSpacing: '3px', color: 'var(--muted-color)', marginBottom: '10px', borderBottom: '2px dotted var(--border-color)', paddingBottom: '12px', textTransform: 'uppercase' }}>
                            TARGET SIGNATURES
                        </h3>

                        <div style={{ padding: '16px', border: '1px solid var(--border-color)', background: '#111', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '32px' }}>😄</span>
                            <div>
                                <div style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Happy</div>
                                <div style={{ fontSize: '11px', color: 'var(--clr-danger)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Feel-good Family Comedies</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted-color)', marginTop: '4px', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>Tip: Smile widely showing teeth.</div>
                            </div>
                        </div>

                        <div style={{ padding: '16px', border: '1px solid var(--border-color)', background: '#111', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '32px' }}>😲</span>
                            <div>
                                <div style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Surprised</div>
                                <div style={{ fontSize: '11px', color: 'var(--clr-danger)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Twisty Mystery & Thrillers</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted-color)', marginTop: '4px', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>Tip: Drop your jaw & raise brows.</div>
                            </div>
                        </div>

                        <div style={{ padding: '16px', border: '1px solid var(--border-color)', background: '#111', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '32px' }}>😢</span>
                            <div>
                                <div style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Sad</div>
                                <div style={{ fontSize: '11px', color: 'var(--clr-danger)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Emotional Romantic Dramas</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted-color)', marginTop: '4px', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>Tip: Pull down lips (frown) hard.</div>
                            </div>
                        </div>

                        <div style={{ padding: '16px', border: '1px solid var(--border-color)', background: '#111', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '32px' }}>😜</span>
                            <div>
                                <div style={{ fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Naughty</div>
                                <div style={{ fontSize: '11px', color: 'var(--clr-danger)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>Edgy Action Comedies</div>
                                <div style={{ fontSize: '11px', color: 'var(--muted-color)', marginTop: '4px', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>Tip: Wink heavily with one eye.</div>
                            </div>
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
