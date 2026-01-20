import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const user = await login(email, password)
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className="page login-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="login-container">
        <div className="login-visual">
          <div className="login-visual-content">
            <span className="visual-icon">✦</span>
            <h2>Welcome Back</h2>
            <p>Continue your dance journey with Dream Dance Academy</p>
            <div className="visual-features">
              <div className="feature">
                <span>🎭</span>
                <span>Access your classes</span>
              </div>
              <div className="feature">
                <span>📅</span>
                <span>View your schedule</span>
              </div>
              <div className="feature">
                <span>📚</span>
                <span>Manage documents</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-container">
          <motion.div 
            className="login-form-wrapper"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="form-header">
              <Link to="/" className="back-link">← Back to Home</Link>
              <h1>Sign In</h1>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="message message-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary login-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>

            <div className="demo-credentials">
              <p><strong>Demo Admin:</strong> admin@dreamdance.com / admin123</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
