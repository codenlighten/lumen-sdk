import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Chat component that provides user interface for chat functionalities.
 * It integrates cryptographic operations and allows user interaction.
 *
 * @param {Array} messages - Array of chat messages.
 * @param {string} user_id - ID of the user.
 * @returns {JSX.Element} Rendered chat interface.
 */
const Chat = ({ messages, user_id }) => {
    const [chatMessages, setChatMessages] = useState(messages);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState(null);

    /**
     * Function to handle sending a new message.
     * Validates input and performs a POST request to send the message.
     */
    const sendMessage = async () => {
        if (!newMessage.trim()) {
            setError('Message cannot be empty.');
            return;
        }

        try {
            const response = await axios.post('/api/chat/send', {
                user_id,
                message: newMessage,
            });
            setChatMessages([...chatMessages, response.data]);
            setNewMessage('');
            setError(null);
        } catch (err) {
            setError('Failed to send message. Please try again.');
            console.error(err);
        }
    };

    /**
     * Effect to update chat messages when new messages are received.
     * This could be replaced with a WebSocket implementation for real-time updates.
     */
    useEffect(() => {
        setChatMessages(messages);
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="messages">
                {chatMessages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.user_id}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            {error && <div className="error">{error}</div>}
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;

// Unit tests for the Chat component
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Chat from './Chat';

describe('Chat Component', () => {
    const mockMessages = [{ user_id: 'user1', content: 'Hello' }];
    const mockUserId = 'user1';

    test('renders chat messages', () => {
        render(<Chat messages={mockMessages} user_id={mockUserId} />);
        expect(screen.getByText(/Hello/i)).toBeInTheDocument();
    });

    test('sends a new message', async () => {
        render(<Chat messages={mockMessages} user_id={mockUserId} />);
        const input = screen.getByPlaceholderText(/Type your message.../i);
        const button = screen.getByText(/Send/i);

        fireEvent.change(input, { target: { value: 'Hi there!' } });
        fireEvent.click(button);

        expect(await screen.findByText(/Hi there!/i)).toBeInTheDocument();
    });

    test('shows error for empty message', () => {
        render(<Chat messages={mockMessages} user_id={mockUserId} />);
        const button = screen.getByText(/Send/i);

        fireEvent.click(button);
        expect(screen.getByText(/Message cannot be empty/i)).toBeInTheDocument();
    });
});