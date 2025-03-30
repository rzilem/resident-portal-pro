
import React from 'react';
import { Toaster } from 'sonner';
import DocumentStorageInitializer from './components/documents/DocumentStorageInitializer';
import { AuthProvider } from './contexts/auth/AuthProvider';
import RouterConfig from './routes';

// App component that sets up providers and router
function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <div className="app">
          <DocumentStorageInitializer />
          <RouterConfig />
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
