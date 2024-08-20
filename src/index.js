// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';

// Define your custom MUI theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFF00',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
});

// Create the root element for React 18
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
