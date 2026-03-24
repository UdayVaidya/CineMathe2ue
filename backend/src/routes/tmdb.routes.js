import express from 'express';
import axios from 'axios';
import dns from 'dns/promises';

const router = express.Router();

const TMDB_BASE_URL = 'https://api.tmdb.org/3';
const TMDB_BASE_URL_ALT = 'https://api.themoviedb.org/3';

const getTmdbToken = () =>
    process.env.VITE_TMDB_API_KEY_READ_ACCESS || process.env.TMDB_API_KEY;

const tmdbAxios = axios.create({ timeout: 12000 });

// ── In-memory cache ────────────────────────────────────────────────────────
const cache = new Map();

// How long to cache each type of request (ms)
const TTL = {
    trending:  10 * 60 * 1000,  // 10 min — changes once a day
    popular:   10 * 60 * 1000,  // 10 min
    genre:     60 * 60 * 1000,  // 1 hour — almost never changes
    discover:   2 * 60 * 1000,  // 2 min
    search:     2 * 60 * 1000,  // 2 min — same search term same results
    detail:     5 * 60 * 1000,  // 5 min — movie/tv detail pages
    default:    5 * 60 * 1000,  // 5 min fallback
};

function getTTL(url) {
    if (url.includes('/trending/'))       return TTL.trending;
    if (url.includes('/popular'))         return TTL.popular;
    if (url.includes('/genre/'))          return TTL.genre;
    if (url.includes('/discover/'))       return TTL.discover;
    if (url.includes('/search/'))         return TTL.search;
    if (url.match(/\/(movie|tv)\/\d+/))  return TTL.detail;
    return TTL.default;
}

function getCacheKey(req) {
    // Include query string so different filter combos are cached separately
    return `${req.method}:${req.url}`;
}

function getFromCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setInCache(key, data, ttl) {
    // Evict oldest entries if cache grows too large (> 200 entries)
    if (cache.size >= 200) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
    }
    cache.set(key, { data, expiresAt: Date.now() + ttl });
}
// ──────────────────────────────────────────────────────────────────────────

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

    try {
        return await tmdbAxios(buildConfig(TMDB_BASE_URL));
    } catch (primaryErr) {
        const isNetErr = !primaryErr.response;
        if (!isNetErr) throw primaryErr;
        console.warn('TMDB primary failed, trying fallback...');
        return await tmdbAxios(buildConfig(TMDB_BASE_URL_ALT));
    }
}

// Catch all requests to /api/tmdb/*
router.use('/', async (req, res) => {
    // Only cache GET requests
    if (req.method === 'GET') {
        const key = getCacheKey(req);
        const cached = getFromCache(key);
        if (cached) {
            res.set('X-Cache', 'HIT');
            return res.status(200).json(cached);
        }
    }

    try {
        const response = await proxyRequest(req);

        if (req.method === 'GET') {
            const key = getCacheKey(req);
            const ttl = getTTL(req.url);
            setInCache(key, response.data, ttl);
            res.set('X-Cache', 'MISS');
        }

        res.status(response.status).json(response.data);
    } catch (error) {
        const status = error.response?.status || 502;
        const data = error.response?.data;
        const code = error.code;

        console.error('TMDB Proxy Error:', status, code || error.message);

        if (error.message === 'TMDB_API_KEY_NOT_SET') {
            return res.status(500).json({ error: 'TMDB API key not configured on server', code: 'NO_KEY' });
        }

        if (!error.response) {
            return res.status(503).json({
                error: 'TMDB unreachable from server',
                code: code || 'NETWORK_ERROR',
                hint: 'The server cannot reach api.themoviedb.org — try a VPN or change DNS on the server machine'
            });
        }

        res.status(status).json(data || { error: 'Failed to access TMDB', code: 'PROXY_ERROR' });
    }
});

// Health endpoint
router.get('/__ping', async (req, res) => {
    try {
        await dns.lookup('api.themoviedb.org');
        res.json({ reachable: true });
    } catch {
        res.json({ reachable: false });
    }
});

export default router;
