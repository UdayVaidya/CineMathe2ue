import User from '../models/User.js';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
};

/**
 * @desc    Update user profile (avatar, username)
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { username, avatar } = req.body;
        const updated = await User.findByIdAndUpdate(
            req.user._id,
            { username, avatar },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, user: updated });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get user favorites
 * @route   GET /api/users/favorites
 * @access  Private
 */
export const getFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).select('favorites');
    res.status(200).json({ success: true, favorites: user.favorites });
};

/**
 * @desc    Add to favorites
 * @route   POST /api/users/favorites
 * @access  Private
 */
export const addFavorite = async (req, res) => {
    const { tmdbId, title, poster, mediaType } = req.body;

    const user = await User.findById(req.user._id);
    const alreadyExists = user.favorites.some((f) => f.tmdbId === tmdbId);

    if (alreadyExists) {
        return res.status(400).json({ success: false, message: 'Already in favorites' });
    }

    user.favorites.push({ tmdbId, title, poster, mediaType });
    await user.save();

    res.status(200).json({ success: true, favorites: user.favorites });
};

/**
 * @desc    Remove from favorites
 * @route   DELETE /api/users/favorites/:tmdbId
 * @access  Private
 */
export const removeFavorite = async (req, res) => {
    const tmdbId = Number(req.params.tmdbId);
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter((f) => f.tmdbId !== tmdbId);
    await user.save();

    res.status(200).json({ success: true, favorites: user.favorites });
};

/**
 * @desc    Get watch history
 * @route   GET /api/users/history
 * @access  Private
 */
export const getWatchHistory = async (req, res) => {
    const user = await User.findById(req.user._id).select('watchHistory');
    const sorted = user.watchHistory.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
    res.status(200).json({ success: true, watchHistory: sorted });
};

/**
 * @desc    Add to watch history
 * @route   POST /api/users/history
 * @access  Private
 */
export const addToWatchHistory = async (req, res) => {
    const { tmdbId, title, poster, mediaType } = req.body;

    const user = await User.findById(req.user._id);

    // Remove existing entry if already present (to update watchedAt)
    user.watchHistory = user.watchHistory.filter((h) => h.tmdbId !== tmdbId);

    // Add at the beginning (most recent first)
    user.watchHistory.unshift({ tmdbId, title, poster, mediaType, watchedAt: new Date() });

    // Keep only last 50 entries
    if (user.watchHistory.length > 50) {
        user.watchHistory = user.watchHistory.slice(0, 50);
    }

    await user.save();
    res.status(200).json({ success: true, watchHistory: user.watchHistory });
};

/**
 * @desc    Clear watch history
 * @route   DELETE /api/users/history
 * @access  Private
 */
export const clearWatchHistory = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.watchHistory = [];
    await user.save();
    res.status(200).json({ success: true, message: 'Watch history cleared' });
};
