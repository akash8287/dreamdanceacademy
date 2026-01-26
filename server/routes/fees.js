import express from 'express'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { db } from '../database.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure multer for payment screenshots
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/payments')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.id}-${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPEG and PNG images allowed'))
    }
  }
})

// Certificate types with order
const CERTIFICATE_TYPES = [
  { type: 'd_certificate', name: 'D Certificate', order: 1 },
  { type: 'd_basic', name: 'D-Basic Certificate', order: 2 },
  { type: 'd_character', name: 'D-Character Certificate', order: 3 },
  { type: 'd_advanced', name: 'D-Advanced Certificate', order: 4 },
  { type: 'dance_teacher', name: 'Dance Teacher Certificate', order: 5 }
]

// Helper: Calculate penalty
const calculatePenalty = (dueDate, paymentDate = new Date()) => {
  const due = new Date(dueDate)
  const payment = new Date(paymentDate)
  const diffTime = payment - due
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Grace period of 2 days
  if (diffDays <= 2) return { daysLate: 0, penalty: 0 }
  
  const daysLate = diffDays - 2
  const penalty = daysLate * 50 // ₹50 per day
  return { daysLate, penalty }
}

// Helper: Generate certificate number
const generateCertificateNumber = (type) => {
  const prefix = type.toUpperCase().replace('_', '')
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `DDA-${prefix}-${year}-${random}`
}

// ==================== STUDENT FEE ROUTES ====================

// Get student's fee history
router.get('/my-fees', authenticateToken, (req, res) => {
  try {
    const fees = db.prepare(`
      SELECT fp.*, 
             u.first_name || ' ' || u.last_name as verified_by_name
      FROM fee_payments fp
      LEFT JOIN users u ON fp.verified_by = u.id
      WHERE fp.user_id = ?
      ORDER BY fp.year DESC, 
        CASE fp.month
          WHEN 'January' THEN 1 WHEN 'February' THEN 2 WHEN 'March' THEN 3
          WHEN 'April' THEN 4 WHEN 'May' THEN 5 WHEN 'June' THEN 6
          WHEN 'July' THEN 7 WHEN 'August' THEN 8 WHEN 'September' THEN 9
          WHEN 'October' THEN 10 WHEN 'November' THEN 11 WHEN 'December' THEN 12
        END DESC
    `).all(req.user.id)

    // Get student's monthly fee
    const studentDetails = db.prepare(`
      SELECT monthly_fee FROM student_details WHERE user_id = ?
    `).get(req.user.id)

    // Get current pending fee
    const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
    const currentYear = new Date().getFullYear()
    
    let currentFee = db.prepare(`
      SELECT * FROM fee_payments WHERE user_id = ? AND month = ? AND year = ?
    `).get(req.user.id, currentMonth, currentYear)

    // If no fee record for current month, create one
    if (!currentFee) {
      const dueDate = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-05` // Due on 5th
      const baseAmount = studentDetails?.monthly_fee || 2000
      
      db.prepare(`
        INSERT INTO fee_payments (user_id, month, year, base_amount, total_amount, due_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(req.user.id, currentMonth, currentYear, baseAmount, baseAmount, dueDate)
      
      currentFee = db.prepare(`
        SELECT * FROM fee_payments WHERE user_id = ? AND month = ? AND year = ?
      `).get(req.user.id, currentMonth, currentYear)
    }

    // Calculate current penalty if unpaid
    if (currentFee && currentFee.status === 'pending') {
      const { daysLate, penalty } = calculatePenalty(currentFee.due_date)
      currentFee.days_late = daysLate
      currentFee.penalty_amount = penalty
      currentFee.total_amount = currentFee.base_amount + penalty
    }

    res.json({
      fees,
      currentFee,
      monthlyFee: studentDetails?.monthly_fee || 2000
    })
  } catch (error) {
    console.error('Get fees error:', error)
    res.status(500).json({ error: 'Failed to get fee details' })
  }
})

// Upload payment screenshot
router.post('/pay', authenticateToken, upload.single('screenshot'), (req, res) => {
  try {
    const { month, year } = req.body
    
    if (!req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required' })
    }

    // Get fee record
    let fee = db.prepare(`
      SELECT * FROM fee_payments WHERE user_id = ? AND month = ? AND year = ?
    `).get(req.user.id, month, parseInt(year))

    if (!fee) {
      return res.status(404).json({ error: 'Fee record not found' })
    }

    // Calculate penalty at time of payment
    const { daysLate, penalty } = calculatePenalty(fee.due_date)
    const totalAmount = fee.base_amount + penalty

    // Update fee record
    db.prepare(`
      UPDATE fee_payments SET
        payment_screenshot = ?,
        payment_date = CURRENT_TIMESTAMP,
        days_late = ?,
        penalty_amount = ?,
        total_amount = ?,
        status = 'uploaded'
      WHERE id = ?
    `).run(req.file.filename, daysLate, penalty, totalAmount, fee.id)

    res.json({
      success: true,
      message: 'Payment screenshot uploaded. Pending admin verification.',
      daysLate,
      penalty,
      totalAmount
    })
  } catch (error) {
    console.error('Pay fee error:', error)
    res.status(500).json({ error: 'Failed to process payment' })
  }
})

// ==================== STUDENT CERTIFICATE ROUTES ====================

// Get student's certificates
router.get('/my-certificates', authenticateToken, (req, res) => {
  try {
    const certificates = db.prepare(`
      SELECT c.*, u.first_name || ' ' || u.last_name as approved_by_name
      FROM certificates c
      LEFT JOIN users u ON c.approved_by = u.id
      WHERE c.user_id = ?
      ORDER BY c.certificate_order ASC
    `).all(req.user.id)

    // Check if student is eligible for certificates (enrolled > 1 year)
    const enrollment = db.prepare(`
      SELECT enrollment_date FROM student_details WHERE user_id = ?
    `).get(req.user.id)

    let isEligible = false
    let enrollmentDuration = 0
    
    if (enrollment?.enrollment_date) {
      const enrollDate = new Date(enrollment.enrollment_date)
      const now = new Date()
      enrollmentDuration = Math.floor((now - enrollDate) / (1000 * 60 * 60 * 24 * 365))
      isEligible = enrollmentDuration >= 1
    }

    // Find next available certificate
    const approvedCerts = certificates.filter(c => c.status === 'approved')
    const pendingCert = certificates.find(c => c.status === 'pending')
    
    let nextAvailableCert = null
    if (!pendingCert) {
      const maxOrder = Math.max(0, ...approvedCerts.map(c => c.certificate_order))
      nextAvailableCert = CERTIFICATE_TYPES.find(t => t.order === maxOrder + 1)
    }

    res.json({
      certificates,
      isEligible,
      enrollmentDuration,
      nextAvailableCert,
      allCertificateTypes: CERTIFICATE_TYPES,
      hasPendingApplication: !!pendingCert
    })
  } catch (error) {
    console.error('Get certificates error:', error)
    res.status(500).json({ error: 'Failed to get certificates' })
  }
})

// Apply for certificate
router.post('/apply-certificate', authenticateToken, (req, res) => {
  try {
    const { certificateType } = req.body

    // Validate certificate type
    const certInfo = CERTIFICATE_TYPES.find(c => c.type === certificateType)
    if (!certInfo) {
      return res.status(400).json({ error: 'Invalid certificate type' })
    }

    // Check eligibility (enrolled > 1 year)
    const enrollment = db.prepare(`
      SELECT enrollment_date FROM student_details WHERE user_id = ?
    `).get(req.user.id)

    if (!enrollment?.enrollment_date) {
      return res.status(400).json({ error: 'Student enrollment details not found' })
    }

    const enrollDate = new Date(enrollment.enrollment_date)
    const now = new Date()
    const yearsEnrolled = (now - enrollDate) / (1000 * 60 * 60 * 24 * 365)
    
    if (yearsEnrolled < 1) {
      return res.status(400).json({ error: 'You must be enrolled for at least 1 year to apply for certificates' })
    }

    // Check for pending applications
    const pendingCert = db.prepare(`
      SELECT * FROM certificates WHERE user_id = ? AND status = 'pending'
    `).get(req.user.id)

    if (pendingCert) {
      return res.status(400).json({ error: 'You already have a pending certificate application' })
    }

    // Get approved certificates
    const approvedCerts = db.prepare(`
      SELECT * FROM certificates WHERE user_id = ? AND status = 'approved'
      ORDER BY certificate_order ASC
    `).all(req.user.id)

    const maxApprovedOrder = Math.max(0, ...approvedCerts.map(c => c.certificate_order))

    // Check if applying in order
    if (certInfo.order > maxApprovedOrder + 1) {
      // Applying for advanced certificate - delete all previous certificates
      if (certInfo.order > 1) {
        db.prepare(`DELETE FROM certificates WHERE user_id = ?`).run(req.user.id)
      }
    } else if (certInfo.order <= maxApprovedOrder) {
      return res.status(400).json({ error: 'You already have this certificate or a higher level certificate' })
    }

    // Create certificate application
    db.prepare(`
      INSERT INTO certificates (user_id, certificate_type, certificate_order)
      VALUES (?, ?, ?)
    `).run(req.user.id, certificateType, certInfo.order)

    res.json({
      success: true,
      message: `Application for ${certInfo.name} submitted successfully`
    })
  } catch (error) {
    console.error('Apply certificate error:', error)
    res.status(500).json({ error: 'Failed to apply for certificate' })
  }
})

// ==================== ADMIN FEE ROUTES ====================

// Get all students' fees
router.get('/all-fees', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status, month, year } = req.query
    
    let query = `
      SELECT fp.*, 
             u.first_name, u.last_name, u.email, u.student_id,
             v.first_name || ' ' || v.last_name as verified_by_name
      FROM fee_payments fp
      JOIN users u ON fp.user_id = u.id
      LEFT JOIN users v ON fp.verified_by = v.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND fp.status = ?'
      params.push(status)
    }
    if (month) {
      query += ' AND fp.month = ?'
      params.push(month)
    }
    if (year) {
      query += ' AND fp.year = ?'
      params.push(parseInt(year))
    }

    query += ' ORDER BY fp.created_at DESC'

    const fees = db.prepare(query).all(...params)
    res.json(fees)
  } catch (error) {
    console.error('Get all fees error:', error)
    res.status(500).json({ error: 'Failed to get fees' })
  }
})

// View payment screenshot
router.get('/payment-screenshot/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const fee = db.prepare('SELECT payment_screenshot FROM fee_payments WHERE id = ?').get(req.params.id)
    
    if (!fee?.payment_screenshot) {
      return res.status(404).json({ error: 'Screenshot not found' })
    }

    const filePath = path.join(__dirname, '../../uploads/payments', fee.payment_screenshot)
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' })
    }

    res.sendFile(filePath)
  } catch (error) {
    console.error('Get screenshot error:', error)
    res.status(500).json({ error: 'Failed to get screenshot' })
  }
})

// Verify/Reject payment (Admin)
router.post('/verify-payment/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status, adminNotes } = req.body // status: 'verified', 'rejected', 'paid' (for cash)
    const validStatuses = ['verified', 'rejected', 'paid']
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    db.prepare(`
      UPDATE fee_payments SET
        status = ?,
        verified_by = ?,
        verified_at = CURRENT_TIMESTAMP,
        admin_notes = COALESCE(?, admin_notes)
      WHERE id = ?
    `).run(status, req.user.id, adminNotes, req.params.id)

    res.json({ success: true, message: `Payment ${status}` })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
})

// Mark cash payment as paid (Admin)
router.post('/cash-payment/:userId', authenticateToken, isAdmin, (req, res) => {
  try {
    const { month, year, amount, adminNotes } = req.body
    
    // Check if fee record exists
    let fee = db.prepare(`
      SELECT * FROM fee_payments WHERE user_id = ? AND month = ? AND year = ?
    `).get(req.params.userId, month, parseInt(year))

    if (fee) {
      // Update existing record
      db.prepare(`
        UPDATE fee_payments SET
          payment_method = 'cash',
          total_amount = ?,
          status = 'paid',
          payment_date = CURRENT_TIMESTAMP,
          verified_by = ?,
          verified_at = CURRENT_TIMESTAMP,
          admin_notes = ?
        WHERE id = ?
      `).run(amount || fee.total_amount, req.user.id, adminNotes, fee.id)
    } else {
      // Create new record
      const dueDate = `${year}-${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}-05`
      
      db.prepare(`
        INSERT INTO fee_payments (user_id, month, year, base_amount, total_amount, due_date, payment_method, status, payment_date, verified_by, verified_at, admin_notes)
        VALUES (?, ?, ?, ?, ?, ?, 'cash', 'paid', CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, ?)
      `).run(req.params.userId, month, parseInt(year), amount, amount, dueDate, req.user.id, adminNotes)
    }

    res.json({ success: true, message: 'Cash payment recorded' })
  } catch (error) {
    console.error('Cash payment error:', error)
    res.status(500).json({ error: 'Failed to record cash payment' })
  }
})

// Generate fee for all students for a month
router.post('/generate-fees', authenticateToken, isAdmin, (req, res) => {
  try {
    const { month, year } = req.body
    
    // Get all active students
    const students = db.prepare(`
      SELECT u.id, sd.monthly_fee
      FROM users u
      JOIN student_details sd ON u.id = sd.user_id
      WHERE u.role = 'student' AND sd.enrollment_status = 'active'
    `).all()

    const dueDate = `${year}-${String(new Date(`${month} 1, ${year}`).getMonth() + 1).padStart(2, '0')}-05`
    
    let generated = 0
    const insert = db.prepare(`
      INSERT OR IGNORE INTO fee_payments (user_id, month, year, base_amount, total_amount, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    students.forEach(student => {
      const fee = student.monthly_fee || 2000
      const result = insert.run(student.id, month, parseInt(year), fee, fee, dueDate)
      if (result.changes > 0) generated++
    })

    res.json({ success: true, message: `Generated fees for ${generated} students` })
  } catch (error) {
    console.error('Generate fees error:', error)
    res.status(500).json({ error: 'Failed to generate fees' })
  }
})

// ==================== ADMIN CERTIFICATE ROUTES ====================

// Get all certificate applications
router.get('/all-certificates', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status } = req.query
    
    let query = `
      SELECT c.*, 
             u.first_name, u.last_name, u.email, u.student_id,
             a.first_name || ' ' || a.last_name as approved_by_name
      FROM certificates c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN users a ON c.approved_by = a.id
      WHERE 1=1
    `
    const params = []

    if (status) {
      query += ' AND c.status = ?'
      params.push(status)
    }

    query += ' ORDER BY c.application_date DESC'

    const certificates = db.prepare(query).all(...params)
    
    // Add certificate name
    const result = certificates.map(cert => ({
      ...cert,
      certificate_name: CERTIFICATE_TYPES.find(t => t.type === cert.certificate_type)?.name
    }))

    res.json(result)
  } catch (error) {
    console.error('Get all certificates error:', error)
    res.status(500).json({ error: 'Failed to get certificates' })
  }
})

// Approve/Reject certificate
router.post('/certificate-action/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { action, adminNotes } = req.body // action: 'approved', 'rejected'
    
    if (!['approved', 'rejected'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' })
    }

    const cert = db.prepare('SELECT * FROM certificates WHERE id = ?').get(req.params.id)
    
    if (!cert) {
      return res.status(404).json({ error: 'Certificate not found' })
    }

    let certificateNumber = null
    let issueDate = null
    
    if (action === 'approved') {
      certificateNumber = generateCertificateNumber(cert.certificate_type)
      issueDate = new Date().toISOString()
    }

    db.prepare(`
      UPDATE certificates SET
        status = ?,
        approved_by = ?,
        approved_at = CURRENT_TIMESTAMP,
        certificate_number = ?,
        issue_date = ?,
        admin_notes = ?
      WHERE id = ?
    `).run(action, req.user.id, certificateNumber, issueDate, adminNotes, req.params.id)

    res.json({
      success: true,
      message: `Certificate ${action}`,
      certificateNumber
    })
  } catch (error) {
    console.error('Certificate action error:', error)
    res.status(500).json({ error: 'Failed to process certificate' })
  }
})

// ==================== MEETING BOOKING ROUTES ====================

// Book meeting (Public)
router.post('/book-meeting', async (req, res) => {
  try {
    const { name, email, phone, purpose, preferredDate, preferredTime } = req.body

    if (!name || !email || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    db.prepare(`
      INSERT INTO meeting_bookings (name, email, phone, purpose, preferred_date, preferred_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(name, email, phone, purpose, preferredDate, preferredTime)

    res.json({
      success: true,
      message: 'Meeting request submitted. We will confirm your appointment soon.'
    })
  } catch (error) {
    console.error('Book meeting error:', error)
    res.status(500).json({ error: 'Failed to book meeting' })
  }
})

// Get all meetings (Admin)
router.get('/meetings', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status } = req.query
    
    let query = 'SELECT * FROM meeting_bookings WHERE 1=1'
    const params = []

    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }

    query += ' ORDER BY preferred_date ASC, preferred_time ASC'

    const meetings = db.prepare(query).all(...params)
    res.json(meetings)
  } catch (error) {
    console.error('Get meetings error:', error)
    res.status(500).json({ error: 'Failed to get meetings' })
  }
})

// Update meeting status (Admin)
router.post('/meeting-action/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    const { status, adminNotes } = req.body
    
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    db.prepare(`
      UPDATE meeting_bookings SET status = ?, admin_notes = ? WHERE id = ?
    `).run(status, adminNotes, req.params.id)

    res.json({ success: true, message: `Meeting ${status}` })
  } catch (error) {
    console.error('Meeting action error:', error)
    res.status(500).json({ error: 'Failed to update meeting' })
  }
})

export default router
