import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Fix for TS2580: Cannot find name 'process'
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Maps process.env.API_KEY to the VITE_API_KEY environment variable
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  }
})