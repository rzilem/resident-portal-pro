
import React from 'react';
import { Toaster } from 'sonner';
import RouterConfig from './routes';
import DocumentStorageInitializer from './components/documents/DocumentStorageInitializer';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { Outlet } from 'react-router-dom';

// App component that sets up providers and router
function App() {
  return (
    <AuthProvider>
      <div className="app">
        <DocumentStorageInitializer />
        <RouterConfig />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
