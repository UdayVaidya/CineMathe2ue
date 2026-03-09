import express from 'express';
import {
    getAllUsers,
    toggleBanUser,
    deleteUser,
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
} from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 */

// User management
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/ban:
 *   put:
 *     summary: Toggle ban status for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User ban status toggled
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/users/:id/ban', toggleBanUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User removed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/users/:id', deleteUser);

// Movie management (CRUD)

/**
 * @swagger
 * /api/admin/movies:
 *   get:
 *     summary: Get all custom movies
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of movies
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 */
router.get('/movies', getAllMovies);

/**
 * @swagger
 * /api/admin/movies:
 *   post:
 *     summary: Create a custom movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *               poster_path:
 *                 type: string
 *               backdrop_path:
 *                 type: string
 *     responses:
 *       201:
 *         description: Movie created
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 */
router.post('/movies', createMovie);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   put:
 *     summary: Update a custom movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               overview:
 *                 type: string
 *     responses:
 *       200:
 *         description: Movie updated
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/movies/:id', updateMovie);

/**
 * @swagger
 * /api/admin/movies/{id}:
 *   delete:
 *     summary: Delete a custom movie
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie removed
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Not authorized as an admin
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/movies/:id', deleteMovie);

export default router;
