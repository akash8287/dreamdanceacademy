import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { adminAPI, preadmissionAPI, feesAPI } from '../services/api'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [allSchedules, setAllSchedules] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Pre-admission states
  const [applications, setApplications] = useState([])
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [applicationFilter, setApplicationFilter] = useState('pending')
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [approvalForm, setApprovalForm] = useState({
    trialClassDate: '',
    trialClassTime: '',
    adminNotes: ''
  })

  // Fees management states
  const [allFees, setAllFees] = useState([])
  const [feeFilter, setFeeFilter] = useState('uploaded')
  const [showCashPaymentModal, setShowCashPaymentModal] = useState(false)
  const [cashPaymentForm, setCashPaymentForm] = useState({
    userId: null,
    month: new Date().toLocaleString('en-US', { month: 'long' }),
    year: new Date().getFullYear(),
    amount: 2000,
    adminNotes: ''
  })

  // Certificates management states
  const [allCertificates, setAllCertificates] = useState([])
  const [certFilter, setCertFilter] = useState('pending')

  // Meetings management states
  const [meetings, setMeetings] = useState([])
  const [meetingFilter, setMeetingFilter] = useState('pending')

  // Form states
  const [studentForm, setStudentForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
    danceStyle: '', experienceLevel: '', enrollmentStatus: 'active'
  })
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: '', timeSlot: '', className: '', instructor: '', studio: '', notes: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [statsData, studentsData, schedulesData] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getStudents(),
        adminAPI.getAllSchedules()
      ])
      setStats(statsData)
      setStudents(studentsData)
      setAllSchedules(schedulesData)
      // Load applications
      loadApplications()
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadApplications = async (status = applicationFilter) => {
    try {
      const data = await preadmissionAPI.getApplications(status)
      setApplications(data)
    } catch (err) {
      console.error('Failed to load applications:', err)
    }
  }

  const handleViewApplication = async (app) => {
    try {
      const data = await preadmissionAPI.getApplication(app.id)
      setSelectedApplication(data)
    } catch (err) {
      setError('Failed to load application details')
    }
  }

  const handleApproveTrial = async () => {
    try {
      await preadmissionAPI.approveTrial(
        selectedApplication.id, 
        approvalForm.trialClassDate,
        approvalForm.trialClassTime,
        approvalForm.adminNotes
      )
      setSuccess('Trial class scheduled! Email will be sent to the applicant.')
      setShowApprovalModal(false)
      setSelectedApplication(null)
      loadApplications()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleApproveAdmission = async () => {
    try {
      const result = await preadmissionAPI.approveAdmission(selectedApplication.id, approvalForm.adminNotes)
      setSuccess(`Admission approved! Student ID: ${result.studentId}. Login credentials will be sent via email.`)
      setShowApprovalModal(false)
      setSelectedApplication(null)
      loadApplications()
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRejectApplication = async () => {
    if (!confirm('Are you sure you want to reject this application?')) return
    try {
      await preadmissionAPI.rejectApplication(selectedApplication.id, approvalForm.adminNotes)
      setSuccess('Application rejected')
      setSelectedApplication(null)
      loadApplications()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleVerifyPayment = async (status) => {
    try {
      await preadmissionAPI.verifyPayment(selectedApplication.id, status)
      setSuccess(`Payment ${status}`)
      handleViewApplication(selectedApplication)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.addStudent(studentForm)
      setSuccess('Student added successfully')
      setShowAddModal(false)
      setStudentForm({ email: '', password: '', firstName: '', lastName: '', phone: '', danceStyle: '', experienceLevel: '', enrollmentStatus: 'active' })
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteStudent = async (id) => {
    if (!confirm('Are you sure you want to delete this student?')) return
    try {
      await adminAPI.deleteStudent(id)
      setSuccess('Student deleted successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handlePauseStudent = async (id) => {
    const reason = prompt('Enter reason for pausing (optional):')
    try {
      await adminAPI.pauseStudent(id, reason || 'Discontinued')
      setSuccess('Student profile paused successfully')
      loadData()
      if (selectedStudent?.id === id) {
        handleViewStudent({ id })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUnpauseStudent = async (id) => {
    if (!confirm('Are you sure you want to reactivate this student?')) return
    try {
      await adminAPI.unpauseStudent(id)
      setSuccess('Student profile reactivated successfully')
      loadData()
      if (selectedStudent?.id === id) {
        handleViewStudent({ id })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleViewStudent = async (student) => {
    try {
      const fullStudent = await adminAPI.getStudent(student.id)
      setSelectedStudent(fullStudent)
    } catch (err) {
      setError('Failed to load student details')
    }
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()
    try {
      if (editingSchedule) {
        await adminAPI.updateSchedule(editingSchedule.id, scheduleForm)
        setSuccess('Schedule updated successfully')
      } else {
        await adminAPI.addSchedule(selectedStudent.id, scheduleForm)
        setSuccess('Schedule added successfully')
      }
      setShowScheduleModal(false)
      setEditingSchedule(null)
      setScheduleForm({ dayOfWeek: '', timeSlot: '', className: '', instructor: '', studio: '', notes: '' })
      if (selectedStudent) {
        handleViewStudent(selectedStudent)
      }
      loadData() // Refresh all data including schedules list
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule)
    setScheduleForm({
      dayOfWeek: schedule.day_of_week,
      timeSlot: schedule.time_slot,
      className: schedule.class_name,
      instructor: schedule.instructor || '',
      studio: schedule.studio || '',
      notes: schedule.notes || ''
    })
    setShowScheduleModal(true)
  }

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await adminAPI.deleteSchedule(scheduleId)
      setSuccess('Schedule deleted')
      if (selectedStudent) {
        handleViewStudent(selectedStudent)
      }
      loadData() // Refresh all data
    } catch (err) {
      setError(err.message)
    }
  }

  const openAddScheduleModal = () => {
    setEditingSchedule(null)
    setScheduleForm({ dayOfWeek: '', timeSlot: '', className: '', instructor: '', studio: '', notes: '' })
    setShowScheduleModal(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleViewDocument = (id) => {
    adminAPI.viewDocument(id)
  }

  const handleDownloadDocument = async (id, fileName) => {
    try {
      await adminAPI.downloadDocument(id, fileName)
      setSuccess('Document downloaded')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await adminAPI.deleteDocument(id)
      setSuccess('Document deleted')
      if (selectedStudent) {
        handleViewStudent(selectedStudent)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  // Fees management functions
  const loadFees = async (status = feeFilter) => {
    try {
      const data = await feesAPI.getAllFees(status)
      setAllFees(data)
    } catch (err) {
      console.error('Failed to load fees:', err)
    }
  }

  const handleVerifyFeePayment = async (feeId, status) => {
    try {
      await feesAPI.verifyPayment(feeId, status)
      setSuccess(`Payment ${status === 'verified' ? 'verified' : status}`)
      loadFees()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRecordCashPayment = async (e) => {
    e.preventDefault()
    try {
      await feesAPI.recordCashPayment(
        cashPaymentForm.userId,
        cashPaymentForm.month,
        cashPaymentForm.year,
        cashPaymentForm.amount,
        cashPaymentForm.adminNotes
      )
      setSuccess('Cash payment recorded successfully')
      setShowCashPaymentModal(false)
      loadFees()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleGenerateFees = async () => {
    const month = new Date().toLocaleString('en-US', { month: 'long' })
    const year = new Date().getFullYear()
    try {
      const result = await feesAPI.generateFees(month, year)
      setSuccess(result.message)
    } catch (err) {
      setError(err.message)
    }
  }

  // Certificates management functions
  const loadCertificates = async (status = certFilter) => {
    try {
      const data = await feesAPI.getAllCertificates(status)
      setAllCertificates(data)
    } catch (err) {
      console.error('Failed to load certificates:', err)
    }
  }

  const handleCertificateAction = async (certId, action) => {
    try {
      const result = await feesAPI.certificateAction(certId, action)
      setSuccess(result.message)
      loadCertificates()
    } catch (err) {
      setError(err.message)
    }
  }

  // Meetings management functions
  const loadMeetings = async (status = meetingFilter) => {
    try {
      const data = await feesAPI.getMeetings(status)
      setMeetings(data)
    } catch (err) {
      console.error('Failed to load meetings:', err)
    }
  }

  const handleMeetingAction = async (meetingId, status) => {
    try {
      await feesAPI.meetingAction(meetingId, status)
      setSuccess(`Meeting ${status}`)
      loadMeetings()
    } catch (err) {
      setError(err.message)
    }
  }

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getCertificateName = (type) => {
    const names = {
      'd_certificate': 'D Certificate',
      'd_basic': 'D-Basic Certificate',
      'd_character': 'D-Character Certificate',
      'd_advanced': 'D-Advanced Certificate',
      'dance_teacher': 'Dance Teacher Certificate'
    }
    return names[type] || type
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const danceStyles = ['Classical Ballet', 'Contemporary', 'Hip Hop', 'Jazz', 'Kathak', 'Salsa & Latin', 'Bollywood Fusion', 'Kids Program']
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <motion.div 
      className="page admin-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">✦</span>
          <div>
            <h3>Dream Dance</h3>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSelectedStudent(null); setSelectedApplication(null) }}>
            <span>📊</span> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => { setActiveTab('applications'); setSelectedApplication(null); loadApplications() }}>
            <span>📝</span> Applications
            {applications.filter(a => a.application_status === 'pending').length > 0 && (
              <span className="badge">{applications.filter(a => a.application_status === 'pending').length}</span>
            )}
          </button>
          <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => { setActiveTab('students'); setSelectedStudent(null); setSelectedApplication(null) }}>
            <span>👥</span> Students
          </button>
          <button className={`nav-item ${activeTab === 'schedules' ? 'active' : ''}`} onClick={() => { setActiveTab('schedules'); setSelectedApplication(null) }}>
            <span>📅</span> Schedules
          </button>
          <button className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => { setActiveTab('fees'); loadFees() }}>
            <span>💰</span> Fees
          </button>
          <button className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => { setActiveTab('certificates'); loadCertificates() }}>
            <span>🏆</span> Certificates
          </button>
          <button className={`nav-item ${activeTab === 'meetings' ? 'active' : ''}`} onClick={() => { setActiveTab('meetings'); loadMeetings() }}>
            <span>📋</span> Meetings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <span className="admin-avatar">👤</span>
            <div>
              <strong>{user?.firstName} {user?.lastName}</strong>
              <span>Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Messages */}
        {error && <div className="message message-error" onClick={() => setError('')}>{error}</div>}
        {success && <div className="message message-success" onClick={() => setSuccess('')}>{success}</div>}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <h1>Dashboard</h1>
            
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <div className="stats-grid">
                  <div className="stat-card">
                    <span className="stat-icon">👥</span>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.totalStudents || 0}</span>
                      <span className="stat-label">Total Students</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">✅</span>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.activeStudents || 0}</span>
                      <span className="stat-label">Active Students</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">⏳</span>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.pendingEnrollments || 0}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">⏸️</span>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.pausedStudents || 0}</span>
                      <span className="stat-label">Paused</span>
                    </div>
                  </div>
                  <div className="stat-card">
                    <span className="stat-icon">🎭</span>
                    <div className="stat-info">
                      <span className="stat-value">{stats?.totalClasses || 0}</span>
                      <span className="stat-label">Dance Classes</span>
                    </div>
                  </div>
                </div>

                <div className="recent-section">
                  <h2>Recent Students</h2>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Dance Style</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.slice(0, 5).map(student => (
                          <tr key={student.id}>
                            <td>{student.first_name} {student.last_name}</td>
                            <td>{student.email}</td>
                            <td>{student.dance_style || '-'}</td>
                            <td>
                              <span className={`status-badge ${student.enrollment_status}`}>
                                {student.enrollment_status || 'pending'}
                              </span>
                            </td>
                            <td>
                              <button className="action-btn" onClick={() => { handleViewStudent(student); setActiveTab('students') }}>View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && !selectedStudent && (
          <div className="students-content">
            <div className="content-header">
              <h1>Students</h1>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Student</button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Dance Style</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.first_name} {student.last_name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || '-'}</td>
                      <td>{student.dance_style || '-'}</td>
                      <td>{student.experience_level || '-'}</td>
                      <td>
                        <span className={`status-badge ${student.enrollment_status}`}>
                          {student.enrollment_status || 'pending'}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => handleViewStudent(student)}>View</button>
                        <button className="action-btn delete" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                        {student.enrollment_status === 'paused' || student.is_paused ? (
                          <button className="action-btn activate" onClick={() => handleUnpauseStudent(student.id)}>Activate</button>
                        ) : (
                          <button className="action-btn pause" onClick={() => handlePauseStudent(student.id)}>Pause</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student Detail View */}
        {activeTab === 'students' && selectedStudent && (
          <div className="student-detail">
            <button className="back-btn" onClick={() => setSelectedStudent(null)}>← Back to Students</button>
            
            <div className="detail-header">
              <div className="student-avatar">
                {selectedStudent.enrollment_status === 'paused' || selectedStudent.is_paused ? '⏸️' : '👤'}
              </div>
              <div className="student-info">
                <h1>{selectedStudent.first_name} {selectedStudent.last_name}</h1>
                <p>{selectedStudent.email}</p>
                <span className={`status-badge ${selectedStudent.enrollment_status}`}>
                  {selectedStudent.enrollment_status || 'pending'}
                </span>
                {selectedStudent.is_paused && selectedStudent.pause_reason && (
                  <span className="pause-reason">Reason: {selectedStudent.pause_reason}</span>
                )}
              </div>
              <div className="student-actions">
                {selectedStudent.enrollment_status === 'paused' || selectedStudent.is_paused ? (
                  <button className="btn btn-success" onClick={() => handleUnpauseStudent(selectedStudent.id)}>
                    ▶️ Reactivate Profile
                  </button>
                ) : (
                  <button className="btn btn-warning" onClick={() => handlePauseStudent(selectedStudent.id)}>
                    ⏸️ Pause Profile
                  </button>
                )}
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <h3>Personal Information</h3>
                <div className="info-list">
                  <div className="info-item"><label>Phone:</label><span>{selectedStudent.phone || '-'}</span></div>
                  <div className="info-item"><label>Date of Birth:</label><span>{selectedStudent.date_of_birth || '-'}</span></div>
                  <div className="info-item"><label>Gender:</label><span>{selectedStudent.gender || '-'}</span></div>
                  <div className="info-item"><label>Address:</label><span>{selectedStudent.address || '-'}, {selectedStudent.city || ''} {selectedStudent.state || ''}</span></div>
                  <div className="info-item"><label>Qualification:</label><span>{selectedStudent.qualification || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>Dance Information</h3>
                <div className="info-list">
                  <div className="info-item"><label>Dance Style:</label><span>{selectedStudent.dance_style || '-'}</span></div>
                  <div className="info-item"><label>Experience:</label><span>{selectedStudent.experience_level || '-'}</span></div>
                  <div className="info-item"><label>Preferred Schedule:</label><span>{selectedStudent.preferred_schedule || '-'}</span></div>
                  <div className="info-item"><label>Goals:</label><span>{selectedStudent.goals || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>Parent/Guardian</h3>
                <div className="info-list">
                  <div className="info-item"><label>Name:</label><span>{selectedStudent.parent_guardian_name || '-'}</span></div>
                  <div className="info-item"><label>Phone:</label><span>{selectedStudent.parent_guardian_phone || '-'}</span></div>
                  <div className="info-item"><label>Email:</label><span>{selectedStudent.parent_guardian_email || '-'}</span></div>
                  <div className="info-item"><label>Relation:</label><span>{selectedStudent.parent_guardian_relation || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>Emergency Contact</h3>
                <div className="info-list">
                  <div className="info-item"><label>Name:</label><span>{selectedStudent.emergency_name || '-'}</span></div>
                  <div className="info-item"><label>Phone:</label><span>{selectedStudent.emergency_phone || '-'}</span></div>
                  <div className="info-item"><label>Relation:</label><span>{selectedStudent.emergency_relation || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>ID Proof</h3>
                <div className="info-list">
                  <div className="info-item"><label>ID Type:</label><span>{selectedStudent.id_proof_type || '-'}</span></div>
                  <div className="info-item"><label>ID Number:</label><span>{selectedStudent.id_proof_number || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card full-width">
                <div className="card-header">
                  <h3>Assigned Schedule</h3>
                  <button className="btn btn-primary btn-sm" onClick={openAddScheduleModal}>+ Add Class</button>
                </div>
                {selectedStudent.schedules?.length > 0 ? (
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Class</th>
                        <th>Instructor</th>
                        <th>Studio</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.schedules.map(schedule => (
                        <tr key={schedule.id}>
                          <td>{schedule.day_of_week}</td>
                          <td>{schedule.time_slot}</td>
                          <td>{schedule.class_name}</td>
                          <td>{schedule.instructor || '-'}</td>
                          <td>{schedule.studio || '-'}</td>
                          <td>
                            <button className="action-btn edit" onClick={() => handleEditSchedule(schedule)}>Edit</button>
                            <button className="action-btn delete" onClick={() => handleDeleteSchedule(schedule.id)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="empty-message">No classes scheduled yet</p>
                )}
              </div>

              <div className="detail-card full-width">
                <h3>Uploaded Documents ({selectedStudent.documents?.length || 0})</h3>
                {selectedStudent.documents?.length > 0 ? (
                  <div className="documents-list admin-documents">
                    {selectedStudent.documents.map(doc => (
                      <div key={doc.id} className="document-item">
                        <span className="doc-icon">
                          {doc.file_type?.includes('pdf') ? '📕' : doc.file_type?.includes('image') ? '🖼️' : '📄'}
                        </span>
                        <div className="doc-info">
                          <strong>{doc.original_name}</strong>
                          <span>{doc.document_type} • {new Date(doc.upload_date).toLocaleDateString()}</span>
                        </div>
                        <div className="doc-actions">
                          <button className="action-btn view" onClick={() => handleViewDocument(doc.id)} title="View">👁️</button>
                          <button className="action-btn download" onClick={() => handleDownloadDocument(doc.id, doc.original_name)} title="Download">⬇️</button>
                          <button className="action-btn delete" onClick={() => handleDeleteDocument(doc.id)} title="Delete">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No documents uploaded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schedules Tab */}
        {activeTab === 'schedules' && (
          <div className="schedules-content">
            <div className="content-header">
              <h1>All Schedules</h1>
              <button className="btn btn-secondary" onClick={loadData}>🔄 Refresh</button>
            </div>
            {allSchedules.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Time</th>
                      <th>Class</th>
                      <th>Student</th>
                      <th>Instructor</th>
                      <th>Studio</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSchedules.map(schedule => (
                      <tr key={schedule.id}>
                        <td><span className="day-badge">{schedule.day_of_week}</span></td>
                        <td>{schedule.time_slot}</td>
                        <td><strong>{schedule.class_name}</strong></td>
                        <td>{schedule.first_name} {schedule.last_name}</td>
                        <td>{schedule.instructor || '-'}</td>
                        <td>{schedule.studio || '-'}</td>
                        <td>
                          <button className="action-btn edit" onClick={() => handleEditSchedule(schedule)}>Edit</button>
                          <button className="action-btn delete" onClick={() => handleDeleteSchedule(schedule.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📅</span>
                <h3>No Schedules Yet</h3>
                <p>Go to the Students tab and add schedules for individual students.</p>
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && !selectedApplication && (
          <div className="applications-content">
            <div className="content-header">
              <h1>Pre-Admission Applications</h1>
              <div className="filter-tabs">
                {['pending', 'trial_scheduled', 'approved', 'rejected'].map(status => (
                  <button 
                    key={status}
                    className={`filter-tab ${applicationFilter === status ? 'active' : ''}`}
                    onClick={() => { setApplicationFilter(status); loadApplications(status) }}
                  >
                    {status === 'trial_scheduled' ? 'Trial Scheduled' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {applications.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Dance Style</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td>{new Date(app.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`type-badge ${app.application_type}`}>
                            {app.application_type === 'trial' ? '🎯 Trial' : '🌟 Admission'}
                          </span>
                        </td>
                        <td><strong>{app.first_name} {app.last_name}</strong></td>
                        <td>{app.phone}</td>
                        <td>{app.email}</td>
                        <td>{app.dance_style || '-'}</td>
                        <td>
                          {app.application_type === 'admission' && (
                            <span className={`payment-badge ${app.payment_status}`}>
                              {app.payment_status}
                            </span>
                          )}
                          {app.application_type === 'trial' && '-'}
                        </td>
                        <td>
                          <span className={`status-badge ${app.application_status}`}>
                            {app.application_status === 'trial_scheduled' ? 'Trial Scheduled' : app.application_status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn" onClick={() => handleViewApplication(app)}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <h3>No {applicationFilter} Applications</h3>
                <p>Applications will appear here when students apply through the pre-admission form.</p>
              </div>
            )}
          </div>
        )}

        {/* Application Detail View */}
        {activeTab === 'applications' && selectedApplication && (
          <div className="application-detail">
            <button className="back-btn" onClick={() => setSelectedApplication(null)}>← Back to Applications</button>
            
            <div className="detail-header">
              <div className="application-type-badge">
                {selectedApplication.application_type === 'trial' ? '🎯 Trial Application' : '🌟 Admission Application'}
              </div>
              <div className="application-info">
                <h1>{selectedApplication.first_name} {selectedApplication.last_name}</h1>
                <p>{selectedApplication.email} • {selectedApplication.phone}</p>
                <div className="status-row">
                  <span className={`status-badge ${selectedApplication.application_status}`}>
                    {selectedApplication.application_status === 'trial_scheduled' ? 'Trial Scheduled' : selectedApplication.application_status}
                  </span>
                  {selectedApplication.application_type === 'admission' && (
                    <span className={`payment-badge ${selectedApplication.payment_status}`}>
                      Payment: {selectedApplication.payment_status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="detail-grid">
              <div className="detail-card">
                <h3>Personal Information</h3>
                <div className="info-list">
                  <div className="info-item"><label>Age:</label><span>{selectedApplication.age || '-'}</span></div>
                  <div className="info-item"><label>Address:</label><span>{selectedApplication.address || '-'}</span></div>
                  <div className="info-item"><label>City:</label><span>{selectedApplication.city || '-'}</span></div>
                  <div className="info-item"><label>State:</label><span>{selectedApplication.state || '-'}</span></div>
                  <div className="info-item"><label>Branch:</label><span>{selectedApplication.branch_name || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>Parent/Guardian</h3>
                <div className="info-list">
                  <div className="info-item"><label>Name:</label><span>{selectedApplication.parent_guardian_name || '-'}</span></div>
                  <div className="info-item"><label>Phone:</label><span>{selectedApplication.parent_guardian_phone || '-'}</span></div>
                  <div className="info-item"><label>Relation:</label><span>{selectedApplication.parent_guardian_relation || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card">
                <h3>Dance Preferences</h3>
                <div className="info-list">
                  <div className="info-item"><label>Style:</label><span>{selectedApplication.dance_style || '-'}</span></div>
                  <div className="info-item"><label>Experience:</label><span>{selectedApplication.experience_level || '-'}</span></div>
                </div>
              </div>

              {selectedApplication.application_type === 'admission' && (
                <div className="detail-card">
                  <h3>ID Verification</h3>
                  <div className="info-list">
                    <div className="info-item"><label>ID Type:</label><span>{selectedApplication.id_proof_type || '-'}</span></div>
                    <div className="info-item"><label>ID Number:</label><span>{selectedApplication.id_proof_number || '-'}</span></div>
                    {selectedApplication.id_proof_document && (
                      <div className="info-item">
                        <label>Document:</label>
                        <button className="action-btn" onClick={() => preadmissionAPI.viewApplicationDocument(selectedApplication.id, 'idproof')}>
                          View ID Proof 📄
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedApplication.application_type === 'admission' && (
                <div className="detail-card">
                  <h3>Payment Details</h3>
                  <div className="info-list">
                    <div className="info-item"><label>Amount:</label><span>₹{selectedApplication.payment_amount || '-'}</span></div>
                    <div className="info-item"><label>Status:</label>
                      <span className={`payment-badge ${selectedApplication.payment_status}`}>{selectedApplication.payment_status}</span>
                    </div>
                    {selectedApplication.payment_screenshot && (
                      <div className="info-item">
                        <label>Screenshot:</label>
                        <button className="action-btn" onClick={() => preadmissionAPI.viewApplicationDocument(selectedApplication.id, 'payment')}>
                          View Payment 📸
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedApplication.payment_status === 'uploaded' && (
                    <div className="payment-actions">
                      <button className="btn btn-success" onClick={() => handleVerifyPayment('verified')}>✓ Verify Payment</button>
                      <button className="btn btn-danger" onClick={() => handleVerifyPayment('rejected')}>✗ Reject Payment</button>
                    </div>
                  )}
                </div>
              )}

              {selectedApplication.application_status === 'trial_scheduled' && (
                <div className="detail-card">
                  <h3>Trial Class Details</h3>
                  <div className="info-list">
                    <div className="info-item"><label>Date:</label><span>{selectedApplication.trial_class_date || '-'}</span></div>
                    <div className="info-item"><label>Time:</label><span>{selectedApplication.trial_class_time || '-'}</span></div>
                  </div>
                </div>
              )}

              {selectedApplication.admin_notes && (
                <div className="detail-card full-width">
                  <h3>Admin Notes</h3>
                  <p>{selectedApplication.admin_notes}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedApplication.application_status === 'pending' && (
              <div className="application-actions">
                {selectedApplication.application_type === 'trial' ? (
                  <button className="btn btn-success" onClick={() => setShowApprovalModal(true)}>
                    📅 Schedule Trial Class
                  </button>
                ) : (
                  <>
                    {selectedApplication.payment_status === 'verified' && (
                      <button className="btn btn-success" onClick={() => setShowApprovalModal(true)}>
                        ✓ Approve Admission
                      </button>
                    )}
                    {selectedApplication.payment_status !== 'verified' && (
                      <p className="warning-text">⚠️ Payment must be verified before approving admission</p>
                    )}
                  </>
                )}
                <button className="btn btn-danger" onClick={handleRejectApplication}>
                  ✗ Reject Application
                </button>
              </div>
            )}
          </div>
        )}

        {/* Fees Tab */}
        {activeTab === 'fees' && (
          <div className="fees-admin-content">
            <div className="content-header">
              <h1>Fee Management</h1>
              <div className="header-actions">
                <button className="btn btn-secondary" onClick={handleGenerateFees}>
                  📝 Generate Monthly Fees
                </button>
                <button className="btn btn-primary" onClick={() => setShowCashPaymentModal(true)}>
                  💵 Record Cash Payment
                </button>
              </div>
            </div>

            <div className="filter-bar">
              <button className={`filter-btn ${feeFilter === 'uploaded' ? 'active' : ''}`} onClick={() => { setFeeFilter('uploaded'); loadFees('uploaded') }}>
                Pending Verification
              </button>
              <button className={`filter-btn ${feeFilter === 'verified' ? 'active' : ''}`} onClick={() => { setFeeFilter('verified'); loadFees('verified') }}>
                Verified
              </button>
              <button className={`filter-btn ${feeFilter === 'pending' ? 'active' : ''}`} onClick={() => { setFeeFilter('pending'); loadFees('pending') }}>
                Unpaid
              </button>
              <button className={`filter-btn ${feeFilter === '' ? 'active' : ''}`} onClick={() => { setFeeFilter(''); loadFees('') }}>
                All
              </button>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Month</th>
                    <th>Base Fee</th>
                    <th>Penalty</th>
                    <th>Total</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allFees.map(fee => (
                    <tr key={fee.id}>
                      <td>
                        <div className="student-info-cell">
                          <strong>{fee.first_name} {fee.last_name}</strong>
                          <small>{fee.student_id || fee.email}</small>
                        </div>
                      </td>
                      <td>{fee.month} {fee.year}</td>
                      <td>{formatCurrency(fee.base_amount)}</td>
                      <td className={fee.penalty_amount > 0 ? 'penalty' : ''}>{formatCurrency(fee.penalty_amount || 0)}</td>
                      <td className="total">{formatCurrency(fee.total_amount)}</td>
                      <td>{fee.payment_method === 'cash' ? '💵 Cash' : fee.payment_method === 'online' ? '📱 Online' : '-'}</td>
                      <td>
                        <span className={`status-badge ${fee.status}`}>
                          {fee.status}
                        </span>
                      </td>
                      <td>
                        {fee.status === 'uploaded' && (
                          <div className="action-buttons">
                            <button className="action-btn view" onClick={() => feesAPI.viewPaymentScreenshot(fee.id)}>
                              👁️ View
                            </button>
                            <button className="action-btn approve" onClick={() => handleVerifyFeePayment(fee.id, 'verified')}>
                              ✓
                            </button>
                            <button className="action-btn reject" onClick={() => handleVerifyFeePayment(fee.id, 'rejected')}>
                              ✗
                            </button>
                          </div>
                        )}
                        {fee.status === 'pending' && (
                          <button className="action-btn" onClick={() => {
                            setCashPaymentForm({ ...cashPaymentForm, userId: fee.user_id, month: fee.month, year: fee.year, amount: fee.total_amount })
                            setShowCashPaymentModal(true)
                          }}>
                            💵 Cash
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {allFees.length === 0 && (
                <div className="empty-table">No fee records found</div>
              )}
            </div>
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="certificates-admin-content">
            <div className="content-header">
              <h1>Certificate Applications</h1>
            </div>

            <div className="filter-bar">
              <button className={`filter-btn ${certFilter === 'pending' ? 'active' : ''}`} onClick={() => { setCertFilter('pending'); loadCertificates('pending') }}>
                Pending
              </button>
              <button className={`filter-btn ${certFilter === 'approved' ? 'active' : ''}`} onClick={() => { setCertFilter('approved'); loadCertificates('approved') }}>
                Approved
              </button>
              <button className={`filter-btn ${certFilter === 'rejected' ? 'active' : ''}`} onClick={() => { setCertFilter('rejected'); loadCertificates('rejected') }}>
                Rejected
              </button>
              <button className={`filter-btn ${certFilter === '' ? 'active' : ''}`} onClick={() => { setCertFilter(''); loadCertificates('') }}>
                All
              </button>
            </div>

            <div className="certificates-list">
              {allCertificates.map(cert => (
                <div key={cert.id} className={`certificate-admin-card ${cert.status}`}>
                  <div className="cert-header">
                    <div className="cert-icon">
                      {cert.status === 'approved' ? '🏆' : cert.status === 'pending' ? '⏳' : '❌'}
                    </div>
                    <div className="cert-info">
                      <h3>{getCertificateName(cert.certificate_type)}</h3>
                      <p className="student-name">{cert.first_name} {cert.last_name}</p>
                      <p className="student-id">{cert.student_id || cert.email}</p>
                    </div>
                  </div>
                  <div className="cert-details">
                    <span className={`status-badge ${cert.status}`}>{cert.status}</span>
                    <span className="date">Applied: {new Date(cert.application_date).toLocaleDateString()}</span>
                    {cert.certificate_number && (
                      <span className="cert-number">#{cert.certificate_number}</span>
                    )}
                  </div>
                  {cert.status === 'pending' && (
                    <div className="cert-actions">
                      <button className="btn btn-success btn-sm" onClick={() => handleCertificateAction(cert.id, 'approved')}>
                        ✓ Approve
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCertificateAction(cert.id, 'rejected')}>
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {allCertificates.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">🏆</span>
                  <h3>No Certificate Applications</h3>
                  <p>Certificate applications will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="meetings-admin-content">
            <div className="content-header">
              <h1>Meeting Requests</h1>
            </div>

            <div className="filter-bar">
              <button className={`filter-btn ${meetingFilter === 'pending' ? 'active' : ''}`} onClick={() => { setMeetingFilter('pending'); loadMeetings('pending') }}>
                Pending
              </button>
              <button className={`filter-btn ${meetingFilter === 'confirmed' ? 'active' : ''}`} onClick={() => { setMeetingFilter('confirmed'); loadMeetings('confirmed') }}>
                Confirmed
              </button>
              <button className={`filter-btn ${meetingFilter === 'completed' ? 'active' : ''}`} onClick={() => { setMeetingFilter('completed'); loadMeetings('completed') }}>
                Completed
              </button>
              <button className={`filter-btn ${meetingFilter === '' ? 'active' : ''}`} onClick={() => { setMeetingFilter(''); loadMeetings('') }}>
                All
              </button>
            </div>

            <div className="meetings-list">
              {meetings.map(meeting => (
                <div key={meeting.id} className={`meeting-card ${meeting.status}`}>
                  <div className="meeting-header">
                    <h3>{meeting.name}</h3>
                    <span className={`status-badge ${meeting.status}`}>{meeting.status}</span>
                  </div>
                  <div className="meeting-details">
                    <p>📧 {meeting.email}</p>
                    <p>📞 {meeting.phone}</p>
                    <p>📅 {meeting.preferred_date} at {meeting.preferred_time}</p>
                    {meeting.purpose && <p>📝 {meeting.purpose}</p>}
                  </div>
                  <div className="meeting-actions">
                    {meeting.status === 'pending' && (
                      <>
                        <button className="btn btn-success btn-sm" onClick={() => handleMeetingAction(meeting.id, 'confirmed')}>
                          ✓ Confirm
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleMeetingAction(meeting.id, 'cancelled')}>
                          ✗ Cancel
                        </button>
                      </>
                    )}
                    {meeting.status === 'confirmed' && (
                      <button className="btn btn-primary btn-sm" onClick={() => handleMeetingAction(meeting.id, 'completed')}>
                        ✓ Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {meetings.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">📋</span>
                  <h3>No Meeting Requests</h3>
                  <p>Meeting requests will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddStudent}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" value={studentForm.firstName} onChange={e => setStudentForm({...studentForm, firstName: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" value={studentForm.lastName} onChange={e => setStudentForm({...studentForm, lastName: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={studentForm.email} onChange={e => setStudentForm({...studentForm, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" value={studentForm.password} onChange={e => setStudentForm({...studentForm, password: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={studentForm.phone} onChange={e => setStudentForm({...studentForm, phone: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dance Style</label>
                  <select value={studentForm.danceStyle} onChange={e => setStudentForm({...studentForm, danceStyle: e.target.value})}>
                    <option value="">Select style</option>
                    {danceStyles.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience Level</label>
                  <select value={studentForm.experienceLevel} onChange={e => setStudentForm({...studentForm, experienceLevel: e.target.value})}>
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => { setShowScheduleModal(false); setEditingSchedule(null) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSchedule ? 'Edit Schedule' : 'Add Class Schedule'}</h2>
              <button className="close-btn" onClick={() => { setShowScheduleModal(false); setEditingSchedule(null) }}>×</button>
            </div>
            <form onSubmit={handleAddSchedule}>
              <div className="form-row">
                <div className="form-group">
                  <label>Day *</label>
                  <select value={scheduleForm.dayOfWeek} onChange={e => setScheduleForm({...scheduleForm, dayOfWeek: e.target.value})} required>
                    <option value="">Select day</option>
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Time *</label>
                  <input type="time" value={scheduleForm.timeSlot} onChange={e => setScheduleForm({...scheduleForm, timeSlot: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Class Name *</label>
                <select value={scheduleForm.className} onChange={e => setScheduleForm({...scheduleForm, className: e.target.value})} required>
                  <option value="">Select class</option>
                  {danceStyles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Instructor</label>
                  <input type="text" value={scheduleForm.instructor} onChange={e => setScheduleForm({...scheduleForm, instructor: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Studio</label>
                  <input type="text" value={scheduleForm.studio} onChange={e => setScheduleForm({...scheduleForm, studio: e.target.value})} placeholder="e.g., Studio A" />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm, notes: e.target.value})} rows="2"></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowScheduleModal(false); setEditingSchedule(null) }}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingSchedule ? 'Save Changes' : 'Add Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowApprovalModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {selectedApplication.application_type === 'trial' ? 'Schedule Trial Class' : 'Approve Admission'}
              </h2>
              <button className="close-btn" onClick={() => setShowApprovalModal(false)}>×</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (selectedApplication.application_type === 'trial') {
                handleApproveTrial()
              } else {
                handleApproveAdmission()
              }
            }}>
              {selectedApplication.application_type === 'trial' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Trial Class Date *</label>
                      <input 
                        type="date" 
                        value={approvalForm.trialClassDate} 
                        onChange={e => setApprovalForm({...approvalForm, trialClassDate: e.target.value})} 
                        min={new Date().toISOString().split('T')[0]}
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Trial Class Time *</label>
                      <input 
                        type="time" 
                        value={approvalForm.trialClassTime} 
                        onChange={e => setApprovalForm({...approvalForm, trialClassTime: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>
                  <div className="approval-info">
                    <p>An email will be sent to <strong>{selectedApplication.email}</strong> with the trial class details.</p>
                  </div>
                </>
              )}

              {selectedApplication.application_type === 'admission' && (
                <div className="approval-info">
                  <p>Approving this admission will:</p>
                  <ul>
                    <li>✓ Create a student account</li>
                    <li>✓ Generate a unique Student ID</li>
                    <li>✓ Send login credentials via email</li>
                  </ul>
                  <p>Student: <strong>{selectedApplication.first_name} {selectedApplication.last_name}</strong></p>
                  <p>Email: <strong>{selectedApplication.email}</strong></p>
                </div>
              )}

              <div className="form-group">
                <label>Admin Notes (optional)</label>
                <textarea 
                  value={approvalForm.adminNotes} 
                  onChange={e => setApprovalForm({...approvalForm, adminNotes: e.target.value})} 
                  rows="3"
                  placeholder="Add any notes for this application..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApprovalModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">
                  {selectedApplication.application_type === 'trial' ? '📅 Schedule Trial' : '✓ Approve Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cash Payment Modal */}
      {showCashPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowCashPaymentModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Cash Payment</h2>
              <button className="close-btn" onClick={() => setShowCashPaymentModal(false)}>×</button>
            </div>
            <form onSubmit={handleRecordCashPayment}>
              <div className="form-group">
                <label>Student *</label>
                <select 
                  value={cashPaymentForm.userId || ''} 
                  onChange={e => setCashPaymentForm({...cashPaymentForm, userId: parseInt(e.target.value)})}
                  required
                >
                  <option value="">Select Student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} - {s.email}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Month *</label>
                  <select 
                    value={cashPaymentForm.month} 
                    onChange={e => setCashPaymentForm({...cashPaymentForm, month: e.target.value})}
                    required
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <input 
                    type="number" 
                    value={cashPaymentForm.year} 
                    onChange={e => setCashPaymentForm({...cashPaymentForm, year: parseInt(e.target.value)})}
                    min="2024"
                    max="2030"
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input 
                  type="number" 
                  value={cashPaymentForm.amount} 
                  onChange={e => setCashPaymentForm({...cashPaymentForm, amount: parseInt(e.target.value)})}
                  min="0"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Admin Notes</label>
                <textarea 
                  value={cashPaymentForm.adminNotes} 
                  onChange={e => setCashPaymentForm({...cashPaymentForm, adminNotes: e.target.value})} 
                  rows="2"
                  placeholder="e.g., Received in office on..."
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCashPaymentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">💵 Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboard
