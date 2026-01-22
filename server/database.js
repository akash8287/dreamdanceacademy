import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Database(path.join(__dirname, 'dance_academy.db'))

// Generate unique student ID
const generateStudentId = (branchCode = 'DDA') => {
  const year = new Date().getFullYear().toString().slice(-2)
  const random = Math.floor(1000 + Math.random() * 9000)
  return `${branchCode}${year}${random}`
}

// Generate random password
const generatePassword = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase()
}

// Initialize database tables
const initDB = () => {
  // Branches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS branches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      phone TEXT,
      email TEXT,
      manager_name TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // OTP table for 2FA verification
  db.exec(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifier TEXT NOT NULL,
      otp_code TEXT NOT NULL,
      purpose TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Pre-admission applications (Trial & Full admission)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pre_admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_type TEXT NOT NULL CHECK(application_type IN ('trial', 'admission')),
      branch_id INTEGER,
      student_id TEXT UNIQUE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      age INTEGER,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      id_proof_type TEXT,
      id_proof_number TEXT,
      id_proof_document TEXT,
      dance_style TEXT,
      experience_level TEXT,
      parent_guardian_name TEXT,
      parent_guardian_phone TEXT,
      parent_guardian_relation TEXT,
      payment_amount REAL,
      payment_screenshot TEXT,
      payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'uploaded', 'verified', 'rejected')),
      application_status TEXT DEFAULT 'pending' CHECK(application_status IN ('pending', 'approved', 'rejected', 'trial_scheduled')),
      trial_class_date TEXT,
      trial_class_time TEXT,
      admin_notes TEXT,
      approved_by INTEGER,
      approved_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (branch_id) REFERENCES branches(id),
      FOREIGN KEY (approved_by) REFERENCES users(id)
    )
  `)

  // Users table (for both admin and students)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      date_of_birth TEXT,
      gender TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      profile_image TEXT,
      student_id TEXT UNIQUE,
      branch_id INTEGER,
      pre_admission_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (branch_id) REFERENCES branches(id),
      FOREIGN KEY (pre_admission_id) REFERENCES pre_admissions(id)
    )
  `)

  // Student specific details
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      dance_style TEXT,
      experience_level TEXT,
      preferred_schedule TEXT,
      goals TEXT,
      emergency_name TEXT,
      emergency_phone TEXT,
      emergency_relation TEXT,
      medical_conditions TEXT,
      allergies TEXT,
      parent_guardian_name TEXT,
      parent_guardian_phone TEXT,
      parent_guardian_email TEXT,
      parent_guardian_relation TEXT,
      qualification TEXT,
      id_proof_type TEXT,
      id_proof_number TEXT,
      enrollment_status TEXT DEFAULT 'pending',
      enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)
  
  // Add new columns if they don't exist (for existing databases)
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN parent_guardian_name TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN parent_guardian_phone TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN parent_guardian_email TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN parent_guardian_relation TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN qualification TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN id_proof_type TEXT`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE student_details ADD COLUMN id_proof_number TEXT`)
  } catch (e) {}

  // Student schedules (assigned by admin)
  db.exec(`
    CREATE TABLE IF NOT EXISTS student_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      day_of_week TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      class_name TEXT NOT NULL,
      instructor TEXT,
      studio TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Documents uploaded by students
  db.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      file_name TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER,
      document_type TEXT,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `)

  // Dance classes available
  db.exec(`
    CREATE TABLE IF NOT EXISTS dance_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      level TEXT,
      duration TEXT,
      description TEXT,
      instructor TEXT,
      schedule TEXT,
      price TEXT,
      max_students INTEGER DEFAULT 15,
      active INTEGER DEFAULT 1
    )
  `)

  // Add new columns to users table if they don't exist
  try {
    db.exec(`ALTER TABLE users ADD COLUMN student_id TEXT UNIQUE`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE users ADD COLUMN branch_id INTEGER REFERENCES branches(id)`)
  } catch (e) {}
  try {
    db.exec(`ALTER TABLE users ADD COLUMN pre_admission_id INTEGER REFERENCES pre_admissions(id)`)
  } catch (e) {}

  // Create default branch if not exists
  const branchExists = db.prepare('SELECT id FROM branches LIMIT 1').get()
  if (!branchExists) {
    db.prepare(`
      INSERT INTO branches (name, code, address, city, state, phone, email, manager_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Dream Dance Academy - Main Branch',
      'DDA',
      'Main Street, Downtown',
      'Mumbai',
      'Maharashtra',
      '+91 98765 43210',
      'main@dreamdanceacademy.in',
      'Admin'
    )
    console.log('Default branch created')
  }

  // Create default admin if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin')
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10)
    db.prepare(`
      INSERT INTO users (email, password, role, first_name, last_name, phone)
      VALUES (?, ?, 'admin', 'Admin', 'User', '+91 98765 43210')
    `).run('admin@dreamdance.com', hashedPassword)
    console.log('Default admin created: admin@dreamdance.com / admin123')
  }

  // Insert some default classes
  const classesExist = db.prepare('SELECT id FROM dance_classes LIMIT 1').get()
  if (!classesExist) {
    const classes = [
      ['Classical Ballet', 'classical', 'All Levels', '60-90 min', 'Master the foundations of dance with classical ballet.', 'Maria Santos', 'Mon, Wed, Fri', '$120/month', 15],
      ['Contemporary', 'modern', 'Intermediate+', '75 min', 'Express yourself through fluid, emotional movement.', 'Elena Volkov', 'Tue, Thu, Sat', '$110/month', 15],
      ['Hip Hop', 'urban', 'All Levels', '60 min', 'Learn the latest street dance styles and techniques.', 'James Rivera', 'Mon, Wed, Sat', '$100/month', 20],
      ['Jazz Dance', 'modern', 'All Levels', '60 min', 'Energetic and theatrical jazz dance.', 'Sarah Kim', 'Tue, Thu', '$100/month', 15],
      ['Kathak', 'classical', 'All Levels', '90 min', 'Traditional Indian classical dance storytelling.', 'Priya Nair', 'Sat, Sun', '$130/month', 12],
      ['Salsa & Latin', 'social', 'All Levels', '60 min', 'Hot Latin rhythms and partner dance.', 'Carlos Mendez', 'Fri, Sun', '$90/month', 20],
      ['Kids Dance', 'kids', 'Ages 4-12', '45-60 min', 'Fun, age-appropriate dance classes for children.', 'Lisa Thompson', 'Sat morning', '$80/month', 15],
      ['Bollywood Fusion', 'social', 'All Levels', '60 min', 'High-energy Bollywood choreography.', 'Raj Patel', 'Wed, Sat', '$95/month', 20]
    ]
    
    const insertClass = db.prepare(`
      INSERT INTO dance_classes (name, category, level, duration, description, instructor, schedule, price, max_students)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    classes.forEach(c => insertClass.run(...c))
    console.log('Default classes created')
  }

  console.log('Database initialized successfully')
}

export { db, initDB, generateStudentId, generatePassword }
