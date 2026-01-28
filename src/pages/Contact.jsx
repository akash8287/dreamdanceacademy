import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { sendContactEmail } from '../services/emailService'
import { feesAPI } from '../services/api'
import './Contact.css'

// Import QR code
import qrCodeImage from '../../assets/qr.jpeg'

const Contact = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Meeting booking state
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const [meetingForm, setMeetingForm] = useState({
    name: '',
    email: '',
    phone: '',
    purpose: '',
    preferredDate: '',
    preferredTime: ''
  })
  const [meetingSubmitting, setMeetingSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Redirect to pre-admission page if "Book Trial Class" is selected
    if (name === 'subject' && value === 'trial') {
      navigate('/apply')
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle URL query params for direct navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('action') === 'meeting') {
      setShowMeetingModal(true)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    
    try {
      // Send email using EmailJS
      await sendContactEmail(formData)
      
      setSubmitStatus('success')
      
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    } catch (error) {
      console.error('Failed to send email:', error)
      setSubmitStatus('error')
      setErrorMessage('Failed to send message. Please try again or contact us directly.')
      setTimeout(() => setSubmitStatus(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: ['Bawana Road, Pehladpur', 'Near by Maan Medical', 'Delhi'],
      action: { text: 'Get Directions', link: 'https://maps.google.com' }
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: ['+91 7065910907', '+91 9319205425'],
      action: { text: 'Call Now', link: 'tel:+917065910907' }
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: ['dreamdanceacademy28@gmail.com'],
      action: { text: 'Send Email', link: 'mailto:dreamdanceacademy28@gmail.com' }
    },
    {
      icon: '🌐',
      title: 'Website',
      details: ['www.dreamdanceacademy.in', 'Private & Online Classes Available'],
      action: null
    },
    {
      icon: '📱',
      title: 'Scan QR Code',
      details: ['Connect with us instantly'],
      action: null,
      isQR: true
    }
  ]

  const faqs = [
    {
      question: 'Do I need prior dance experience?',
      answer: 'Not at all! We have classes for complete beginners as well as advanced dancers. Our instructors will help you find the right level.'
    },
    {
      question: 'What should I wear to class?',
      answer: 'Comfortable clothing that allows you to move freely. Specific footwear requirements vary by class style - ballet requires ballet slippers, etc.'
    },
    {
      question: 'Can I try a class before enrolling?',
      answer: 'Yes! We offer a free trial class for new students. Contact us to schedule your trial.'
    },
    {
      question: 'What age groups do you teach?',
      answer: 'We have classes for all ages starting from 4 years old. Our kids, teen, and adult programs cater to different age groups.'
    }
  ]

  return (
    <motion.div 
      className="page contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="contact-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Contact Us</span>
            <h1>Let's <span className="highlight">Connect</span></h1>
            <p>Have questions? We'd love to hear from you. Reach out and let's start a conversation about your dance journey.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                className={`contact-info-card ${item.isQR ? 'qr-card' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <span className="info-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                {item.details.map((detail, i) => (
                  <p key={i}>{detail}</p>
                ))}
                {item.isQR && (
                  <div className="contact-qr-wrapper">
                    <img src={qrCodeImage} alt="Dream Dance Academy QR Code" className="contact-qr-img" />
                  </div>
                )}
                {item.action && (
                  <a href={item.action.link} className="info-action">
                    {item.action.text} →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="section contact-form-section">
        <div className="container">
          <div className="contact-form-grid">
            <motion.div 
              className="form-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Get in Touch</span>
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you within 24 hours. Whether you have questions about classes, schedules, or enrollment, we're here to help.</p>
              
              <div className="form-features">
                <div className="form-feature">
                  <span className="feature-icon">⚡</span>
                  <div>
                    <strong>Quick Response</strong>
                    <p>Usually within 24 hours</p>
                  </div>
                </div>
                <div className="form-feature">
                  <span className="feature-icon">🎯</span>
                  <div>
                    <strong>Personalized Guidance</strong>
                    <p>Tailored recommendations</p>
                  </div>
                </div>
                <div className="form-feature">
                  <span className="feature-icon">🆓</span>
                  <div>
                    <strong>Free Consultation</strong>
                    <p>No obligations</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="form-wrapper"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {submitStatus === 'success' && (
                <div className="message message-success">
                  ✓ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="message message-error">
                  ✗ {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="trial">🎯 Book Trial Class (Pre-Admission)</option>
                      <option value="meeting">📋 Meeting with Owner</option>
                      <option value="general">General Inquiry</option>
                      <option value="classes">Class Information</option>
                      <option value="enrollment">Enrollment</option>
                      <option value="events">Events & Performances</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {formData.subject === 'meeting' && (
                      <button 
                        type="button" 
                        className="btn btn-secondary schedule-meeting-btn"
                        onClick={() => setShowMeetingModal(true)}
                      >
                        📋 Schedule Meeting with Owner
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    rows="5"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section section-dark faq-section">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="map-placeholder">
          <div className="map-content">
            <span className="map-icon">📍</span>
            <h3>Find Us Here</h3>
            <p>Bawana Road, Pehladpur, Near by Maan Medical, Delhi</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-gold">Open in Google Maps</a>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section quick-actions-section">
        <div className="container">
          <div className="quick-actions-grid">
            <motion.div 
              className="quick-action-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => navigate('/apply')}
            >
              <span className="action-icon">🎯</span>
              <h3>Book Trial Class</h3>
              <p>Experience a free trial class before enrolling</p>
              <span className="action-arrow">→</span>
            </motion.div>
            <motion.div 
              className="quick-action-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={() => setShowMeetingModal(true)}
            >
              <span className="action-icon">📋</span>
              <h3>Meeting with Owner</h3>
              <p>Book a time slot to meet with our academy head</p>
              <span className="action-arrow">→</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meeting Booking Modal */}
      {showMeetingModal && (
        <div className="modal-overlay" onClick={() => setShowMeetingModal(false)}>
          <motion.div 
            className="meeting-modal"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="modal-header">
              <h2>📋 Schedule Meeting with Owner</h2>
              <button className="close-btn" onClick={() => setShowMeetingModal(false)}>×</button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault()
              setMeetingSubmitting(true)
              try {
                await feesAPI.bookMeeting(meetingForm)
                setSubmitStatus('meeting_success')
                setShowMeetingModal(false)
                setMeetingForm({ name: '', email: '', phone: '', purpose: '', preferredDate: '', preferredTime: '' })
                setTimeout(() => setSubmitStatus(null), 5000)
              } catch (err) {
                setErrorMessage(err.message || 'Failed to book meeting')
                setSubmitStatus('error')
              } finally {
                setMeetingSubmitting(false)
              }
            }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text" 
                    value={meetingForm.name}
                    onChange={e => setMeetingForm({...meetingForm, name: e.target.value})}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input 
                    type="tel" 
                    value={meetingForm.phone}
                    onChange={e => setMeetingForm({...meetingForm, phone: e.target.value})}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={meetingForm.email}
                  onChange={e => setMeetingForm({...meetingForm, email: e.target.value})}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input 
                    type="date" 
                    value={meetingForm.preferredDate}
                    onChange={e => setMeetingForm({...meetingForm, preferredDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <select 
                    value={meetingForm.preferredTime}
                    onChange={e => setMeetingForm({...meetingForm, preferredTime: e.target.value})}
                    required
                  >
                    <option value="">Select time slot</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Purpose of Meeting</label>
                <textarea 
                  value={meetingForm.purpose}
                  onChange={e => setMeetingForm({...meetingForm, purpose: e.target.value})}
                  placeholder="Brief description of what you'd like to discuss..."
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMeetingModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={meetingSubmitting}>
                  {meetingSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Meeting Success Message */}
      {submitStatus === 'meeting_success' && (
        <div className="floating-message success">
          ✓ Meeting request submitted successfully! We'll confirm your appointment soon.
        </div>
      )}
    </motion.div>
  )
}

export default Contact
