import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastProvider } from './components/toasts/toast.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ToastProvider>
    <App />
  </ToastProvider>
);

reportWebVitals();
