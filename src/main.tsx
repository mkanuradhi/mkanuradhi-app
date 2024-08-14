import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import i18n from './i18n';
import './index.scss'
import { I18nextProvider } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
