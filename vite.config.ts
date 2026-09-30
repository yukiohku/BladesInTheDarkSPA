import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base を相対パスにすることで、GitHub Pages のプロジェクトページ
// (https://<user>.github.io/<repo>/) でもそのまま動く。
export default defineConfig({
  base: './',
  plugins: [react()],
})
