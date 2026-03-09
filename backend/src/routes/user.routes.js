import express from 'express';
import {
    getProfile,
    updateProfile,
    getFavorites,
    addFavorite,
    removeFavorite,
    getWatchHistory,
    addToWatchHistory,
    clearWatchHistory,
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and management endpoints
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/profile', getProfile);
/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put('/profile', updateProfile);

/**
 * @swagger
 * /api/user/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite movies/TV shows
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/favorites', getFavorites);
/**
 * @swagger
 * /api/user/favorites:
 *   post:
 *     summary: Add an item to favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tmdbId
 *               - mediaType
 *             properties:
 *               tmdbId:
 *                 type: integer
 *               mediaType:
 *                 type: string
 *                 enum: [movie, tv]
 *               title:
 *                 type: string
 *               posterPath:
 *                 type: string
 *               voteAverage:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite added
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/favorites', addFavorite);
/**
 * @swagger
 * /api/user/favorites/{tmdbId}:
 *   delete:
 *     summary: Remove an item from favorites
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tmdbId
 *         required: true
 *         schema:
 *           type: integer
 *         description: TMDB ID of the item
 *     responses:
 *       200:
 *         description: Favorite removed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/favorites/:tmdbId', removeFavorite);

/**
 * @swagger
 * /api/user/history:
 *   get:
 *     summary: Get user watch history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User watch history
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/history', getWatchHistory);
/**
 * @swagger
 * /api/user/history:
 *   post:
 *     summary: Add an item to watch history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tmdbId
 *               - mediaType
 *             properties:
 *               tmdbId:
 *                 type: integer
 *               mediaType:
 *                 type: string
 *               title:
 *                 type: string
 *               posterPath:
 *                 type: string
 *               voteAverage:
 *                 type: number
 *               releaseDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Added to history
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/history', addToWatchHistory);
/**
 * @swagger
 * /api/user/history:
 *   delete:
 *     summary: Clear user watch history
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History cleared
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/history', clearWatchHistory);

export default router;
