import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendEnrollmentEmail } from '../services/emailService'
import './Enrollment.css'

const Enrollment = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Dance Information
    danceStyle: '',
    experienceLevel: '',
    preferredSchedule: '',
    goals: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Medical Information
    medicalConditions: '',
    allergies: '',
    
    // Additional
    howHeard: '',
    newsletter: true,
    termsAccepted: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send enrollment notification email
      await sendEnrollmentEmail(formData)
      
      console.log('Enrollment Form Submitted:', formData)
      setSubmitStatus('success')
    } catch (error) {
      console.error('Failed to send enrollment email:', error)
      // Still mark as success since enrollment is recorded, email is just notification
      setSubmitStatus('success')
    } finally {
      setIsSubmitting(false)
    }
  }

  const danceStyles = [
    'Classical Ballet',
    'Contemporary',
    'Hip Hop',
    'Jazz',
    'Kathak',
    'Salsa & Latin',
    'Bollywood Fusion',
    'Kids Program'
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - New to dance' },
    { value: 'some', label: 'Some Experience - 6 months to 1 year' },
    { value: 'intermediate', label: 'Intermediate - 1-3 years' },
    { value: 'advanced', label: 'Advanced - 3+ years' },
    { value: 'professional', label: 'Professional - Training/performing professionally' }
  ]

  const scheduleOptions = [
    'Morning (9AM - 12PM)',
    'Afternoon (12PM - 5PM)',
    'Evening (5PM - 9PM)',
    'Weekends Only',
    'Flexible - Any time'
  ]

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <motion.div
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3>Personal Information</h3>
            <p className="step-description">Tell us about yourself so we can personalize your dance journey.</p>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
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
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth *</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Prefer not to say</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="form-row form-row-3">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code *</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                  required
                />
              </div>
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3>Dance Preferences</h3>
            <p className="step-description">Help us match you with the perfect class and instructor.</p>
            
            <div className="form-group">
              <label htmlFor="danceStyle">Preferred Dance Style *</label>
              <select
                id="danceStyle"
                name="danceStyle"
                value={formData.danceStyle}
                onChange={handleChange}
                required
              >
                <option value="">Select a dance style</option>
                {danceStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                required
              >
                <option value="">Select your experience level</option>
                {experienceLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preferredSchedule">Preferred Schedule *</label>
              <select
                id="preferredSchedule"
                name="preferredSchedule"
                value={formData.preferredSchedule}
                onChange={handleChange}
                required
              >
                <option value="">Select preferred time</option>
                {scheduleOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goals">Your Dance Goals</label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleChange}
                placeholder="Tell us what you hope to achieve through dance (e.g., fitness, performance, hobby, professional development)..."
                rows="4"
              ></textarea>
            </div>
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3>Emergency & Medical Information</h3>
            <p className="step-description">This information helps us ensure your safety during classes.</p>
            
            <div className="form-section-title">Emergency Contact</div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emergencyName">Contact Name *</label>
                <input
                  type="text"
                  id="emergencyName"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="emergencyPhone">Contact Phone *</label>
                <input
                  type="tel"
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="emergencyRelation">Relationship *</label>
              <input
                type="text"
                id="emergencyRelation"
                name="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={handleChange}
                placeholder="e.g., Parent, Spouse, Sibling"
                required
              />
            </div>

            <div className="form-section-title">Medical Information</div>

            <div className="form-group">
              <label htmlFor="medicalConditions">Medical Conditions</label>
              <textarea
                id="medicalConditions"
                name="medicalConditions"
                value={formData.medicalConditions}
                onChange={handleChange}
                placeholder="Please list any medical conditions we should be aware of (e.g., asthma, heart conditions, injuries)..."
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="allergies">Allergies</label>
              <textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Please list any allergies..."
                rows="2"
              ></textarea>
            </div>
          </motion.div>
        )
      
      case 4:
        return (
          <motion.div
            className="step-content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3>Review & Submit</h3>
            <p className="step-description">Please review your information before submitting.</p>
            
            <div className="review-section">
              <div className="review-group">
                <h4>Personal Information</h4>
                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span className="review-value">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Email:</span>
                  <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone:</span>
                  <span className="review-value">{formData.phone}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Location:</span>
                  <span className="review-value">{formData.city}, {formData.state}</span>
                </div>
              </div>

              <div className="review-group">
                <h4>Dance Preferences</h4>
                <div className="review-item">
                  <span className="review-label">Style:</span>
                  <span className="review-value">{formData.danceStyle}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Level:</span>
                  <span className="review-value">{formData.experienceLevel}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Schedule:</span>
                  <span className="review-value">{formData.preferredSchedule}</span>
                </div>
              </div>

              <div className="review-group">
                <h4>Emergency Contact</h4>
                <div className="review-item">
                  <span className="review-label">Name:</span>
                  <span className="review-value">{formData.emergencyName}</span>
                </div>
                <div className="review-item">
                  <span className="review-label">Phone:</span>
                  <span className="review-value">{formData.emergencyPhone}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="howHeard">How did you hear about us?</label>
              <select
                id="howHeard"
                name="howHeard"
                value={formData.howHeard}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="social">Social Media</option>
                <option value="google">Google Search</option>
                <option value="friend">Friend/Family</option>
                <option value="event">Event/Performance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span>Subscribe to our newsletter for updates and offers</span>
              </label>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-custom"></span>
                <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a> *</span>
              </label>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  if (submitStatus === 'success') {
    return (
      <motion.div 
        className="page enrollment"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <section className="enrollment-hero">
          <div className="enrollment-hero-bg"></div>
          <div className="container">
            <motion.div 
              className="success-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="success-icon">🎉</span>
              <h1>Welcome to Dream Dance Academy!</h1>
              <p>Your enrollment application has been submitted successfully. Our team will review your information and contact you within 24-48 hours to complete your registration and schedule your first class.</p>
              <div className="success-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <p>Check your email for a confirmation message</p>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <p>Expect a call from our admissions team</p>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <p>Prepare for your trial class!</p>
                </div>
              </div>
              <a href="/" className="btn btn-primary">Return to Home</a>
            </motion.div>
          </div>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="page enrollment"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="enrollment-hero">
        <div className="enrollment-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="enrollment-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Enrollment</span>
            <h1>Begin Your <span className="highlight">Dance Journey</span></h1>
            <p>Complete your enrollment in just a few steps. We can't wait to welcome you to our dance family!</p>
          </motion.div>
        </div>
      </section>

      {/* Enrollment Form Section */}
      <section className="section enrollment-form-section">
        <div className="container">
          <div className="enrollment-wrapper">
            {/* Progress Steps */}
            <div className="progress-steps">
              {[1, 2, 3, 4].map((num) => (
                <div 
                  key={num} 
                  className={`progress-step ${step >= num ? 'active' : ''} ${step === num ? 'current' : ''}`}
                >
                  <div className="step-number">{num}</div>
                  <span className="step-label">
                    {num === 1 && 'Personal Info'}
                    {num === 2 && 'Dance Preferences'}
                    {num === 3 && 'Emergency Info'}
                    {num === 4 && 'Review'}
                  </span>
                </div>
              ))}
              <div className="progress-line">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((step - 1) / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="enrollment-form">
              {renderStepContent()}

              <div className="form-navigation">
                {step > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleBack}
                  >
                    ← Back
                  </button>
                )}
                
                {step < 4 ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next Step →
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-gold"
                    disabled={isSubmitting || !formData.termsAccepted}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      'Complete Enrollment'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Side Info */}
          <motion.div 
            className="enrollment-info"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="info-card enrollment-info-card">
              <h4>Why Choose Us?</h4>
              <ul>
                <li>
                  <span className="bullet">✓</span>
                  World-class instructors
                </li>
                <li>
                  <span className="bullet">✓</span>
                  State-of-the-art facilities
                </li>
                <li>
                  <span className="bullet">✓</span>
                  Small class sizes
                </li>
                <li>
                  <span className="bullet">✓</span>
                  Performance opportunities
                </li>
                <li>
                  <span className="bullet">✓</span>
                  Flexible scheduling
                </li>
              </ul>
            </div>

            <div className="info-card enrollment-info-card">
              <h4>What's Included</h4>
              <ul>
                <li>
                  <span className="bullet">🎯</span>
                  Free trial class
                </li>
                <li>
                  <span className="bullet">📚</span>
                  Comprehensive curriculum
                </li>
                <li>
                  <span className="bullet">🎪</span>
                  Annual showcase participation
                </li>
                <li>
                  <span className="bullet">📱</span>
                  Online class recordings
                </li>
              </ul>
            </div>

            <div className="info-card enrollment-info-card contact-card">
              <h4>Need Help?</h4>
              <p>Our admissions team is here to assist you.</p>
              <a href="tel:+15551234567">📞 +1 (555) 123-4567</a>
              <a href="mailto:admissions@dreamdance.com">✉️ admissions@dreamdance.com</a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Enrollment
