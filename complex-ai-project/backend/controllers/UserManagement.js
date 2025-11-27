// userManagement.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('./models/User'); // Assuming a User model is defined

const SECRET_KEY = 'your_secret_key'; // Use environment variable in production

/**
 * User Management Module
 * Handles user registration, authentication, and role-based access control.
 */

/**
 * Registers a new user.
 * @param {Object} userData - The user data for registration.
 * @returns {Promise<Object>} - The registered user status.
 */
async function registerUser(userData) {
    // Input validation
    const errors = validationResult(userData);
    if (!errors.isEmpty()) {
        throw new Error('Validation failed: ' + JSON.stringify(errors.array()));
    }

    const { username, password, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        throw new Error('User already exists.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return { status: 'User registered successfully', user: { username, role } };
}

/**
 * Authenticates a user and returns a JWT token.
 * @param {Object} userData - The user data for authentication.
 * @returns {Promise<String>} - The JWT token.
 */
async function authenticateUser(userData) {
    const { username, password } = userData;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found.');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password.');
    }

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

/**
 * Middleware to check user role.
 * @param {Array} allowedRoles - Roles that are allowed to access the route.
 */
function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).send('Access denied. No token provided.');
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).send('Invalid token.');
            if (!allowedRoles.includes(decoded.role)) {
                return res.status(403).send('Access denied.');
            }
            req.user = decoded;
            next();
        });
    };
}

module.exports = { registerUser, authenticateUser, authorizeRoles };