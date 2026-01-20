import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database.js'
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Register new student
router.post('/register', async (req, res) => {
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
      // Student specific
      danceStyle,
      experienceLevel,
      preferredSchedule,
      goals,
      emergencyName,
      emergencyPhone,
      emergencyRelation,
      medicalConditions,
      allergies
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
      INSERT INTO student_details (user_id, dance_style, experience_level, preferred_schedule, goals, emergency_name, emergency_phone, emergency_relation, medical_conditions, allergies)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    insertDetails.run(
      result.lastInsertRowid,
      danceStyle || null, experienceLevel || null, preferredSchedule || null,
      goals || null, emergencyName || null, emergencyPhone || null,
      emergencyRelation || null, medicalConditions || null, allergies || null
    )

    // Generate token
    const token = jwt.sign(
      { id: result.lastInsertRowid, email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        role: 'student',
        firstName,
        lastName
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImage: user.profile_image
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT id, email, role, first_name, last_name, phone, date_of_birth, gender, 
             address, city, state, zip_code, profile_image, created_at
      FROM users WHERE id = ?
    `).get(req.user.id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    let studentDetails = null
    if (user.role === 'student') {
      studentDetails = db.prepare('SELECT * FROM student_details WHERE user_id = ?').get(user.id)
    }

    res.json({
      ...user,
      studentDetails
    })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update password
router.put('/password', authenticateToken, (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id)
    
    const validPassword = bcrypt.compareSync(currentPassword, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(hashedPassword, req.user.id)

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Password update error:', error)
    res.status(500).json({ error: 'Failed to update password' })
  }
})

export default router
