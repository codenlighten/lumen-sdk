// Import required dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express application and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// In-memory store for collaboration status
const collaborationStatus = {};

/**
 * Validates input parameters.
 * @param {string} documentId - The ID of the document.
 * @param {string} userId - The ID of the user.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
const validateInputs = (documentId, userId) => {
    return typeof documentId === 'string' && documentId.length > 0 &&
           typeof userId === 'string' && userId.length > 0;
};

/**
 * Handles user connection for real-time collaboration.
 * @param {Socket} socket - The socket connection for the user.
 */
const handleConnection = (socket) => {
    socket.on('join', ({ documentId, userId }) => {
        if (!validateInputs(documentId, userId)) {
            socket.emit('error', 'Invalid documentId or userId');
            return;
        }

        // Store user in collaboration status
        collaborationStatus[documentId] = collaborationStatus[documentId] || [];
        collaborationStatus[documentId].push(userId);

        socket.join(documentId);
        socket.emit('collaborationStatus', collaborationStatus[documentId]);
        socket.to(documentId).emit('userJoined', userId);
    });

    socket.on('edit', ({ documentId, userId, content }) => {
        if (!validateInputs(documentId, userId)) {
            socket.emit('error', 'Invalid documentId or userId');
            return;
        }

        // Broadcast the edit to all users in the document
        socket.to(documentId).emit('documentEdited', { userId, content });
    });

    socket.on('disconnect', () => {
        // Handle user disconnection
        for (const docId in collaborationStatus) {
            collaborationStatus[docId] = collaborationStatus[docId].filter(id => id !== socket.id);
            socket.to(docId).emit('userLeft', socket.id);
        }
    });
};

// Set up socket connection handler
io.on('connection', handleConnection);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/**
 * Unit tests for the RealTimeCollaboration module.
 */
// Note: For real testing, consider using a testing framework like Mocha or Jest.
const assert = require('assert');

describe('RealTimeCollaboration', () => {
    it('should validate inputs correctly', () => {
        assert.strictEqual(validateInputs('doc1', 'user1'), true);
        assert.strictEqual(validateInputs('', 'user1'), false);
        assert.strictEqual(validateInputs('doc1', ''), false);
    });

    // Additional tests can be added here for socket events
});