// notificationService.js

const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Configuration for email and SMS services
const emailTransporter = nodemailer.createTransport({
    service: 'gmail', // Example service, replace with actual service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends notifications via email and SMS.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} message - The message to send.
 * @returns {Promise<string>} - The status of the notification.
 */
async function sendNotification(userId, message) {
    // Input validation
    if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid userId. It must be a non-empty string.');
    }
    if (!message || typeof message !== 'string') {
        throw new Error('Invalid message. It must be a non-empty string.');
    }

    try {
        // Fetch user details (mocked for this example)
        const user = await getUserDetails(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        // Send email notification
        await emailTransporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reminder',
            text: message
        });

        // Send SMS notification
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phoneNumber
        });

        return 'Notification sent successfully';
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification.');
    }
}

/**
 * Mock function to simulate fetching user details.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - User details including email and phone number.
 */
async function getUserDetails(userId) {
    // This should be replaced with actual database call
    return {
        email: 'user@example.com', // Placeholder email
        phoneNumber: '+1234567890' // Placeholder phone number
    };
}

module.exports = { sendNotification };