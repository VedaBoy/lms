// main.tsx or index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // Ensure you have a global CSS file for styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/lms">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
