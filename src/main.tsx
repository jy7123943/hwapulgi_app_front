import React from 'react';
import ReactDOM from 'react-dom/client';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { BrowserRouter } from 'react-router-dom';
import config from '../granite.config.ts';
import App from './App';
import { AppStateProvider } from './state/AppState';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TDSMobileAITProvider brandPrimaryColor={config.brand.primaryColor}>
      <BrowserRouter>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </BrowserRouter>
    </TDSMobileAITProvider>
  </React.StrictMode>,
);
