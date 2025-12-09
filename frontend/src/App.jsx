import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import { LayoutDashboard } from 'lucide-react';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            Patient Portal
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">My Health Documents</h2>
          <p className="text-slate-500">Manage your prescriptions, test results, and reports securely.</p>
        </div>

        <UploadForm onUploadSuccess={handleUploadSuccess} />
        <DocumentList refreshTrigger={refreshTrigger} />
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Healthcare Portal. Secure & Private.</p>
      </footer>
    </div>
  );
}

export default App;
