import express from 'express';
import axios from 'axios';

const router = express.Router();

// Base TMDB variables
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
// Get the API key from environment variables
// It's recommended to place VITE_TMDB_API_KEY_READ_ACCESS in your backend .env as well,
// or use TMDB_API_KEY. We'll check both.
const getTmdbToken = () => {
    return process.env.VITE_TMDB_API_KEY_READ_ACCESS || process.env.TMDB_API_KEY;
};

// Catch all requests to /api/tmdb/*
router.all('/*', async (req, res) => {
    try {
        const tmdbToken = getTmdbToken();
        if (!tmdbToken) {
            return res.status(500).json({ error: 'TMDB API key not configured on server' });
        }

        // Construct the TMDB URL (req.url contains the path after /api/tmdb including query parameters)
        // Express router strips the mounting path, so req.url is exactly what we need to append.
        const urlReq = `${TMDB_BASE_URL}${req.url}`;

        // Forward the request to TMDB
        const response = await axios({
            method: req.method,
            url: urlReq,
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdbToken}`,
                // We might need to forward some headers if needed, but for TMDB just Auth + Accept is enough
            },
            // Include body for POST/PUT if necessary, though most TMDB requests are GET
            data: req.method !== 'GET' ? req.body : undefined
        });

        // Send back the TMDB response directly to the frontend
        res.status(response.status).json(response.data);

    } catch (error) {
        // Handle errors when proxying to TMDB
        console.error('TMDB Proxy Error:', error.response?.status, error.response?.data || error.message);
        const status = error.response?.status || 500;
        const data = error.response?.data || { error: 'Failed to access TMDB' };
        res.status(status).json(data);
    }
});

export default router;
