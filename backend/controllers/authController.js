import User from '../models/User.js';
import { generateToken, generateRefreshToken } from '../utils/tokenUtils.js';

// Register User
export const register = async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        user = new User({
            fullName,
            email,
            password,
            phone,
            role: role || 'victim'
        });

        await user.save();

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        user.password = undefined;

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user,
                token,
                refreshToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error registering user'
        });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for user
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate tokens
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Remove password from response
        user.password = undefined;

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token,
                refreshToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error logging in'
        });
    }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error fetching user'
        });
    }
};

// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, phone, avatar } = req.body;

        let user = await User.findByIdAndUpdate(
            req.userId,
            { fullName, phone, avatar },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Error updating profile'
        });
    }
};
