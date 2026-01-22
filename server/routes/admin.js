import express from 'express'
import bcrypt from 'bcryptjs'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { db } from '../database.js'
import { authenticateToken, isAdmin } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// All routes require admin authentication
router.use(authenticateToken, isAdmin)

// Get all students
router.get('/students', (req, res) => {
  try {
    const students = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.date_of_birth, 
             u.created_at, u.profile_image,
             sd.dance_style, sd.experience_level, sd.enrollment_status, sd.enrollment_date
      FROM users u
      LEFT JOIN student_details sd ON u.id = sd.user_id
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC
    `).all()

    res.json(students)
  } catch (error) {
    console.error('Get students error:', error)
    res.status(500).json({ error: 'Failed to get students' })
  }
})

// Get single student with full details
router.get('/students/:id', (req, res) => {
  try {
    const student = db.prepare(`
      SELECT u.id as user_id, u.email, u.first_name, u.last_name, u.phone, u.date_of_birth,
             u.gender, u.address, u.city, u.state, u.zip_code, u.profile_image,
             u.created_at, u.updated_at,
             sd.id as detail_id, sd.dance_style, sd.experience_level, sd.preferred_schedule,
             sd.goals, sd.emergency_name, sd.emergency_phone, sd.emergency_relation,
             sd.medical_conditions, sd.allergies, sd.enrollment_status, sd.enrollment_date
      FROM users u
      LEFT JOIN student_details sd ON u.id = sd.user_id
      WHERE u.id = ? AND u.role = 'student'
    `).get(req.params.id)

    if (!student) {
      return res.status(404).json({ error: 'Student not found' })
    }

    // Get student's schedules
    const schedules = db.prepare(`
      SELECT * FROM student_schedules WHERE student_id = ?
    `).all(req.params.id)

    // Get student's documents
    const documents = db.prepare(`
      SELECT * FROM documents WHERE user_id = ?
    `).all(req.params.id)

    res.json({
      id: student.user_id,
      ...student,
      schedules,
      documents
    })
  } catch (error) {
    console.error('Get student error:', error)
    res.status(500).json({ error: 'Failed to get student' })
  }
})

// Add new student (by admin)
router.post('/students', (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      danceStyle,
      experienceLevel,
      preferredSchedule,
      goals,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      enrollmentStatus
    } = req.body

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required' })
    }

    // Check if email already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10)

    // Insert user
    const insertUser = db.prepare(`
      INSERT INTO users (email, password, role, first_name, last_name, phone, date_of_birth, gender, address, city, state, zip_code)
      VALUES (?, ?, 'student', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = insertUser.run(
      email, hashedPassword, firstName, lastName, phone || null,
      dateOfBirth || null, gender || null, address || null,
      city || null, state || null, zipCode || null
    )

    // Insert student details
    const insertDetails = db.prepare(`
      INSERT INTO student_details (user_id, dance_style, experience_level, preferred_schedule, goals, emergency_name, emergency_phone, emergency_relation, enrollment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insertDetails.run(
      result.lastInsertRowid,
      danceStyle || null, experienceLevel || null, preferredSchedule || null,
      goals || null, emergencyName || null, emergencyPhone || null,
      emergencyRelation || null, enrollmentStatus || 'active'
    )

    res.status(201).json({
      message: 'Student added successfully',
      studentId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Add student error:', error)
    res.status(500).json({ error: 'Failed to add student' })
  }
})

// Update student
router.put('/students/:id', (req, res) => {
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
      danceStyle,
      experienceLevel,
      preferredSchedule,
      goals,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      enrollmentStatus
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
      WHERE id = ? AND role = 'student'
    `).run(firstName, lastName, phone, dateOfBirth, gender, address, city, state, zipCode, req.params.id)

    // Update student details
    db.prepare(`
      UPDATE student_details SET
        dance_style = COALESCE(?, dance_style),
        experience_level = COALESCE(?, experience_level),
        preferred_schedule = COALESCE(?, preferred_schedule),
        goals = COALESCE(?, goals),
        emergency_name = COALESCE(?, emergency_name),
        emergency_phone = COALESCE(?, emergency_phone),
        emergency_relation = COALESCE(?, emergency_relation),
        enrollment_status = COALESCE(?, enrollment_status)
      WHERE user_id = ?
    `).run(danceStyle, experienceLevel, preferredSchedule, goals, emergencyName, emergencyPhone, emergencyRelation, enrollmentStatus, req.params.id)

    res.json({ message: 'Student updated successfully' })
  } catch (error) {
    console.error('Update student error:', error)
    res.status(500).json({ error: 'Failed to update student' })
  }
})

// Delete student
router.delete('/students/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM users WHERE id = ? AND role = ?').run(req.params.id, 'student')
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Delete student error:', error)
    res.status(500).json({ error: 'Failed to delete student' })
  }
})

// Get student schedules
router.get('/students/:id/schedules', (req, res) => {
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
    `).all(req.params.id)

    res.json(schedules)
  } catch (error) {
    console.error('Get schedules error:', error)
    res.status(500).json({ error: 'Failed to get schedules' })
  }
})

// Add schedule for student
router.post('/students/:id/schedules', (req, res) => {
  try {
    const { dayOfWeek, timeSlot, className, instructor, studio, notes } = req.body

    if (!dayOfWeek || !timeSlot || !className) {
      return res.status(400).json({ error: 'Day, time, and class name are required' })
    }

    const result = db.prepare(`
      INSERT INTO student_schedules (student_id, day_of_week, time_slot, class_name, instructor, studio, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(req.params.id, dayOfWeek, timeSlot, className, instructor || null, studio || null, notes || null)

    res.status(201).json({
      message: 'Schedule added successfully',
      scheduleId: result.lastInsertRowid
    })
  } catch (error) {
    console.error('Add schedule error:', error)
    res.status(500).json({ error: 'Failed to add schedule' })
  }
})

// Update schedule
router.put('/schedules/:id', (req, res) => {
  try {
    const { dayOfWeek, timeSlot, className, instructor, studio, notes } = req.body

    db.prepare(`
      UPDATE student_schedules SET
        day_of_week = COALESCE(?, day_of_week),
        time_slot = COALESCE(?, time_slot),
        class_name = COALESCE(?, class_name),
        instructor = COALESCE(?, instructor),
        studio = COALESCE(?, studio),
        notes = COALESCE(?, notes)
      WHERE id = ?
    `).run(dayOfWeek, timeSlot, className, instructor, studio, notes, req.params.id)

    res.json({ message: 'Schedule updated successfully' })
  } catch (error) {
    console.error('Update schedule error:', error)
    res.status(500).json({ error: 'Failed to update schedule' })
  }
})

// Delete schedule
router.delete('/schedules/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM student_schedules WHERE id = ?').run(req.params.id)
    res.json({ message: 'Schedule deleted successfully' })
  } catch (error) {
    console.error('Delete schedule error:', error)
    res.status(500).json({ error: 'Failed to delete schedule' })
  }
})

// Get all dance classes
router.get('/classes', (req, res) => {
  try {
    const classes = db.prepare('SELECT * FROM dance_classes ORDER BY name').all()
    res.json(classes)
  } catch (error) {
    console.error('Get classes error:', error)
    res.status(500).json({ error: 'Failed to get classes' })
  }
})

// Get all schedules with student info
router.get('/schedules', (req, res) => {
  try {
    const schedules = db.prepare(`
      SELECT ss.*, u.first_name, u.last_name, u.email
      FROM student_schedules ss
      JOIN users u ON ss.student_id = u.id
      ORDER BY 
        CASE ss.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        ss.time_slot
    `).all()
    res.json(schedules)
  } catch (error) {
    console.error('Get all schedules error:', error)
    res.status(500).json({ error: 'Failed to get schedules' })
  }
})

// Dashboard stats
router.get('/stats', (req, res) => {
  try {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('student').count
    const activeStudents = db.prepare(`
      SELECT COUNT(*) as count FROM users u 
      JOIN student_details sd ON u.id = sd.user_id 
      WHERE u.role = 'student' AND sd.enrollment_status = 'active'
    `).get().count
    const pendingEnrollments = db.prepare(`
      SELECT COUNT(*) as count FROM student_details WHERE enrollment_status = 'pending'
    `).get().count
    const totalClasses = db.prepare('SELECT COUNT(*) as count FROM dance_classes WHERE active = 1').get().count

    res.json({
      totalStudents,
      activeStudents,
      pendingEnrollments,
      totalClasses
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// View/Download student document (Admin only)
router.get('/documents/:id/file', (req, res) => {
  try {
    const document = db.prepare(`
      SELECT * FROM documents WHERE id = ?
    `).get(req.params.id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const filePath = path.join(__dirname, '../../uploads', document.user_id.toString(), document.file_name)
    
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

// Delete student document (Admin only)
router.delete('/documents/:id', (req, res) => {
  try {
    // Get document info
    const document = db.prepare(`
      SELECT * FROM documents WHERE id = ?
    `).get(req.params.id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', document.user_id.toString(), document.file_name)
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

export default router
