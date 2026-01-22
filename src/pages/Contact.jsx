import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendContactEmail } from '../services/emailService'
import './Contact.css'

const Contact = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
                className="contact-info-card"
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
                      <option value="other">Pre Admission</option>
                      <option value="general">General Inquiry</option>
                      <option value="classes">Class Information</option>
                      <option value="enrollment">Enrollment</option>
                      <option value="trial">Book Trial Class</option>
                      <option value="events">Events & Performances</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
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
    </motion.div>
  )
}

export default Contact
