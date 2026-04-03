import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'hwapulgi-app',
  brand: {
    displayName: '화풀기',
    primaryColor: '#c74a32',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  webViewProps: {
    bounces: false,
    pullToRefreshEnabled: false,
    allowsBackForwardNavigationGestures: false,
    overScrollMode: 'never',
    mediaPlaybackRequiresUserAction: false,
  },
});
