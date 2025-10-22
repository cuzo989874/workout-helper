import React from 'react';
import { createRoot } from 'react-dom/client';

// init i18n
import './i18n.ts';

import App from './App.tsx';

import './styles/main.scss';

createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
