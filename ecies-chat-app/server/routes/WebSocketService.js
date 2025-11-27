const WebSocket = require('ws');

/**
 * WebSocketService class to handle real-time messaging through WebSocket.
 */
class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Map();

        this.wss.on('connection', (ws, req) => {
            const userId = req.headers['user-id'];
            if (!userId) {
                ws.close();
                return;
            }
            this.clients.set(userId, ws);
            ws.on('message', (message) => this.handleMessage(message, userId));
            ws.on('close', () => this.clients.delete(userId));
        });
    }

    /**
     * Handles incoming messages and broadcasts them to the appropriate user.
     * @param {string} message - The message to be sent.
     * @param {string} userId - The ID of the user sending the message.
     */
    handleMessage(message, userId) {
        try {
            const parsedMessage = JSON.parse(message);
            const targetUserId = parsedMessage.user_id;
            const msgContent = parsedMessage.message;

            // Validate input
            if (!targetUserId || !msgContent) {
                throw new Error('Invalid message format');
            }

            const recipient = this.clients.get(targetUserId);
            if (recipient && recipient.readyState === WebSocket.OPEN) {
                recipient.send(JSON.stringify({ message: msgContent, from: userId }));
                return { message_status: 'delivered' };
            } else {
                throw new Error('Recipient not connected');
            }
        } catch (error) {
            console.error('Error handling message:', error);
            return { message_status: 'failed', error: error.message };
        }
    }
}

module.exports = WebSocketService;

// Example usage:
// const http = require('http');
// const server = http.createServer();
// const WebSocketService = require('./WebSocketService');
// const wsService = new WebSocketService(server);
// server.listen(3000, () => console.log('Server is listening on port 3000'));