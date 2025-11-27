// messageStoreForward.js

const mongoose = require('mongoose');

// Define the schema for storing messages
const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    delivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Create a model based on the schema
const Message = mongoose.model('Message', messageSchema);

/**
 * MessageStoreForward class to handle storing and forwarding messages.
 */
class MessageStoreForward {
    /**
     * Stores a message for an offline user.
     * @param {string} message - The message to store.
     * @param {string} recipientId - The ID of the recipient.
     * @returns {Promise<string>} - Delivery status of the message.
     */
    async storeMessage(message, recipientId) {
        // Input validation
        if (typeof message !== 'string' || typeof recipientId !== 'string') {
            throw new Error('Invalid input: message and recipientId must be strings.');
        }

        try {
            const newMessage = new Message({ message, recipientId });
            await newMessage.save();
            return 'Message stored successfully.';
        } catch (error) {
            console.error('Error storing message:', error);
            throw new Error('Failed to store message.');
        }
    }

    /**
     * Forwards messages to the recipient when they reconnect.
     * @param {string} recipientId - The ID of the recipient.
     * @returns {Promise<string>} - Delivery status of the forwarded messages.
     */
    async forwardMessages(recipientId) {
        try {
            const messages = await Message.find({ recipientId, delivered: false });
            // Logic to send messages to the recipient goes here.
            // For example, using a messaging service.

            // Mark messages as delivered
            await Message.updateMany({ recipientId, delivered: false }, { delivered: true });
            return `Forwarded ${messages.length} messages.`;
        } catch (error) {
            console.error('Error forwarding messages:', error);
            throw new Error('Failed to forward messages.');
        }
    }
}

module.exports = MessageStoreForward;

// tests/messageStoreForward.test.js
const mongoose = require('mongoose');
const MessageStoreForward = require('../messageStoreForward');

describe('MessageStoreForward', () => {
    let messageStore;

    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
        messageStore = new MessageStoreForward();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should store a message', async () => {
        const status = await messageStore.storeMessage('Hello', '60d5ec49f1b2c8b1d4e2e2e2');
        expect(status).toBe('Message stored successfully.');
    });

    test('should forward messages', async () => {
        await messageStore.storeMessage('Hello again', '60d5ec49f1b2c8b1d4e2e2e2');
        const status = await messageStore.forwardMessages('60d5ec49f1b2c8b1d4e2e2e2');
        expect(status).toMatch(/Forwarded \d+ messages./);
    });
});