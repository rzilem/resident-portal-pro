
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import Routes from './routes';
import DocumentStorageInitializer from './components/documents/DocumentStorageInitializer';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <DocumentStorageInitializer />
        <Routes />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
