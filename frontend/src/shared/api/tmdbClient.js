import axios from 'axios';

const tmdbClient = axios.create({
    // Send all TMDB requests to our backend proxy instead of TMDB directly
    baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'}/tmdb`,
    headers: {
        accept: 'application/json',
    }
});

export default tmdbClient;