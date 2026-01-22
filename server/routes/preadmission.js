import express from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { db, generateStudentId, generatePassword } from '../database.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/preadmission')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF allowed.'))
    }
  }
})

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// ==================== OTP ROUTES ====================

// Send OTP for verification
router.post('/send-otp', async (req, res) => {
  try {
    const { identifier, purpose } = req.body // identifier can be email or phone

    if (!identifier || !purpose) {
      return res.status(400).json({ error: 'Identifier and purpose are required' })
    }

    // Delete any existing unused OTPs for this identifier
    db.prepare('DELETE FROM otp_codes WHERE identifier = ? AND purpose = ? AND verified = 0').run(identifier, purpose)

    // Generate new OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

    // Save OTP to database
    db.prepare(`
      INSERT INTO otp_codes (identifier, otp_code, purpose, expires_at)
      VALUES (?, ?, ?, ?)
    `).run(identifier, otp, purpose, expiresAt)

    // In production, send OTP via SMS/Email
    // For now, we'll return it (in production, remove this)
    console.log(`OTP for ${identifier}: ${otp}`)

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Remove otp in production - only for testing
      otp: otp 
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({ error: 'Failed to send OTP' })
  }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { identifier, otp, purpose } = req.body

    if (!identifier || !otp || !purpose) {
      return res.status(400).json({ error: 'Identifier, OTP and purpose are required' })
    }

    const otpRecord = db.prepare(`
      SELECT * FROM otp_codes 
      WHERE identifier = ? AND otp_code = ? AND purpose = ? AND verified = 0
      ORDER BY created_at DESC LIMIT 1
    `).get(identifier, otp, purpose)

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid OTP' })
    }

    // Check if OTP is expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({ error: 'OTP has expired' })
    }

    // Mark OTP as verified
    db.prepare('UPDATE otp_codes SET verified = 1 WHERE id = ?').run(otpRecord.id)

    res.json({ success: true, message: 'OTP verified successfully' })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ error: 'Failed to verify OTP' })
  }
})

// ==================== BRANCHES ROUTES ====================

// Get all branches (public)
router.get('/branches', (req, res) => {
  try {
    const branches = db.prepare('SELECT * FROM branches WHERE is_active = 1').all()
    res.json(branches)
  } catch (error) {
    console.error('Get branches error:', error)
    res.status(500).json({ error: 'Failed to get branches' })
  }
})

// Admin: Add new branch
router.post('/branches', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, code, address, city, state, phone, email, managerName } = req.body

    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' })
    }

    const result = db.prepare(`
      INSERT INTO branches (name, code, address, city, state, phone, email, manager_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, code.toUpperCase(), address, city, state, phone, email, managerName)

    res.status(201).json({ 
      message: 'Branch created successfully',
      branchId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Create branch error:', error)
    res.status(500).json({ error: 'Failed to create branch' })
  }
})

// Admin: Update branch
router.put('/branches/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { name, code, address, city, state, phone, email, managerName, isActive } = req.body

    db.prepare(`
      UPDATE branches SET 
        name = COALESCE(?, name),
        code = COALESCE(?, code),
        address = COALESCE(?, address),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        phone = COALESCE(?, phone),
        email = COALESCE(?, email),
        manager_name = COALESCE(?, manager_name),
        is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(name, code?.toUpperCase(), address, city, state, phone, email, managerName, isActive, req.params.id)

    res.json({ message: 'Branch updated successfully' })
  } catch (error) {
    console.error('Update branch error:', error)
    res.status(500).json({ error: 'Failed to update branch' })
  }
})

// ==================== PRE-ADMISSION ROUTES ====================

// Submit trial application
router.post('/trial-application', upload.single('idProofDocument'), async (req, res) => {
  try {
    const {
      branchId, firstName, lastName, age, phone, email, address, city, state, zipCode,
      idProofType, idProofNumber, danceStyle, experienceLevel,
      parentGuardianName, parentGuardianPhone, parentGuardianRelation
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !phone || !email) {
      return res.status(400).json({ error: 'First name, last name, phone and email are required' })
    }

    // Check if email or phone already has pending application
    const existing = db.prepare(`
      SELECT id FROM pre_admissions 
      WHERE (email = ? OR phone = ?) AND application_status = 'pending'
    `).get(email, phone)

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending application' })
    }

    const idProofDocument = req.file ? req.file.filename : null

    const result = db.prepare(`
      INSERT INTO pre_admissions (
        application_type, branch_id, first_name, last_name, age, phone, email,
        address, city, state, zip_code, id_proof_type, id_proof_number, id_proof_document,
        dance_style, experience_level, parent_guardian_name, parent_guardian_phone, parent_guardian_relation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'trial', branchId || 1, firstName, lastName, age, phone, email,
      address, city, state, zipCode, idProofType, idProofNumber, idProofDocument,
      danceStyle, experienceLevel, parentGuardianName, parentGuardianPhone, parentGuardianRelation
    )

    res.status(201).json({
      success: true,
      message: 'Trial application submitted successfully. We will contact you shortly.',
      applicationId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Trial application error:', error)
    res.status(500).json({ error: 'Failed to submit trial application' })
  }
})

// Submit pre-admission application (full admission)
router.post('/admission-application', upload.fields([
  { name: 'idProofDocument', maxCount: 1 },
  { name: 'paymentScreenshot', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      branchId, firstName, lastName, age, phone, email, address, city, state, zipCode,
      idProofType, idProofNumber, danceStyle, experienceLevel,
      parentGuardianName, parentGuardianPhone, parentGuardianRelation, paymentAmount
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !idProofType) {
      return res.status(400).json({ error: 'All required fields must be filled' })
    }

    // Check if email or phone already has pending application
    const existing = db.prepare(`
      SELECT id FROM pre_admissions 
      WHERE (email = ? OR phone = ?) AND application_status = 'pending'
    `).get(email, phone)

    if (existing) {
      return res.status(400).json({ error: 'You already have a pending application' })
    }

    const idProofDocument = req.files?.idProofDocument?.[0]?.filename || null
    const paymentScreenshot = req.files?.paymentScreenshot?.[0]?.filename || null

    const result = db.prepare(`
      INSERT INTO pre_admissions (
        application_type, branch_id, first_name, last_name, age, phone, email,
        address, city, state, zip_code, id_proof_type, id_proof_number, id_proof_document,
        dance_style, experience_level, parent_guardian_name, parent_guardian_phone, parent_guardian_relation,
        payment_amount, payment_screenshot, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'admission', branchId || 1, firstName, lastName, age, phone, email,
      address, city, state, zipCode, idProofType, idProofNumber, idProofDocument,
      danceStyle, experienceLevel, parentGuardianName, parentGuardianPhone, parentGuardianRelation,
      paymentAmount, paymentScreenshot, paymentScreenshot ? 'uploaded' : 'pending'
    )

    res.status(201).json({
      success: true,
      message: 'Admission application submitted successfully. Please wait for admin approval.',
      applicationId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Admission application error:', error)
    res.status(500).json({ error: 'Failed to submit admission application' })
  }
})

// Upload payment screenshot (for existing application)
router.post('/upload-payment/:applicationId', upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { applicationId } = req.params

    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' })
    }

    db.prepare(`
      UPDATE pre_admissions 
      SET payment_screenshot = ?, payment_status = 'uploaded', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(req.file.filename, applicationId)

    res.json({ success: true, message: 'Payment screenshot uploaded successfully' })
  } catch (error) {
    console.error('Upload payment error:', error)
    res.status(500).json({ error: 'Failed to upload payment screenshot' })
  }
})

// Check application status
router.get('/application-status/:email', async (req, res) => {
  try {
    const application = db.prepare(`
      SELECT id, application_type, application_status, payment_status, 
             trial_class_date, trial_class_time, created_at
      FROM pre_admissions 
      WHERE email = ? 
      ORDER BY created_at DESC LIMIT 1
    `).get(req.params.email)

    if (!application) {
      return res.status(404).json({ error: 'No application found' })
    }

    res.json(application)
  } catch (error) {
    console.error('Get application status error:', error)
    res.status(500).json({ error: 'Failed to get application status' })
  }
})

// ==================== ADMIN PRE-ADMISSION MANAGEMENT ====================

// Get all pre-admission applications
router.get('/applications', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status, type } = req.query
    
    let query = `
      SELECT pa.*, b.name as branch_name, b.code as branch_code
      FROM pre_admissions pa
      LEFT JOIN branches b ON pa.branch_id = b.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND pa.application_status = ?'
      params.push(status)
    }
    if (type) {
      query += ' AND pa.application_type = ?'
      params.push(type)
    }

    query += ' ORDER BY pa.created_at DESC'

    const applications = db.prepare(query).all(...params)
    res.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ error: 'Failed to get applications' })
  }
})

// Get single application details
router.get('/applications/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const application = db.prepare(`
      SELECT pa.*, b.name as branch_name, b.code as branch_code
      FROM pre_admissions pa
      LEFT JOIN branches b ON pa.branch_id = b.id
      WHERE pa.id = ?
    `).get(req.params.id)

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    res.json(application)
  } catch (error) {
    console.error('Get application error:', error)
    res.status(500).json({ error: 'Failed to get application' })
  }
})

// View/Download application document
router.get('/applications/:id/document/:type', authenticateToken, isAdmin, (req, res) => {
  try {
    const { id, type } = req.params
    const application = db.prepare('SELECT * FROM pre_admissions WHERE id = ?').get(id)

    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    let filename
    if (type === 'idproof') {
      filename = application.id_proof_document
    } else if (type === 'payment') {
      filename = application.payment_screenshot
    }

    if (!filename) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const filePath = path.join(__dirname, '../../uploads/preadmission', filename)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error('Get document error:', error)
    res.status(500).json({ error: 'Failed to get document' })
  }
})

// Approve trial application (schedule trial class)
router.post('/applications/:id/approve-trial', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { trialClassDate, trialClassTime, adminNotes } = req.body
    const applicationId = req.params.id

    const application = db.prepare('SELECT * FROM pre_admissions WHERE id = ?').get(applicationId)
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    db.prepare(`
      UPDATE pre_admissions 
      SET application_status = 'trial_scheduled', 
          trial_class_date = ?, 
          trial_class_time = ?,
          admin_notes = ?,
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(trialClassDate, trialClassTime, adminNotes, req.user.id, applicationId)

    // TODO: Send email with trial class details

    res.json({ 
      success: true, 
      message: 'Trial class scheduled successfully',
      trialDate: trialClassDate,
      trialTime: trialClassTime
    })
  } catch (error) {
    console.error('Approve trial error:', error)
    res.status(500).json({ error: 'Failed to approve trial' })
  }
})

// Approve full admission (create student account)
router.post('/applications/:id/approve-admission', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { adminNotes } = req.body
    const applicationId = req.params.id

    const application = db.prepare('SELECT * FROM pre_admissions WHERE id = ?').get(applicationId)
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' })
    }

    if (application.application_type === 'admission' && application.payment_status !== 'uploaded') {
      return res.status(400).json({ error: 'Payment screenshot not uploaded' })
    }

    // Get branch code for student ID generation
    const branch = db.prepare('SELECT code FROM branches WHERE id = ?').get(application.branch_id || 1)
    const branchCode = branch?.code || 'DDA'

    // Generate student ID and password
    const studentId = generateStudentId(branchCode)
    const tempPassword = generatePassword()
    const hashedPassword = bcrypt.hashSync(tempPassword, 10)

    // Create user account
    const userResult = db.prepare(`
      INSERT INTO users (
        email, password, role, first_name, last_name, phone, 
        address, city, state, zip_code, student_id, branch_id, pre_admission_id
      ) VALUES (?, ?, 'student', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      application.email, hashedPassword, application.first_name, application.last_name,
      application.phone, application.address, application.city, application.state,
      application.zip_code, studentId, application.branch_id || 1, applicationId
    )

    // Create student details
    db.prepare(`
      INSERT INTO student_details (
        user_id, dance_style, experience_level, 
        parent_guardian_name, parent_guardian_phone, parent_guardian_relation,
        id_proof_type, id_proof_number, enrollment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
    `).run(
      userResult.lastInsertRowid, application.dance_style, application.experience_level,
      application.parent_guardian_name, application.parent_guardian_phone, application.parent_guardian_relation,
      application.id_proof_type, application.id_proof_number
    )

    // Update pre-admission record
    db.prepare(`
      UPDATE pre_admissions 
      SET application_status = 'approved',
          payment_status = 'verified',
          student_id = ?,
          admin_notes = ?,
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(studentId, adminNotes, req.user.id, applicationId)

    // TODO: Send email with login credentials

    res.json({
      success: true,
      message: 'Admission approved successfully',
      studentId,
      email: application.email,
      tempPassword // In production, only send via email
    })
  } catch (error) {
    console.error('Approve admission error:', error)
    res.status(500).json({ error: 'Failed to approve admission' })
  }
})

// Reject application
router.post('/applications/:id/reject', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { adminNotes } = req.body
    const applicationId = req.params.id

    db.prepare(`
      UPDATE pre_admissions 
      SET application_status = 'rejected',
          admin_notes = ?,
          approved_by = ?,
          approved_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(adminNotes, req.user.id, applicationId)

    res.json({ success: true, message: 'Application rejected' })
  } catch (error) {
    console.error('Reject application error:', error)
    res.status(500).json({ error: 'Failed to reject application' })
  }
})

// Verify payment
router.post('/applications/:id/verify-payment', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body // 'verified' or 'rejected'
    
    db.prepare(`
      UPDATE pre_admissions 
      SET payment_status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, req.params.id)

    res.json({ success: true, message: `Payment ${status}` })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

export default router
