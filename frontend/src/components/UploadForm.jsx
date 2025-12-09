import React, { useState } from 'react';
import { uploadDocument } from '../services/api';
import { Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed.');
                setFile(null);
                setMessage(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
            setMessage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await uploadDocument(file);
            setMessage('File uploaded successfully!');
            setFile(null);
            // Reset file input
            e.target.reset();
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to upload file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Upload Document
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition-all duration-200
              cursor-pointer"
                    />
                    <button
                        type="submit"
                        disabled={!file || loading}
                        className={`px-6 py-2.5 rounded-full font-medium text-white transition-all duration-200 shadow-md ${!file || loading
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95'
                            }`}
                    >
                        {loading ? 'Uploading...' : 'Upload PDF'}
                    </button>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {message && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadForm;
