import emailjs from '@emailjs/browser'

// EmailJS Configuration
const SERVICE_ID = 'service_474qflp'
const PUBLIC_KEY = 'bIIYcksrOBmz4PFVB'
const TEMPLATE_ID = 'template_fkymuoe'

// Initialize EmailJS
emailjs.init(PUBLIC_KEY)

/**
 * Send contact form email
 * @param {Object} formData - Contact form data
 * @returns {Promise}
 */
export const sendContactEmail = async (formData) => {
  const templateParams = {
    name: formData.name,
    email: formData.email,
    title: `${formData.subject} - Contact Form`,
    message: `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject}

Message:
${formData.message}
    `.trim(),
    time: new Date().toLocaleString()
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    console.log('Contact email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send contact email:', error)
    throw error
  }
}

/**
 * Send enrollment confirmation email
 * @param {Object} formData - Enrollment form data
 * @returns {Promise}
 */
export const sendEnrollmentEmail = async (formData) => {
  const templateParams = {
    name: `${formData.firstName} ${formData.lastName}`,
    email: formData.email,
    title: 'New Enrollment Request',
    message: `
New Student Enrollment Request

Personal Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone || 'Not provided'}
- Date of Birth: ${formData.dateOfBirth || 'Not provided'}
- Gender: ${formData.gender || 'Not provided'}

Address:
- ${formData.address || 'Not provided'}
- ${formData.city || ''}, ${formData.state || ''} ${formData.zipCode || ''}

Dance Information:
- Dance Style: ${formData.danceStyle}
- Experience Level: ${formData.experienceLevel}
- Preferred Schedule: ${formData.preferredSchedule}
- Goals: ${formData.goals || 'Not specified'}

Emergency Contact:
- Name: ${formData.emergencyName || 'Not provided'}
- Phone: ${formData.emergencyPhone || 'Not provided'}
- Relation: ${formData.emergencyRelation || 'Not provided'}

Medical Information:
- Conditions: ${formData.medicalConditions || 'None'}
- Allergies: ${formData.allergies || 'None'}

How they heard about us: ${formData.howHeard || 'Not specified'}
Newsletter: ${formData.newsletter ? 'Yes' : 'No'}
    `.trim(),
    time: new Date().toLocaleString()
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    console.log('Enrollment email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send enrollment email:', error)
    throw error
  }
}

/**
 * Send generic notification email
 * @param {Object} params - Email parameters (name, email, title, message)
 * @returns {Promise}
 */
export const sendNotificationEmail = async (params) => {
  const templateParams = {
    name: params.name || 'System',
    email: params.email || 'noreply@dreamdanceacademy.in',
    title: params.title || 'Notification',
    message: params.message,
    time: new Date().toLocaleString()
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    console.log('Notification email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send notification email:', error)
    throw error
  }
}

/**
 * Send trial class scheduled email
 * @param {Object} params - Email parameters
 * @returns {Promise}
 */
export const sendTrialClassEmail = async (params) => {
  const templateParams = {
    name: params.name,
    email: params.email,
    title: 'Your Trial Class is Scheduled! 🎉',
    message: `
Dear ${params.name},

Great news! Your trial class at Dream Dance Academy has been scheduled.

📅 Trial Class Details:
- Date: ${params.trialDate}
- Time: ${params.trialTime}
- Dance Style: ${params.danceStyle || 'To be discussed'}
- Branch: ${params.branchName || 'Dream Dance Academy'}

What to bring:
- Comfortable clothes for movement
- Water bottle
- Positive energy! 💃

Location:
${params.branchAddress || 'Contact us for directions'}

If you need to reschedule, please contact us at:
📞 +91 98765 43210
✉️ info@dreamdanceacademy.in

We can't wait to see you dance!

Best regards,
Dream Dance Academy Team
    `.trim(),
    time: new Date().toLocaleString()
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    console.log('Trial class email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send trial class email:', error)
    throw error
  }
}

/**
 * Send admission success email with login credentials
 * @param {Object} params - Email parameters
 * @returns {Promise}
 */
export const sendAdmissionSuccessEmail = async (params) => {
  const templateParams = {
    name: params.name,
    email: params.email,
    title: 'Welcome to Dream Dance Academy! 🎊',
    message: `
Dear ${params.name},

Congratulations! Your admission to Dream Dance Academy has been approved! 🎉

Your Student Details:
━━━━━━━━━━━━━━━━━━━━━━━
🎫 Student ID: ${params.studentId}
📧 Login Email: ${params.email}
🔑 Temporary Password: ${params.password}
━━━━━━━━━━━━━━━━━━━━━━━

🌐 Student Portal Access:
Please login at: ${params.portalUrl || 'https://dreamdanceacademy.in/#/login'}

⚠️ Important: Please change your password after first login for security.

What's Next:
1. Log in to your student portal
2. Complete your profile
3. Check your class schedule
4. Start your dance journey!

Branch: ${params.branchName || 'Dream Dance Academy'}
Dance Style: ${params.danceStyle || 'Multiple styles available'}

Need Help?
📞 +91 98765 43210
✉️ info@dreamdanceacademy.in

Welcome to the Dream Dance family! Let's make your dance dreams come true! 💃🕺

Best regards,
Dream Dance Academy Team
    `.trim(),
    time: new Date().toLocaleString()
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )
    console.log('Admission success email sent successfully:', response)
    return { success: true, response }
  } catch (error) {
    console.error('Failed to send admission success email:', error)
    throw error
  }
}

export default {
  sendContactEmail,
  sendEnrollmentEmail,
  sendNotificationEmail,
  sendTrialClassEmail,
  sendAdmissionSuccessEmail
}
