// vitest/config の defineConfig を使うと、ビルドとテストの設定を
// 1つのファイルにまとめられます。
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// base を相対パスにすることで、GitHub Pages のプロジェクトページ
// (https://<user>.github.io/<repo>/) でもそのまま動く。
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
