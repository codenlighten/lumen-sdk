import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

/**
 * DocumentUploader component handles file uploads and processes documents using OCR technology.
 * It validates file formats and interacts with the backend to store documents securely.
 *
 * @param {Object} props - Component props
 * @param {string} props.userId - The ID of the user uploading the document
 * @returns {JSX.Element} The DocumentUploader component
 */
const DocumentUploader = ({ userId }) => {
    const [uploadStatus, setUploadStatus] = useState('');
    const [extractedText, setExtractedText] = useState('');

    const onDrop = async (acceptedFiles) => {
        // Validate file type
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const isValidFile = acceptedFiles.every(file => validTypes.includes(file.type));

        if (!isValidFile) {
            setUploadStatus('Invalid file type. Please upload a PDF, JPEG, or PNG.');
            return;
        }

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file);
        });
        formData.append('userId', userId);

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadStatus('Upload successful!');
            setExtractedText(response.data.extractedText);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('Upload failed. Please try again.');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {'application/pdf': [], 'image/jpeg': [], 'image/png': []}
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed #0070f3', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            <p>{uploadStatus}</p>
            {extractedText && <div><h3>Extracted Text:</h3><p>{extractedText}</p></div>}
        </div>
    );
};

export default DocumentUploader;

/**
 * Unit tests for DocumentUploader component
 */
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentUploader from './DocumentUploader';
import axios from 'axios';

jest.mock('axios');

describe('DocumentUploader', () => {
    it('renders correctly', () => {
        render(<DocumentUploader userId="123" />);
        expect(screen.getByText(/Drag 'n' drop some files here/i)).toBeInTheDocument();
    });

    it('handles file upload successfully', async () => {
        axios.post.mockResolvedValueOnce({ data: { extractedText: 'Sample text' } });
        render(<DocumentUploader userId="123" />);

        const input = screen.getByLabelText(/Drag 'n' drop some files here/i);
        fireEvent.drop(input, {
            dataTransfer: {
                files: [new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })]
            }
        });

        expect(await screen.findByText(/Upload successful/i)).toBeInTheDocument();
        expect(screen.getByText(/Extracted Text:/i)).toBeInTheDocument();
    });

    it('handles invalid file type', async () => {
        render(<DocumentUploader userId="123" />);
        const input = screen.getByLabelText(/Drag 'n' drop some files here/i);
        fireEvent.drop(input, {
            dataTransfer: {
                files: [new File(['dummy content'], 'test.txt', { type: 'text/plain' })]
            }
        });

        expect(await screen.findByText(/Invalid file type/i)).toBeInTheDocument();
    });
});