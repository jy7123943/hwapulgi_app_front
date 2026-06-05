import React from 'react';
import ReactDOM from 'react-dom/client';
import { TDSMobileAITProvider } from '@toss/tds-mobile-ait';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import config from '../granite.config.ts';
import App from './App';
import { AppStateProvider } from './state/AppState';
import { createQueryClient } from './lib/queries/client';
import { ensureAuth } from './lib/api/auth';
import './index.css';

const queryClient = createQueryClient();

// 앱 부팅 시점 게스트 인증 보장 (실패하면 화면 진입 시 API 호출이 재시도)
ensureAuth().catch((err) => {
  console.error('[auth] 게스트 로그인 실패:', err);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TDSMobileAITProvider brandPrimaryColor={config.brand.primaryColor}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppStateProvider>
            <App />
            <Toaster position="top-center" />
          </AppStateProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </TDSMobileAITProvider>
  </React.StrictMode>,
);