// userIdentityManagement.js

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// User Schema definition
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    domain: { type: String, required: true },
    xpub: { type: String, required: true },
    userId: { type: String, default: uuidv4 },
    registrationStatus: { type: String, default: 'pending' }
});

const User = mongoose.model('User', userSchema);

/**
 * Registers a new user with a unique handle using extended public keys.
 * @param {string} username - The username of the user.
 * @param {string} domain - The domain associated with the user.
 * @param {string} xpub - The extended public key for identity management.
 * @returns {Promise<{user_id: string, registration_status: string}>} - Returns user ID and registration status.
 */
async function registerUser(username, domain, xpub) {
    // Input validation
    if (!username || !domain || !xpub) {
        throw new Error('All fields (username, domain, xpub) are required.');
    }

    try {
        const user = new User({ username, domain, xpub });
        await user.save();
        return { user_id: user.userId, registration_status: user.registrationStatus };
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Username already exists. Please choose a different username.');
        }
        throw new Error('Error registering user: ' + error.message);
    }
}

module.exports = { registerUser };