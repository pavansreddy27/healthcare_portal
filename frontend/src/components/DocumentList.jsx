import React, { useEffect, useState } from 'react';
import { getDocuments, deleteDocument, getDownloadUrl } from '../services/api';
import { FileText, Download, Trash2, Calendar, HardDrive } from 'lucide-react';

const DocumentList = ({ refreshTrigger }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await getDocuments();
            setDocuments(response.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to load documents.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [refreshTrigger]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            await deleteDocument(id);
            fetchDocuments(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to delete document.');
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading && documents.length === 0) {
        return <div className="text-center py-10 text-slate-500">Loading documents...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Your Documents
                </h2>
            </div>

            {documents.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No documents uploaded yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Size</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {documents.map((doc) => (
                                <tr key={doc.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <span className="font-medium text-slate-700">{doc.filename}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(doc.created_at)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-500 text-sm">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-3 h-3" />
                                            {formatSize(doc.filesize)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <a
                                                href={getDownloadUrl(doc.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DocumentList;
