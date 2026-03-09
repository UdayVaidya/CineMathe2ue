import axios from 'axios';

const tmdbClient = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY_READ_ACCESS}`
    }
});

export default tmdbClient;