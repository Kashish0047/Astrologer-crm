import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
          <Toaster 
            position="top-right" 
            toastOptions={{
              className: '!bg-surface-card !text-white !border !border-white/10 !shadow-2xl',
              style: {
                background: '#1a1a2e',
                color: '#f8fafc',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
