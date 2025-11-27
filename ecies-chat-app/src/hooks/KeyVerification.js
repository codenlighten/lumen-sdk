// KeyVerification Module
const CryptoJS = require('crypto-js');

/**
 * KeyVerification class to handle key verification through user fingerprints.
 */
class KeyVerification {
    constructor() {
        // Initialize any required properties here
    }

    /**
     * Verifies if the provided fingerprint matches the stored key for the user.
     * @param {string} fingerprint - The fingerprint of the user.
     * @param {string} userId - The unique identifier for the user.
     * @returns {Promise<boolean>} - Returns true if verification is successful, otherwise false.
     * @throws {Error} - Throws an error if input validation fails or if verification fails.
     */
    async verifyKey(fingerprint, userId) {
        // Input validation
        if (typeof fingerprint !== 'string' || typeof userId !== 'string') {
            throw new Error('Invalid input: fingerprint and userId must be strings.');
        }

        // Simulate fetching the stored key (in a real scenario, this would come from a database)
        const storedKey = await this.getStoredKey(userId);
        if (!storedKey) {
            throw new Error('No key found for the provided userId.');
        }

        // Hash the fingerprint
        const hashedFingerprint = CryptoJS.SHA256(fingerprint).toString();

        // Compare the hashed fingerprint with the stored key
        const verificationStatus = hashedFingerprint === storedKey;
        return verificationStatus;
    }

    /**
     * Simulates fetching the stored key for a user from a database.
     * @param {string} userId - The unique identifier for the user.
     * @returns {Promise<string|null>} - Returns the stored key or null if not found.
     */
    async getStoredKey(userId) {
        // Placeholder for database call. Replace with actual database logic.
        const mockDatabase = {
            'user1': CryptoJS.SHA256('fingerprint1').toString(),
            'user2': CryptoJS.SHA256('fingerprint2').toString()
        };
        return mockDatabase[userId] || null;
    }
}

module.exports = KeyVerification;

// Unit Tests
const assert = require('assert');
const KeyVerification = require('./KeyVerification');

describe('KeyVerification', function() {
    let keyVerification;

    beforeEach(() => {
        keyVerification = new KeyVerification();
    });

    it('should verify a correct fingerprint', async function() {
        const result = await keyVerification.verifyKey('fingerprint1', 'user1');
        assert.strictEqual(result, true);
    });

    it('should not verify an incorrect fingerprint', async function() {
        const result = await keyVerification.verifyKey('wrongFingerprint', 'user1');
        assert.strictEqual(result, false);
    });

    it('should throw an error for invalid input', async function() {
        await assert.rejects(
            keyVerification.verifyKey(123, 'user1'),
            { message: 'Invalid input: fingerprint and userId must be strings.' }
        );
    });

    it('should throw an error if userId does not exist', async function() {
        await assert.rejects(
            keyVerification.verifyKey('fingerprint1', 'nonExistentUser'),
            { message: 'No key found for the provided userId.' }
        );
    });
});