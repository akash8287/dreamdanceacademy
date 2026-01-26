// Use relative URL in production, localhost in development
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api'

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }
  
  return data
}

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  
  getProfile: () => apiCall('/auth/me'),
  
  updatePassword: (currentPassword, newPassword) =>
    apiCall('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    })
}

// Admin APIs
export const adminAPI = {
  getStats: () => apiCall('/admin/stats'),
  
  getStudents: () => apiCall('/admin/students'),
  
  getStudent: (id) => apiCall(`/admin/students/${id}`),
  
  addStudent: (studentData) =>
    apiCall('/admin/students', {
      method: 'POST',
      body: JSON.stringify(studentData)
    }),
  
  updateStudent: (id, studentData) =>
    apiCall(`/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData)
    }),
  
  deleteStudent: (id) =>
    apiCall(`/admin/students/${id}`, { method: 'DELETE' }),
  
  pauseStudent: (id, reason) =>
    apiCall(`/admin/students/${id}/pause`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),
  
  unpauseStudent: (id) =>
    apiCall(`/admin/students/${id}/unpause`, { method: 'POST' }),
  
  getStudentSchedules: (studentId) =>
    apiCall(`/admin/students/${studentId}/schedules`),
  
  addSchedule: (studentId, scheduleData) =>
    apiCall(`/admin/students/${studentId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    }),
  
  updateSchedule: (scheduleId, scheduleData) =>
    apiCall(`/admin/schedules/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData)
    }),
  
  deleteSchedule: (scheduleId) =>
    apiCall(`/admin/schedules/${scheduleId}`, { method: 'DELETE' }),
  
  getClasses: () => apiCall('/admin/classes'),
  
  getAllSchedules: () => apiCall('/admin/schedules'),
  
  // Document management (Admin only)
  viewDocument: (id) => {
    const token = localStorage.getItem('token')
    window.open(`${API_BASE}/admin/documents/${id}/file?token=${token}`, '_blank')
  },
  
  downloadDocument: async (id, fileName) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/admin/documents/${id}/file?download=true`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error('Failed to download document')
    }
  },
  
  deleteDocument: (id) =>
    apiCall(`/admin/documents/${id}`, { method: 'DELETE' })
}

// Student APIs
export const studentAPI = {
  getProfile: () => apiCall('/student/profile'),
  
  updateProfile: (profileData) =>
    apiCall('/student/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
  
  getSchedule: () => apiCall('/student/schedule'),
  
  getDocuments: () => apiCall('/student/documents'),
  
  uploadDocument: async (file, documentType) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('document', file)
    formData.append('documentType', documentType)
    
    const response = await fetch(`${API_BASE}/student/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
    
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }
    return data
  },
  
  deleteDocument: (id) =>
    apiCall(`/student/documents/${id}`, { method: 'DELETE' }),
  
  viewDocument: (id) => {
    const token = localStorage.getItem('token')
    window.open(`${API_BASE}/student/documents/${id}/file?token=${token}`, '_blank')
  },
  
  downloadDocument: async (id, fileName) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API_BASE}/student/documents/${id}/file?download=true`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!response.ok) throw new Error('Download failed')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw new Error('Failed to download document')
    }
  },
  
  uploadProfileImage: async (file) => {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch(`${API_BASE}/student/profile-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })
    
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }
    return data
  },
  
  getClasses: () => apiCall('/student/classes')
}

// Pre-admission APIs
export const preadmissionAPI = {
  // OTP
  sendOTP: (identifier, purpose) =>
    apiCall('/preadmission/send-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, purpose })
    }),
  
  verifyOTP: (identifier, otp, purpose) =>
    apiCall('/preadmission/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp, purpose })
    }),
  
  // Branches
  getBranches: () => apiCall('/preadmission/branches'),
  
  // Trial Application
  submitTrialApplication: async (formData, idProofFile) => {
    const token = localStorage.getItem('token')
    const data = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key])
      }
    })
    
    if (idProofFile) {
      data.append('idProofDocument', idProofFile)
    }
    
    const response = await fetch(`${API_BASE}/preadmission/trial-application`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data
    })
    
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Submission failed')
    }
    return result
  },
  
  // Full Admission Application
  submitAdmissionApplication: async (formData, idProofFile, paymentScreenshot) => {
    const token = localStorage.getItem('token')
    const data = new FormData()
    
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key])
      }
    })
    
    if (idProofFile) {
      data.append('idProofDocument', idProofFile)
    }
    if (paymentScreenshot) {
      data.append('paymentScreenshot', paymentScreenshot)
    }
    
    const response = await fetch(`${API_BASE}/preadmission/admission-application`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: data
    })
    
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Submission failed')
    }
    return result
  },
  
  // Upload payment screenshot
  uploadPaymentScreenshot: async (applicationId, file) => {
    const data = new FormData()
    data.append('paymentScreenshot', file)
    
    const response = await fetch(`${API_BASE}/preadmission/upload-payment/${applicationId}`, {
      method: 'POST',
      body: data
    })
    
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Upload failed')
    }
    return result
  },
  
  // Check application status
  checkApplicationStatus: (email) =>
    apiCall(`/preadmission/application-status/${email}`),
  
  // Admin functions
  getApplications: (status, type) => {
    let url = '/preadmission/applications'
    const params = []
    if (status) params.push(`status=${status}`)
    if (type) params.push(`type=${type}`)
    if (params.length) url += '?' + params.join('&')
    return apiCall(url)
  },
  
  getApplication: (id) => apiCall(`/preadmission/applications/${id}`),
  
  viewApplicationDocument: (id, type) => {
    const token = localStorage.getItem('token')
    window.open(`${API_BASE}/preadmission/applications/${id}/document/${type}?token=${token}`, '_blank')
  },
  
  approveTrial: (id, trialClassDate, trialClassTime, adminNotes) =>
    apiCall(`/preadmission/applications/${id}/approve-trial`, {
      method: 'POST',
      body: JSON.stringify({ trialClassDate, trialClassTime, adminNotes })
    }),
  
  approveAdmission: (id, adminNotes) =>
    apiCall(`/preadmission/applications/${id}/approve-admission`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes })
    }),
  
  rejectApplication: (id, adminNotes) =>
    apiCall(`/preadmission/applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes })
    }),
  
  verifyPayment: (id, status) =>
    apiCall(`/preadmission/applications/${id}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify({ status })
    }),
  
  // Admin branch management
  addBranch: (branchData) =>
    apiCall('/preadmission/branches', {
      method: 'POST',
      body: JSON.stringify(branchData)
    }),
  
  updateBranch: (id, branchData) =>
    apiCall(`/preadmission/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(branchData)
    })
}

// Fees & Certificates APIs
export const feesAPI = {
  // Student fee routes
  getMyFees: () => apiCall('/fees/my-fees'),
  
  payFee: async (month, year, screenshot) => {
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('month', month)
    data.append('year', year)
    data.append('screenshot', screenshot)
    
    const response = await fetch(`${API_BASE}/fees/pay`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    })
    
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.error || 'Payment failed')
    }
    return result
  },
  
  // Student certificate routes
  getMyCertificates: () => apiCall('/fees/my-certificates'),
  
  applyCertificate: (certificateType) =>
    apiCall('/fees/apply-certificate', {
      method: 'POST',
      body: JSON.stringify({ certificateType })
    }),
  
  // Admin fee routes
  getAllFees: (status, month, year) => {
    let url = '/fees/all-fees'
    const params = []
    if (status) params.push(`status=${status}`)
    if (month) params.push(`month=${month}`)
    if (year) params.push(`year=${year}`)
    if (params.length) url += '?' + params.join('&')
    return apiCall(url)
  },
  
  viewPaymentScreenshot: (id) => {
    const token = localStorage.getItem('token')
    window.open(`${API_BASE}/fees/payment-screenshot/${id}?token=${token}`, '_blank')
  },
  
  verifyPayment: (id, status, adminNotes) =>
    apiCall(`/fees/verify-payment/${id}`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes })
    }),
  
  recordCashPayment: (userId, month, year, amount, adminNotes) =>
    apiCall(`/fees/cash-payment/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ month, year, amount, adminNotes })
    }),
  
  generateFees: (month, year) =>
    apiCall('/fees/generate-fees', {
      method: 'POST',
      body: JSON.stringify({ month, year })
    }),
  
  // Admin certificate routes
  getAllCertificates: (status) => {
    let url = '/fees/all-certificates'
    if (status) url += `?status=${status}`
    return apiCall(url)
  },
  
  certificateAction: (id, action, adminNotes) =>
    apiCall(`/fees/certificate-action/${id}`, {
      method: 'POST',
      body: JSON.stringify({ action, adminNotes })
    }),
  
  // Meeting booking
  bookMeeting: (data) =>
    apiCall('/fees/book-meeting', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  // Admin meetings
  getMeetings: (status) => {
    let url = '/fees/meetings'
    if (status) url += `?status=${status}`
    return apiCall(url)
  },
  
  meetingAction: (id, status, adminNotes) =>
    apiCall(`/fees/meeting-action/${id}`, {
      method: 'POST',
      body: JSON.stringify({ status, adminNotes })
    })
}

export default { authAPI, adminAPI, studentAPI, preadmissionAPI, feesAPI }
