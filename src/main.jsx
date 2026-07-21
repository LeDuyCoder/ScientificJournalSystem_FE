/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: main.jsx
 */
import { StrictMode } from 'react'
import './shared/i18n/i18n'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { queryClient, localStoragePersister } from './shared/services/queryClient'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: localStoragePersister,
          maxAge: 1000 * 60 * 60 * 24, // 24h: cache cũ hơn mốc này sẽ bị bỏ qua
        }}
      >
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </PersistQueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
