import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRouter from './App';  // ✅ App.js로 바뀌었으니까 여기 경로도 App으로 수정
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

reportWebVitals();
