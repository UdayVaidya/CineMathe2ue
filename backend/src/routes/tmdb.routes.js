import express from 'express';
import axios from 'axios';
import dns from 'dns/promises';

const router = express.Router();

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_BASE_URL_ALT = 'https://api.tmdb.org/3'; // fallback hostname

const getTmdbToken = () =>
    process.env.VITE_TMDB_API_KEY_READ_ACCESS || process.env.TMDB_API_KEY;

// Axios instance with explicit timeout
const tmdbAxios = axios.create({ timeout: 12000 });

// Try primary URL first, then fallback
async function proxyRequest(req) {
    const token = getTmdbToken();
    if (!token) throw new Error('TMDB_API_KEY_NOT_SET');

    const buildConfig = (baseUrl) => ({
        method: req.method,
        url: `${baseUrl}${req.url}`,
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        data: req.method !== 'GET' ? req.body : undefined,
        timeout: 12000,
    });

    // Try primary first
    try {
        return await tmdbAxios(buildConfig(TMDB_BASE_URL));
    } catch (primaryErr) {
        // Only retry on connection errors (not 4xx)
        const isNetErr = !primaryErr.response;
        if (!isNetErr) throw primaryErr;

        console.warn('TMDB primary failed, trying fallback...');
        // Try alternate domain
        return await tmdbAxios(buildConfig(TMDB_BASE_URL_ALT));
    }
}

// Catch all requests to /api/tmdb/*
router.use('/', async (req, res) => {
    try {
        const response = await proxyRequest(req);
        res.status(response.status).json(response.data);
    } catch (error) {
        const status = error.response?.status || 502;
        const data = error.response?.data;
        const code = error.code; // ECONNREFUSED, ETIMEDOUT, etc.

        console.error('TMDB Proxy Error:', status, code || error.message);

        if (error.message === 'TMDB_API_KEY_NOT_SET') {
            return res.status(500).json({ error: 'TMDB API key not configured on server', code: 'NO_KEY' });
        }

        if (!error.response) {
            // Network-level failure — TMDB unreachable from server
            return res.status(503).json({
                error: 'TMDB unreachable from server',
                code: code || 'NETWORK_ERROR',
                hint: 'The server cannot reach api.themoviedb.org — try a VPN or change DNS on the server machine'
            });
        }

        res.status(status).json(data || { error: 'Failed to access TMDB', code: 'PROXY_ERROR' });
    }
});

// Health endpoint — lets frontend check if the SERVER itself can ping TMDB
router.get('/__ping', async (req, res) => {
    try {
        await dns.lookup('api.themoviedb.org');
        res.json({ reachable: true });
    } catch {
        res.json({ reachable: false });
    }
});

export default router;
