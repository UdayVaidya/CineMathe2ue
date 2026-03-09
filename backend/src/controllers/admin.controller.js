import User from '../models/User.js';
import Movie from '../models/Movie.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Admin
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: users.length, 
            users 
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Ban / Unban a user
 * @route   PUT /api/admin/users/:id/ban
 * @access  Admin
 */
export const toggleBanUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
        if (user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Cannot ban an admin' 
            });
        }
        user.isBanned = !user.isBanned;
        await user.save();
        res.status(200).json({
            success: true,
            message: user.isBanned ? 'User banned' : 'User unbanned',
            user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Admin
 */
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
        if (user.role === 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Cannot delete an admin' 
            });
        }
        await user.deleteOne();
        res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all admin-managed movies
 * @route   GET /api/admin/movies
 * @access  Admin
 */
export const getAllMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            count: movies.length, 
            movies 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a movie
 * @route   POST /api/admin/movies
 * @access  Admin
 */
export const createMovie = async (req, res, next) => {
    try {
        const { title, poster, description, tmdbId, releaseDate, trailerUrl, genre, category, rating } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Movie title is required' });
        }

        const movie = await Movie.create({
            title,
            poster,
            description,
            tmdbId,
            releaseDate,
            trailerUrl,
            genre,
            category,
            rating,
            addedBy: req.user._id,
        });

        res.status(201).json({ success: true, movie });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a movie
 * @route   PUT /api/admin/movies/:id
 * @access  Admin
 */
export const updateMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            movie 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a movie
 * @route   DELETE /api/admin/movies/:id
 * @access  Admin
 */
export const deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ 
                success: false, 
                message: 'Movie not found' 
            });
        }
        await movie.deleteOne();
        res.status(200).json({ 
            success: true, 
            message: 'Movie deleted successfully' 
        });
    } catch (error) {
        next(error);
    }
};
