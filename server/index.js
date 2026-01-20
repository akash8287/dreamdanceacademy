import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

import { initDB } from './database.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import studentRoutes from './routes/student.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Initialize database
initDB()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dream Dance Academy API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' })
    }
    return res.status(400).json({ error: err.message })
  }
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════╗
  ║                                                        ║
  ║   🩰 Dream Dance Academy API Server                    ║
  ║                                                        ║
  ║   Server running on http://localhost:${PORT}             ║
  ║                                                        ║
  ║   Default Admin Login:                                 ║
  ║   Email: admin@dreamdance.com                          ║
  ║   Password: admin123                                   ║
  ║                                                        ║
  ╚════════════════════════════════════════════════════════╝
  `)
})

export default app
