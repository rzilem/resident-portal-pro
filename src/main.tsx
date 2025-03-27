
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './styles/theme.css'
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/auth/AuthProvider'

// Apply theme class to body for more visible theming
document.body.classList.add('theme-applied');

// Make sure we have a valid DOM element before rendering
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
