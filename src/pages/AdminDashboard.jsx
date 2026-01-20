import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setIsLoading(false)
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
      await adminAPI.addSchedule(selectedStudent.id, scheduleForm)
      setSuccess('Schedule added successfully')
      setShowScheduleModal(false)
      setScheduleForm({ dayOfWeek: '', timeSlot: '', className: '', instructor: '', studio: '', notes: '' })
      handleViewStudent(selectedStudent)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await adminAPI.deleteSchedule(scheduleId)
      setSuccess('Schedule deleted')
      handleViewStudent(selectedStudent)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
          <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSelectedStudent(null) }}>
            <span>📊</span> Dashboard
          </button>
          <button className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => { setActiveTab('students'); setSelectedStudent(null) }}>
            <span>👥</span> Students
          </button>
          <button className={`nav-item ${activeTab === 'schedules' ? 'active' : ''}`} onClick={() => setActiveTab('schedules')}>
            <span>📅</span> Schedules
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
              <div className="student-avatar">👤</div>
              <div className="student-info">
                <h1>{selectedStudent.first_name} {selectedStudent.last_name}</h1>
                <p>{selectedStudent.email}</p>
                <span className={`status-badge ${selectedStudent.enrollment_status}`}>
                  {selectedStudent.enrollment_status || 'pending'}
                </span>
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
                <h3>Emergency Contact</h3>
                <div className="info-list">
                  <div className="info-item"><label>Name:</label><span>{selectedStudent.emergency_name || '-'}</span></div>
                  <div className="info-item"><label>Phone:</label><span>{selectedStudent.emergency_phone || '-'}</span></div>
                  <div className="info-item"><label>Relation:</label><span>{selectedStudent.emergency_relation || '-'}</span></div>
                </div>
              </div>

              <div className="detail-card full-width">
                <div className="card-header">
                  <h3>Assigned Schedule</h3>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowScheduleModal(true)}>+ Add Class</button>
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
                <h3>Uploaded Documents</h3>
                {selectedStudent.documents?.length > 0 ? (
                  <div className="documents-list">
                    {selectedStudent.documents.map(doc => (
                      <div key={doc.id} className="document-item">
                        <span className="doc-icon">📄</span>
                        <div className="doc-info">
                          <strong>{doc.original_name}</strong>
                          <span>{doc.document_type} • {new Date(doc.upload_date).toLocaleDateString()}</span>
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
            <h1>All Schedules</h1>
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

      {/* Add Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Class Schedule</h2>
              <button className="close-btn" onClick={() => setShowScheduleModal(false)}>×</button>
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
                <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default AdminDashboard
