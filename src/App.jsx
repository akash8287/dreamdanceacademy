import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Classes from './pages/Classes'
import Instructors from './pages/Instructors'
import Schedule from './pages/Schedule'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Enrollment from './pages/Enrollment'
import PreAdmission from './pages/PreAdmission'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import StudentDashboard from './pages/StudentDashboard'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

// Public Route (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  if (isAuthenticated) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

// Layout with Navbar and Footer
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
)

// Dashboard Layout (no navbar/footer)
const DashboardLayout = ({ children }) => (
  <>{children}</>
)

function AppContent() {
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Pages with Navbar/Footer */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/classes" element={<MainLayout><Classes /></MainLayout>} />
          <Route path="/instructors" element={<MainLayout><Instructors /></MainLayout>} />
          <Route path="/schedule" element={<MainLayout><Schedule /></MainLayout>} />
          <Route path="/gallery" element={<MainLayout><Gallery /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/enrollment" element={<MainLayout><Enrollment /></MainLayout>} />
          <Route path="/apply" element={<MainLayout><PreAdmission /></MainLayout>} />

          {/* Auth Pages */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Admin Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Student Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <DashboardLayout>
                <StudentDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
