import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// WEB_DEMO=1 일 때만 토스 전용 패키지를 브라우저용 스텁으로 교체한다.
// (등급분류 심의용 브라우저 데모 빌드 전용 — 토스 앱 빌드 `ait build`는 영향 없음)
const webDemo = process.env.WEB_DEMO === '1';

const stub = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    // 정확히 일치하는 bare import만 교체 ($ 앵커) — `@apps-in-toss/web-framework/config` 같은 서브패스는 보존
    alias: webDemo
      ? [
          { find: /^@toss\/tds-mobile$/, replacement: stub('./src/web-demo/stub-tds-mobile.tsx') },
          { find: /^@toss\/tds-mobile-ait$/, replacement: stub('./src/web-demo/stub-tds-mobile-ait.tsx') },
          { find: /^@apps-in-toss\/web-framework$/, replacement: stub('./src/web-demo/stub-apps-in-toss.ts') },
        ]
      : [],
  },
});