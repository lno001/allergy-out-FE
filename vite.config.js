import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// preview.html(컴포넌트 갤러리)은 프로덕션에는 안 실려도 되지만,
// 개발 중 팀원들이 npm run build로도 확인할 수 있게 입력에 포함해둠.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        preview: resolve(__dirname, 'preview.html'),
      },
    },
  },
});
