import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { studentAPI, feesAPI } from '../services/api'
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
  
  // Fees and Certificates state
  const [fees, setFees] = useState([])
  const [currentFee, setCurrentFee] = useState(null)
  const [monthlyFee, setMonthlyFee] = useState(2000)
  const [certificates, setCertificates] = useState([])
  const [certificateData, setCertificateData] = useState({
    isEligible: false,
    enrollmentDuration: 0,
    nextAvailableCert: null,
    allCertificateTypes: [],
    hasPendingApplication: false
  })
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  const [isPaymentUploading, setIsPaymentUploading] = useState(false)
  const paymentInputRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [profileData, scheduleData, documentsData, feesData, certsData] = await Promise.all([
        studentAPI.getProfile(),
        studentAPI.getSchedule(),
        studentAPI.getDocuments(),
        feesAPI.getMyFees().catch(() => ({ fees: [], currentFee: null, monthlyFee: 2000 })),
        feesAPI.getMyCertificates().catch(() => ({ certificates: [], isEligible: false }))
      ])
      setProfile(profileData)
      setSchedules(scheduleData)
      setDocuments(documentsData)
      setFees(feesData.fees || [])
      setCurrentFee(feesData.currentFee)
      setMonthlyFee(feesData.monthlyFee || 2000)
      setCertificates(certsData.certificates || [])
      setCertificateData({
        isEligible: certsData.isEligible,
        enrollmentDuration: certsData.enrollmentDuration,
        nextAvailableCert: certsData.nextAvailableCert,
        allCertificateTypes: certsData.allCertificateTypes || [],
        hasPendingApplication: certsData.hasPendingApplication
      })
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
        emergencyRelation: profileData.emergency_relation || '',
        parentGuardianName: profileData.parent_guardian_name || '',
        parentGuardianPhone: profileData.parent_guardian_phone || '',
        parentGuardianEmail: profileData.parent_guardian_email || '',
        parentGuardianRelation: profileData.parent_guardian_relation || '',
        qualification: profileData.qualification || '',
        idProofType: profileData.id_proof_type || '',
        idProofNumber: profileData.id_proof_number || ''
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

  // Document management is now admin-only

  // Fee payment handler
  const handleFeePayment = async () => {
    if (!paymentScreenshot || !currentFee) return
    
    try {
      setIsPaymentUploading(true)
      await feesAPI.payFee(currentFee.month, currentFee.year, paymentScreenshot)
      setSuccess('Payment screenshot uploaded successfully! Pending admin verification.')
      setPaymentScreenshot(null)
      if (paymentInputRef.current) paymentInputRef.current.value = ''
      loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsPaymentUploading(false)
    }
  }

  // Certificate application handler
  const handleApplyCertificate = async (certificateType) => {
    try {
      await feesAPI.applyCertificate(certificateType)
      setSuccess('Certificate application submitted successfully!')
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Get certificate name
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
          <button className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>
            <span>💰</span> Fees & Payments
          </button>
          <button className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>
            <span>🏆</span> Certificates
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="student-info">
            <span className="student-avatar">
              {profile?.profile_image ? '🖼️' : '👤'}
            </span>
            <div className="student-details">
              <div className="student-name-row">
                <strong>{user?.firstName} {user?.lastName}</strong>
                <span className="student-id-badge">SN02112020{String(profile?.id || user?.id).padStart(4, '0')}</span>
              </div>
              <span className="student-role">Student</span>
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

                  <div className="profile-section">
                    <h3>Parent/Guardian Information</h3>
                    {isEditing ? (
                      <>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Parent/Guardian Name</label>
                            <input type="text" value={editForm.parentGuardianName} onChange={e => setEditForm({...editForm, parentGuardianName: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>Phone</label>
                            <input type="tel" value={editForm.parentGuardianPhone} onChange={e => setEditForm({...editForm, parentGuardianPhone: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={editForm.parentGuardianEmail} onChange={e => setEditForm({...editForm, parentGuardianEmail: e.target.value})} />
                          </div>
                          <div className="form-group">
                            <label>Relationship</label>
                            <select value={editForm.parentGuardianRelation} onChange={e => setEditForm({...editForm, parentGuardianRelation: e.target.value})}>
                              <option value="">Select</option>
                              <option value="Father">Father</option>
                              <option value="Mother">Mother</option>
                              <option value="Guardian">Guardian</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>Name:</span><strong>{profile?.parent_guardian_name || 'Not set'}</strong></div>
                        <div className="info-row"><span>Phone:</span><strong>{profile?.parent_guardian_phone || 'Not set'}</strong></div>
                        <div className="info-row"><span>Email:</span><strong>{profile?.parent_guardian_email || 'Not set'}</strong></div>
                        <div className="info-row"><span>Relationship:</span><strong>{profile?.parent_guardian_relation || 'Not set'}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="profile-section">
                    <h3>Qualification</h3>
                    {isEditing ? (
                      <div className="form-group">
                        <label>Educational Qualification</label>
                        <select value={editForm.qualification} onChange={e => setEditForm({...editForm, qualification: e.target.value})}>
                          <option value="">Select</option>
                          <option value="Student">Student</option>
                          <option value="High School">High School</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Graduate">Graduate</option>
                          <option value="Post Graduate">Post Graduate</option>
                          <option value="Professional">Professional</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>Qualification:</span><strong>{profile?.qualification || 'Not set'}</strong></div>
                      </div>
                    )}
                  </div>

                  <div className="profile-section">
                    <h3>ID Proof</h3>
                    {isEditing ? (
                      <div className="form-row">
                        <div className="form-group">
                          <label>ID Proof Type</label>
                          <select value={editForm.idProofType} onChange={e => setEditForm({...editForm, idProofType: e.target.value})}>
                            <option value="">Select</option>
                            <option value="Aadhaar Card">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="School ID">School ID</option>
                            <option value="Driving License">Driving License</option>
                            <option value="Voter ID">Voter ID</option>
                            <option value="PAN Card">PAN Card</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>ID Number</label>
                          <input type="text" value={editForm.idProofNumber} onChange={e => setEditForm({...editForm, idProofNumber: e.target.value})} placeholder="Enter ID number" />
                        </div>
                      </div>
                    ) : (
                      <div className="info-display">
                        <div className="info-row"><span>ID Type:</span><strong>{profile?.id_proof_type || 'Not set'}</strong></div>
                        <div className="info-row"><span>ID Number:</span><strong>{profile?.id_proof_number || 'Not set'}</strong></div>
                      </div>
                    )}
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
                  <p className="documents-info-note">📌 Documents can only be viewed, downloaded and deleted by administrators.</p>
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
                          <div className="doc-status">
                            <span className="uploaded-badge">✓ Uploaded</span>
                          </div>
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

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <div className="fees-content">
                <div className="content-header">
                  <h1>Fees & Payments</h1>
                  <button className="btn btn-secondary refresh-btn" onClick={loadData}>
                    🔄 Refresh
                  </button>
                </div>

                {/* Current Fee Card */}
                {currentFee && (
                  <div className="current-fee-section">
                    <h2>Current Month Fee - {currentFee.month} {currentFee.year}</h2>
                    <div className="fee-card highlight">
                      <div className="fee-info">
                        <div className="fee-amount">
                          <span className="label">Base Fee</span>
                          <span className="amount">{formatCurrency(currentFee.base_amount)}</span>
                        </div>
                        {currentFee.days_late > 0 && (
                          <div className="fee-penalty">
                            <span className="label">Late Penalty ({currentFee.days_late} days × ₹50)</span>
                            <span className="amount penalty">+{formatCurrency(currentFee.penalty_amount)}</span>
                          </div>
                        )}
                        <div className="fee-total">
                          <span className="label">Total Due</span>
                          <span className="amount total">{formatCurrency(currentFee.total_amount)}</span>
                        </div>
                        <div className="fee-due-date">
                          <span className="label">Due Date</span>
                          <span>{new Date(currentFee.due_date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="fee-status">
                        <span className={`status-badge ${currentFee.status}`}>
                          {currentFee.status === 'pending' && '⏳ Pending'}
                          {currentFee.status === 'uploaded' && '📤 Uploaded - Pending Verification'}
                          {currentFee.status === 'verified' && '✅ Verified'}
                          {currentFee.status === 'paid' && '✅ Paid'}
                          {currentFee.status === 'rejected' && '❌ Rejected'}
                        </span>
                      </div>

                      {(currentFee.status === 'pending' || currentFee.status === 'rejected') && (
                        <div className="payment-section">
                          <h4>Pay via QR Code</h4>
                          <div className="qr-section">
                            <div className="qr-placeholder">
                              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=dreamdance@paytm&pn=DreamDanceAcademy&am=${currentFee.total_amount}&cu=INR" alt="PayTM QR Code" />
                              <p>Scan to pay via PayTM/UPI</p>
                            </div>
                          </div>
                          
                          <div className="screenshot-upload">
                            <h4>Upload Payment Screenshot</h4>
                            <input
                              type="file"
                              ref={paymentInputRef}
                              accept="image/*"
                              onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                              hidden
                            />
                            <div className="upload-payment-area">
                              {paymentScreenshot ? (
                                <div className="file-selected">
                                  <span>📷 {paymentScreenshot.name}</span>
                                  <button className="btn btn-sm" onClick={() => setPaymentScreenshot(null)}>✕</button>
                                </div>
                              ) : (
                                <button 
                                  className="btn btn-secondary"
                                  onClick={() => paymentInputRef.current?.click()}
                                >
                                  📷 Select Screenshot
                                </button>
                              )}
                            </div>
                            <button
                              className="btn btn-primary submit-payment-btn"
                              onClick={handleFeePayment}
                              disabled={!paymentScreenshot || isPaymentUploading}
                            >
                              {isPaymentUploading ? 'Uploading...' : 'Submit Payment'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="fee-note">
                      ⚠️ Note: Late fee of ₹50 per day is applied after 2 days from the due date.
                    </p>
                  </div>
                )}

                {/* Fee History */}
                <div className="fee-history-section">
                  <h2>Payment History</h2>
                  {fees.length > 0 ? (
                    <div className="fee-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Base Fee</th>
                            <th>Penalty</th>
                            <th>Total</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fees.map((fee) => (
                            <tr key={fee.id}>
                              <td>{fee.month}</td>
                              <td>{fee.year}</td>
                              <td>{formatCurrency(fee.base_amount)}</td>
                              <td className={fee.penalty_amount > 0 ? 'penalty' : ''}>{formatCurrency(fee.penalty_amount || 0)}</td>
                              <td className="total">{formatCurrency(fee.total_amount)}</td>
                              <td>{fee.payment_method === 'cash' ? '💵 Cash' : fee.payment_method === 'online' ? '📱 Online' : '-'}</td>
                              <td>
                                <span className={`status-badge ${fee.status}`}>
                                  {fee.status === 'pending' && 'Pending'}
                                  {fee.status === 'uploaded' && 'Processing'}
                                  {fee.status === 'verified' && 'Verified'}
                                  {fee.status === 'paid' && 'Paid'}
                                  {fee.status === 'rejected' && 'Rejected'}
                                </span>
                              </td>
                              <td>{fee.payment_date ? new Date(fee.payment_date).toLocaleDateString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <span className="empty-icon">💰</span>
                      <h3>No Payment History</h3>
                      <p>Your payment history will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Certificates Tab */}
            {activeTab === 'certificates' && (
              <div className="certificates-content">
                <div className="content-header">
                  <h1>Certificates</h1>
                  <button className="btn btn-secondary refresh-btn" onClick={loadData}>
                    🔄 Refresh
                  </button>
                </div>

                {/* Eligibility Info */}
                <div className="eligibility-info">
                  {certificateData.isEligible ? (
                    <div className="eligible-badge">
                      ✅ You are eligible to apply for certificates!
                      <span>Enrolled for {certificateData.enrollmentDuration}+ year(s)</span>
                    </div>
                  ) : (
                    <div className="not-eligible-badge">
                      ⏳ Certificates are available after 1 year of enrollment.
                      <span>Time remaining: {Math.max(0, 12 - (certificateData.enrollmentDuration * 12))} months</span>
                    </div>
                  )}
                </div>

                {/* My Certificates */}
                <div className="my-certificates-section">
                  <h2>My Certificates</h2>
                  {certificates.length > 0 ? (
                    <div className="certificates-grid">
                      {certificates.map((cert) => (
                        <div key={cert.id} className={`certificate-card ${cert.status}`}>
                          <div className="cert-icon">
                            {cert.status === 'approved' ? '🏆' : cert.status === 'pending' ? '⏳' : '❌'}
                          </div>
                          <div className="cert-details">
                            <h4>{getCertificateName(cert.certificate_type)}</h4>
                            {cert.certificate_number && (
                              <span className="cert-number">#{cert.certificate_number}</span>
                            )}
                            <span className={`cert-status ${cert.status}`}>
                              {cert.status === 'approved' && 'Approved'}
                              {cert.status === 'pending' && 'Pending Approval'}
                              {cert.status === 'rejected' && 'Rejected'}
                            </span>
                            {cert.issue_date && (
                              <span className="cert-date">Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state small">
                      <span className="empty-icon">🏆</span>
                      <p>No certificates yet. Apply for your first certificate below!</p>
                    </div>
                  )}
                </div>

                {/* Apply for Certificate */}
                {certificateData.isEligible && !certificateData.hasPendingApplication && certificateData.nextAvailableCert && (
                  <div className="apply-certificate-section">
                    <h2>Apply for Certificate</h2>
                    <div className="next-cert-card">
                      <div className="cert-icon">🎯</div>
                      <div className="cert-info">
                        <h4>Next Available: {certificateData.nextAvailableCert.name}</h4>
                        <p>Complete your dance journey by earning this certificate!</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleApplyCertificate(certificateData.nextAvailableCert.type)}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                    
                    <div className="cert-warning">
                      <strong>⚠️ Important:</strong> If you apply for an advanced certificate without completing previous levels, all your previous certificates will be deleted.
                    </div>
                  </div>
                )}

                {certificateData.hasPendingApplication && (
                  <div className="pending-application-note">
                    📝 You have a pending certificate application. Please wait for admin approval before applying for another.
                  </div>
                )}

                {/* Certificate Progression */}
                <div className="certificate-progression">
                  <h2>Certificate Progression</h2>
                  <div className="progression-track">
                    {certificateData.allCertificateTypes.map((cert, index) => {
                      const earned = certificates.find(c => c.certificate_type === cert.type && c.status === 'approved')
                      const pending = certificates.find(c => c.certificate_type === cert.type && c.status === 'pending')
                      
                      return (
                        <div key={cert.type} className={`progression-step ${earned ? 'earned' : pending ? 'pending' : 'locked'}`}>
                          <div className="step-number">{index + 1}</div>
                          <div className="step-name">{cert.name}</div>
                          <div className="step-status">
                            {earned && '✅ Earned'}
                            {pending && '⏳ Pending'}
                            {!earned && !pending && '🔒 Locked'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
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
