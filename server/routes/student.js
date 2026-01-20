import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import { db } from '../database.js'
import { authenticateToken, isStudent } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads', req.user.id.toString())
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX'))
    }
  }
})

// All routes require student authentication
router.use(authenticateToken, isStudent)

// Get student profile
router.get('/profile', (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, first_name, last_name, phone, date_of_birth, gender,
             address, city, state, zip_code, profile_image, created_at
      FROM users WHERE id = ?
    `).get(req.user.id)

    const details = db.prepare(`
      SELECT * FROM student_details WHERE user_id = ?
    `).get(req.user.id)

    res.json({ ...user, ...details })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update student profile
router.put('/profile', (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      goals,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      medicalConditions,
      allergies
    } = req.body

    // Update user info
    db.prepare(`
      UPDATE users SET
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        phone = COALESCE(?, phone),
        date_of_birth = COALESCE(?, date_of_birth),
        gender = COALESCE(?, gender),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        zip_code = COALESCE(?, zip_code),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(firstName, lastName, phone, dateOfBirth, gender, address, city, state, zipCode, req.user.id)

    // Update student details
    db.prepare(`
      UPDATE student_details SET
        goals = COALESCE(?, goals),
        emergency_name = COALESCE(?, emergency_name),
        emergency_phone = COALESCE(?, emergency_phone),
        emergency_relation = COALESCE(?, emergency_relation),
        medical_conditions = COALESCE(?, medical_conditions),
        allergies = COALESCE(?, allergies)
      WHERE user_id = ?
    `).run(goals, emergencyName, emergencyPhone, emergencyRelation, medicalConditions, allergies, req.user.id)

    res.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get student's schedule
router.get('/schedule', (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT * FROM student_schedules WHERE student_id = ? ORDER BY
        CASE day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        time_slot
    `).all(req.user.id)

    res.json(schedules)
  } catch (error) {
    console.error('Get schedule error:', error)
    res.status(500).json({ error: 'Failed to get schedule' })
  }
})

// Upload document
router.post('/documents', upload.single('document'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const { documentType } = req.body

    const result = db.prepare(`
      INSERT INTO documents (user_id, file_name, original_name, file_type, file_size, document_type)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size,
      documentType || 'other'
    )

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: result.lastInsertRowid,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        documentType: documentType || 'other'
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload document' })
  }
})

// Get student's documents
router.get('/documents', (req, res) => {
  try {
    const documents = db.prepare(`
      SELECT * FROM documents WHERE user_id = ? ORDER BY upload_date DESC
    `).all(req.user.id)

    res.json(documents)
  } catch (error) {
    console.error('Get documents error:', error)
    res.status(500).json({ error: 'Failed to get documents' })
  }
})

// Delete document
router.delete('/documents/:id', (req, res) => {
  try {
    // Get document info
    const document = db.prepare(`
      SELECT * FROM documents WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', req.user.id.toString(), document.file_name)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete from database
    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id)

    res.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Delete document error:', error)
    res.status(500).json({ error: 'Failed to delete document' })
  }
})

// Upload profile image
router.post('/profile-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }

    // Delete old profile image if exists
    const user = db.prepare('SELECT profile_image FROM users WHERE id = ?').get(req.user.id)
    if (user.profile_image) {
      const oldPath = path.join(__dirname, '../../uploads', req.user.id.toString(), user.profile_image)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    // Update database
    db.prepare('UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(req.file.filename, req.user.id)

    res.json({
      message: 'Profile image updated successfully',
      fileName: req.file.filename
    })
  } catch (error) {
    console.error('Upload profile image error:', error)
    res.status(500).json({ error: 'Failed to upload profile image' })
  }
})

// Get available classes
router.get('/classes', (req, res) => {
  try {
    const classes = db.prepare('SELECT * FROM dance_classes WHERE active = 1 ORDER BY name').all()
    res.json(classes)
  } catch (error) {
    console.error('Get classes error:', error)
    res.status(500).json({ error: 'Failed to get classes' })
  }
})

// View/Download document
router.get('/documents/:id/file', (req, res) => {
  try {
    const document = db.prepare(`
      SELECT * FROM documents WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const filePath = path.join(__dirname, '../../uploads', req.user.id.toString(), document.file_name)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    // Set content type based on file type
    res.setHeader('Content-Type', document.file_type)
    
    // Check if download is requested
    if (req.query.download === 'true') {
      res.setHeader('Content-Disposition', `attachment; filename="${document.original_name}"`)
    } else {
      res.setHeader('Content-Disposition', `inline; filename="${document.original_name}"`)
    }

    // Send the file
    res.sendFile(filePath)
  } catch (error) {
    console.error('Get document file error:', error)
    res.status(500).json({ error: 'Failed to get document' })
  }
})

export default router
