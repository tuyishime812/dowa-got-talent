import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './context/ToastContext'
import { MusicProvider } from './context/MusicContext'
import { registerServiceWorker } from './hooks/useServiceWorker'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

// Register service worker for PWA
registerServiceWorker()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <MusicProvider>
          <App />
        </MusicProvider>
      </ToastProvider>
    </ErrorBoundary>
  </StrictMode>,
)
