import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './contexts/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// FIX: Extracted the component tree into a variable before rendering.
// This can sometimes resolve complex type inference issues in the TS compiler/language server
// which may be causing the incorrect "children is missing" error.
const app = (
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

root.render(app);