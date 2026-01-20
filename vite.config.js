import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dreamdanceacademy/',
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.tunnelmole.net',
      'rzu2jb-ip-202-160-133-130.tunnelmole.net'
    ]
  }
})
