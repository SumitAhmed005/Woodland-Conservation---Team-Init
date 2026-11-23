/**
 * ================================================================================
 * File: main.jsx
 * Author: ADM (Abhishek Darsh Manar) 2025 Fall - Software Engineering (CSCI-3428-1)
 *  * Modified by: Sumit Ahmed (Team Init) 2026 Fall 
 * - Wrapped App in LanguageProvider
 * Description: Application entry point that renders the root React component
 * into the DOM with StrictMode enabled for development warnings.
 * ================================================================================
 */

import { LanguageProvider } from "./locales/LanguageContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
