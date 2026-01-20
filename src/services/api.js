const API_BASE = 'http://localhost:3001/api'

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
  
  getAllSchedules: () => apiCall('/admin/schedules')
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

export default { authAPI, adminAPI, studentAPI }
