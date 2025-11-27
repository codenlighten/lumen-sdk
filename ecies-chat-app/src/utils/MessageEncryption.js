// Import required libraries
const EC = require('elliptic').ec;
const crypto = require('crypto-js');

// Initialize elliptic curve
const ec = new EC('p256');

/**
 * Encrypts a message using ECIES (Elliptic Curve Integrated Encryption Scheme).
 *
 * @param {string} message - The plaintext message to encrypt.
 * @param {string} recipientPublicKey - The recipient's public key in hex format.
 * @param {string} senderPrivateKey - The sender's private key in hex format.
 * @returns {string} - The encrypted message in base64 format.
 * @throws {Error} - Throws an error if input validation fails or encryption fails.
 */
function encryptMessage(message, recipientPublicKey, senderPrivateKey) {
    // Input validation
    if (typeof message !== 'string' || typeof recipientPublicKey !== 'string' || typeof senderPrivateKey !== 'string') {
        throw new Error('Invalid input: All inputs must be strings.');
    }

    // Generate sender's key pair
    const senderKeyPair = ec.keyFromPrivate(senderPrivateKey);
    const recipientKey = ec.keyFromPublic(recipientPublicKey, 'hex');

    // Generate ephemeral key pair
    const ephemeralKeyPair = ec.genKeyPair();
    const ephemeralPublicKey = ephemeralKeyPair.getPublic();

    // Compute shared secret
    const sharedSecret = ephemeralKeyPair.derive(recipientKey.getPublic()).toString(16);

    // Derive key from shared secret
    const derivedKey = crypto.enc.Hex.parse(sharedSecret);

    // Encrypt the message
    const encryptedMessage = crypto.AES.encrypt(message, derivedKey).toString();

    // Return the encrypted message along with the ephemeral public key
    return JSON.stringify({ encryptedMessage, ephemeralPublicKey: ephemeralPublicKey.encode('hex') });
}

module.exports = { encryptMessage };