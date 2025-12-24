import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import App from './App.jsx';

const theme = createTheme();
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
          <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
