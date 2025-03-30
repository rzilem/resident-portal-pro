
import React from 'react';
import { Toaster } from 'sonner';
import RouterConfig from './routes';
import DocumentStorageInitializer from './components/documents/DocumentStorageInitializer';
import { AuthProvider } from './contexts/auth/AuthProvider';
import { Outlet } from 'react-router-dom';

// This is the App shell that will be used as the root element in the router
function AppShell() {
  return (
    <div className="app">
      <DocumentStorageInitializer />
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
}

// Main App component that sets up providers and router
function App() {
  return (
    <AuthProvider>
      <RouterConfig rootElement={<AppShell />} />
    </AuthProvider>
  );
}

export default App;
