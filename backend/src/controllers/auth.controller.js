import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(statusCode).json({
        success: true,
        token,
        user: userWithoutPassword,
    });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email or username already exists' });
        }

        const user = await User.create({ username, email, password });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { role, email, password } = req.body;
        console.log("-> Login Attempt:", { email, role, passwordProvided: !!password });

        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: 'Role, email, and password are required' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log(`-> Login Failed: No user found for email ${email}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.role !== role) {
            return res.status(403).json({ success: false, message: 'Access denied. Incorrect role.' });
        }

        if (user.isBanned) {
            return res.status(403).json({ success: false, message: 'Your account has been banned' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`-> Login Failed: Incorrect password for user ${user._id}`);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    res.status(200).json({ success: true, user: req.user });
};
