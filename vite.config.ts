import { defineConfig } from 'vite'
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  // 깃허브용은 확인:  base: '/diagram-vite2/',
  base: './',
  build: {
    outDir: 'docs',
    sourcemap: false, // .map 파일생성 안하기(배포용)
    minify: 'esbuild', // false: 압축안함, terser: 엄청난 압축. consele.log drop안됨. 빌드느림
    // assetsInlineLimit: 512000, // 500KB (512,000 bytes) 미만의 자산은 Base64 문자열로 인라인화됨. 스크립트에 저장. 0으로 설정하면 아무리 작아도 별도 파일로 빌드됨
  },
  server: {
    port: 5173,
    open: true,
  },
  plugins: [
    // src 내부의 모든 ts, js 파일이 바뀌면 묻지도 따지지도 않고 새로고침!
    FullReload(['src/**/*.(ts|js|css)'])
  ],
})