// DocumentAnalyzer.js

const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require('openai');

// MongoDB schema for storing document analysis results
const analysisSchema = new mongoose.Schema({
    documentId: { type: String, required: true },
    userId: { type: String, required: true },
    analysisResults: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

// OpenAI configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Analyzes the document using GPT-4 and extracts key clauses, obligations, risks, and deadlines.
 * @param {string} documentId - The ID of the document to analyze.
 * @param {string} userId - The ID of the user requesting the analysis.
 * @returns {Promise<Object>} - The analysis results including a risk score.
 * @throws {Error} - Throws an error if the analysis fails or if inputs are invalid.
 */
async function analyzeDocument(documentId, userId) {
    // Input validation
    if (!documentId || !userId) {
        throw new Error('Invalid input: documentId and userId are required.');
    }

    try {
        // Call to OpenAI API to analyze the document
        const response = await openai.createChatCompletion({
            model: 'gpt-4',
            messages: [{ role: 'user', content: `Analyze the document with ID ${documentId} and extract key clauses, obligations, risks, and deadlines.` }],
        });

        const analysisResults = response.data.choices[0].message.content;

        // Save results to the database
        const analysis = new Analysis({ documentId, userId, analysisResults });
        await analysis.save();

        return analysisResults;
    } catch (error) {
        console.error('Error analyzing document:', error);
        throw new Error('Failed to analyze document. Please try again later.');
    }
}

module.exports = { analyzeDocument };