import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
      <App />
    </SnackbarProvider>
  </BrowserRouter>
);