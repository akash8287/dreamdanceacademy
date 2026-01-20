import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dream-dance-academy-secret-key-2024'

// Verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  // Check header first, then query param (for file viewing in new tab)
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// Check if user is student
const isStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ error: 'Student access required' })
  }
  next()
}

// Check if user is accessing their own data or is admin
const isOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.userId || req.params.id)
  if (req.user.role !== 'admin' && req.user.id !== requestedUserId) {
    return res.status(403).json({ error: 'Access denied' })
  }
  next()
}

export {
  JWT_SECRET,
  authenticateToken,
  isAdmin,
  isStudent,
  isOwnerOrAdmin
}
