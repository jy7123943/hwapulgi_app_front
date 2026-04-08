import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global } from '@emotion/react';
import { colors } from '@toss/tds-colors';
import { TDSMobileProvider } from '@toss/tds-mobile';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppStateProvider } from './state/AppState';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TDSMobileProvider
      resetGlobalCss
      userAgent={{
        fontA11y: undefined,
        fontScale: 1,
        isAndroid: false,
        isIOS: true,
        colorPreference: 'light',
        safeAreaBottomTransparency: 'opaque',
      }}
    >
      <Global
        styles={{
          ':root': {
            fontFamily: '"SUIT Variable", "Pretendard Variable", "Apple SD Gothic Neo", sans-serif',
            color: colors.grey900,
            fontWeight: 500,
          },
          '*': {
            boxSizing: 'border-box',
          },
          'html, body, #root': {
            minHeight: '100%',
            margin: 0,
          },
          body: {
            minHeight: '100vh',
          },
          'button, input': {
            font: 'inherit',
          },
          button: {
            border: 0,
            cursor: 'pointer',
            outline: 'transparent',
          },
          'button:focus, button:focus-visible': {
            outline: 'transparent',
            boxShadow: 'none',
          },
        }}
      />
      <BrowserRouter>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </BrowserRouter>
    </TDSMobileProvider>
  </React.StrictMode>,
);
