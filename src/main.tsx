
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import App from './App.tsx'
import './index.css'

// Make sure we have a valid DOM element before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}
