import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { studentAPI } from '../services/api'
import './StudentDashboard.css'

const StudentDashboard = () => {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const profileImageRef = useRef(null)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [schedules, setSchedules] = useState([])
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [documentType, setDocumentType] = useState('id_proof')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [profileData, scheduleData, documentsData] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getSchedule(),
        studentAPI.getDocuments()
      ])
      setProfile(profileData)
      setSchedules(scheduleData)
      setDocuments(documentsData)
      setEditForm({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        phone: profileData.phone || '',
        dateOfBirth: profileData.date_of_birth || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zip_code || '',
        emergencyName: profileData.emergency_name || '',
        emergencyPhone: profileData.emergency_phone || '',
        emergencyRelation: profileData.emergency_relation || ''
      })
    } catch (err) {
      setError('Failed to load profile data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await studentAPI.updateProfile(editForm)
      setSuccess('Profile updated successfully')
      setIsEditing(false)
      updateUser({ firstName: editForm.firstName, lastName: editForm.lastName })
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)
      await studentAPI.uploadDocument(file, documentType)
      setSuccess('Document uploaded successfully')
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setIsUploading(true)
      const result = await studentAPI.uploadProfileImage(file)
      setSuccess('Profile image updated')
      updateUser({ profileImage: result.fileName })
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    try {
      await studentAPI.deleteDocument(id)
      setSuccess('Document deleted')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const documentTypes = [
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'medical_certificate', label: 'Medical Certificate' },
    { value: 'photo', label: 'Passport Photo' },
    { value: 'address_proof', label: 'Address Proof' },
    { value: 'other', label: 'Other' }
  ]

  const groupSchedulesByDay = () => {
    const grouped = {}
    schedules.forEach(s => {
      if (!grouped[s.day_of_week]) grouped[s.day_of_week] = []
      grouped[s.day_of_week].push(s)
    })
    return grouped
  }

  return (
    <motion.div 
      className="page student-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Sidebar */}
      <aside className="student-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">✦</span>
          <div>
            <h3>Dream Dance</h3>
            <span>Student Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span>🏠</span> Overview
          </button>
          <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <span>👤</span> My Profile
          </button>
          <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <span>📅</span> My Schedule
          </button>
          <button className={`nav-item ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            <span>📄</span> Documents
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="student-info">
            <div className="student-avatar-container">
              <span className="student-avatar">
                {profile?.profile_image ? '🖼️' : '👤'}
              </span>
              <span className="student-id-badge">02112020{String(profile?.id || user?.id).padStart(4, '0')}</span>
            </div>
            <div>
              <strong>{user?.firstName} {user?.lastName}</strong>
              <span>Student</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="student-main">
        {/* Messages */}
        {error && <div className="message message-error" onClick={() => setError('')}>{error}</div>}
        {success && <div className="message message-success" onClick={() => setSuccess('')}>{success}</div>}

        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="overview-content">
                <h1>Welcome, {profile?.first_name}! 👋</h1>
                
                <div className="overview-grid">
                  <div className="overview-card profile-summary">
                    <div className="card-icon">👤</div>
                    <h3>Your Profile</h3>
                    <p>Dance Style: <strong>{profile?.dance_style || 'Not set'}</strong></p>
                    <p>Level: <strong>{profile?.experience_level || 'Not set'}</strong></p>
                    <p>Status: <span className={`status-badge ${profile?.enrollment_status}`}>{profile?.enrollment_status || 'pending'}</span></p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('profile')}>Edit Profile</button>
                  </div>

                  <div className="overview-card schedule-summary">
                    <div className="card-icon">📅</div>
                    <h3>Upcoming Classes</h3>
                    {schedules.length > 0 ? (
                      <ul className="upcoming-list">
                        {schedules.slice(0, 3).map((s, i) => (
                          <li key={i}>
                            <span className="class-day">{s.day_of_week}</span>
                            <span className="class-name">{s.class_name}</span>
                            <span className="class-time">{s.time_slot}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="empty-text">No classes scheduled yet</p>
                    )}
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('schedule')}>View Full Schedule</button>
                  </div>

                  <div className="overview-card documents-summary">
                    <div className="card-icon">📄</div>
                    <h3>Documents</h3>
                    <p><strong>{documents.length}</strong> documents uploaded</p>
                    <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('documents')}>Manage Documents</button>
                  </div>

                  <div className="overview-card quick-actions">
                    <div className="card-icon">⚡</div>
                    <h3>Quick Actions</h3>
                    <div className="actions-list">
                      <button onClick={() => setActiveTab('documents')}>Upload Document</button>
                      <button onClick={() => setActiveTab('profile')}>Update Info</button>
                      <button onClick={() => navigate('/contact')}>Contact Support</button>
                    </div>
                  </div>
                </div>

                <div className="announcements">
                  <h2>📢 Announcements</h2>
                  <div className="announcement-card">
                    <strong>Annual Showcase 2024</strong>
                    <p>Registration for our annual showcase is now open! Contact your instructor for details.</p>
                    <span className="announcement-date">Posted 2 days ago</span>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="profile-content">
                <div className="content-header">
                  <h1>My Profile</h1>
                  {!isEditing ? (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  ) : (
                    <div className="header-actions">
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                    </div>
                  )}
                </div>

                <div className="profile-header">
                  <div className="profile-avatar-section">
                    <div className="profile-avatar">
                      {profile?.profile_image ? '🖼️' : '👤'}
                    </div>
                    <input type="file" ref={profileImageRef} onChange={handleProfileImageUpload} accept="image/*" hidden />
                    <button className="change-photo-btn" onClick={() => profileImageRef.current?.click()} disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Change Photo'}
                    </button>
                  </div>
                  <div className="profile-basic">
                    <h2>{profile?.first_name} {profile?.last_name}</h2>
                    <p>{profile?.email}</p>
                    <span className={`status-badge ${profile?.enrollment_status}`}>{profile?.enrollment_status || 'pending'}</span>
                  </div>
                </div>

                <div className="profile-grid">
                  <div className="profile-section">
                    <h3>Personal Information</h3>
                    {isEditing ? (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>First Name</label>
                            <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" value={editForm.dateOfBirth} onChange={e => setEditForm({...editForm, dateOfBirth: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Gender</label>
                          <select value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})}>
                            <option value="">Select</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>Phone:</span><strong>{profile?.phone || 'Not set'}</strong></div>
                        <div className="info-row"><span>Date of Birth:</span><strong>{profile?.date_of_birth || 'Not set'}</strong></div>
                        <div className="info-row"><span>Gender:</span><strong>{profile?.gender || 'Not set'}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="profile-section">
                    <h3>Address</h3>
                    {isEditing ? (
                      <>
                        <div className="form-group">
                          <label>Street Address</label>
                          <input type="text" value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                        </div>
                        <div className="form-row form-row-3">
                          <div className="form-group">
                            <label>City</label>
                            <input type="text" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>State</label>
                            <input type="text" value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>ZIP Code</label>
                            <input type="text" value={editForm.zipCode} onChange={e => setEditForm({...editForm, zipCode: e.target.value})} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>Address:</span><strong>{profile?.address || 'Not set'}</strong></div>
                        <div className="info-row"><span>City:</span><strong>{profile?.city || 'Not set'}</strong></div>
                        <div className="info-row"><span>State:</span><strong>{profile?.state || 'Not set'}</strong></div>
                        <div className="info-row"><span>ZIP:</span><strong>{profile?.zip_code || 'Not set'}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="profile-section">
                    <h3>Emergency Contact</h3>
                    {isEditing ? (
                      <>
                        <div className="form-group">
                          <label>Contact Name</label>
                          <input type="text" value={editForm.emergencyName} onChange={e => setEditForm({...editForm, emergencyName: e.target.value})} />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" value={editForm.emergencyPhone} onChange={e => setEditForm({...editForm, emergencyPhone: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>Relationship</label>
                            <input type="text" value={editForm.emergencyRelation} onChange={e => setEditForm({...editForm, emergencyRelation: e.target.value})} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>Name:</span><strong>{profile?.emergency_name || 'Not set'}</strong></div>
                        <div className="info-row"><span>Phone:</span><strong>{profile?.emergency_phone || 'Not set'}</strong></div>
                        <div className="info-row"><span>Relation:</span><strong>{profile?.emergency_relation || 'Not set'}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="profile-section">
                    <h3>Dance Information</h3>
                    <div className="info-display">
                      <div className="info-row"><span>Dance Style:</span><strong>{profile?.dance_style || 'Not set'}</strong></div>
                      <div className="info-row"><span>Experience:</span><strong>{profile?.experience_level || 'Not set'}</strong></div>
                      <div className="info-row"><span>Schedule:</span><strong>{profile?.preferred_schedule || 'Not set'}</strong></div>
                      <div className="info-row"><span>Goals:</span><strong>{profile?.goals || 'Not set'}</strong></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="schedule-content">
                <div className="content-header">
                  <h1>My Schedule</h1>
                  <button className="btn btn-secondary refresh-btn" onClick={loadData}>
                    🔄 Refresh
                  </button>
                </div>
                
                {schedules.length > 0 ? (
                  <div className="schedule-grid">
                    {Object.entries(groupSchedulesByDay()).map(([day, classes]) => (
                      <div key={day} className="day-card">
                        <h3>{day}</h3>
                        <div className="classes-list">
                          {classes.map((c, i) => (
                            <div key={i} className="class-item">
                              <div className="class-time">{c.time_slot}</div>
                              <div className="class-details">
                                <strong>{c.class_name}</strong>
                                {c.instructor && <span>with {c.instructor}</span>}
                                {c.studio && <span className="studio">{c.studio}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <span className="empty-icon">📅</span>
                    <h3>No Classes Scheduled</h3>
                    <p>Your schedule will appear here once classes are assigned by the admin.</p>
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="documents-content">
                <h1>My Documents</h1>
                
                <div className="upload-section">
                  <h3>Upload New Document</h3>
                  <div className="upload-form">
                    <div className="form-group">
                      <label>Document Type</label>
                      <select value={documentType} onChange={e => setDocumentType(e.target.value)}>
                        {documentTypes.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="upload-area">
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" hidden />
                      <button className="upload-btn" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                        {isUploading ? (
                          <>
                            <span className="spinner"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <span>📤</span>
                            Choose File to Upload
                          </>
                        )}
                      </button>
                      <p className="upload-hint">Supported: PDF, JPG, PNG, DOC, DOCX (Max 10MB)</p>
                    </div>
                  </div>
                </div>

                <div className="documents-list-section">
                  <h3>Uploaded Documents ({documents.length})</h3>
                  {documents.length > 0 ? (
                    <div className="documents-grid">
                      {documents.map(doc => (
                        <div key={doc.id} className="document-card">
                          <div className="doc-icon">
                            {doc.file_type.includes('pdf') ? '📕' : doc.file_type.includes('image') ? '🖼️' : '📄'}
                          </div>
                          <div className="doc-details">
                            <strong>{doc.original_name}</strong>
                            <span className="doc-type">{documentTypes.find(t => t.value === doc.document_type)?.label || doc.document_type}</span>
                            <span className="doc-date">{new Date(doc.upload_date).toLocaleDateString()}</span>
                          </div>
                          <button className="delete-btn" onClick={() => handleDeleteDocument(doc.id)}>🗑️</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">📄</span>
                      <h3>No Documents</h3>
                      <p>Upload your documents using the form above.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </motion.div>
  )
}

export default StudentDashboard
