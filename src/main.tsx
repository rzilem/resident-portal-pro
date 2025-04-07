
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './globals.css';
import { initializeStorage } from './utils/storageInitializer';

// Initialize storage on app startup
initializeStorage().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
