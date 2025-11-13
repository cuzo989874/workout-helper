import React from 'react';
import { createRoot } from 'react-dom/client';

// init i18n
import './i18n.ts';

import App from './App.tsx';

import './styles/main.scss';

const initializeTheme = () => {
  try {
    const stored = localStorage.getItem('app_theme');
    const theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (error) {
    console.error('Error initializing theme:', error);
    document.documentElement.setAttribute('data-theme', 'light');
  }
};

initializeTheme();

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
