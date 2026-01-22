import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { preadmissionAPI } from '../services/api'
import './PreAdmission.css'

// PayTM QR Code - Replace with actual QR image
import paytmQR from '../../assets/logo.jpeg' // Placeholder - replace with actual PayTM QR

const PreAdmission = () => {
  const [applicationType, setApplicationType] = useState(null) // 'trial' or 'admission'
  const [step, setStep] = useState(1)
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // OTP States
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  
  // File states
  const [idProofFile, setIdProofFile] = useState(null)
  const [paymentScreenshot, setPaymentScreenshot] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    branchId: '',
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    idProofType: '',
    idProofNumber: '',
    danceStyle: '',
    experienceLevel: '',
    parentGuardianName: '',
    parentGuardianPhone: '',
    parentGuardianRelation: '',
    paymentAmount: '2000'
  })

  const idProofTypes = [
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'voter_id', label: 'Voter ID' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'birth_certificate', label: 'Birth Certificate' }
  ]

  const danceStyles = [
    'Kathak', 'Contemporary', 'Hip Hop', 'Zumba', 'Bollywood', 
    'Folk Dance', 'Semi-Classical', 'Western', 'Jazz', 'Kids Dance'
  ]

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner - New to dance' },
    { value: 'some', label: 'Some Experience - 6 months to 1 year' },
    { value: 'intermediate', label: 'Intermediate - 1-3 years' },
    { value: 'advanced', label: 'Advanced - 3+ years' }
  ]

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const data = await preadmissionAPI.getBranches()
      setBranches(data)
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, branchId: data[0].id }))
      }
    } catch (err) {
      console.error('Failed to load branches:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  // OTP Functions
  const handleSendOTP = async () => {
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    
    setOtpLoading(true)
    setError('')
    
    try {
      const result = await preadmissionAPI.sendOTP(formData.phone, 'preadmission')
      setOtpSent(true)
      setSuccess('OTP sent to your phone number')
      // For testing - remove in production
      if (result.otp) {
        console.log('Test OTP:', result.otp)
        alert(`Test OTP: ${result.otp}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    
    setOtpLoading(true)
    setError('')
    
    try {
      await preadmissionAPI.verifyOTP(formData.phone, otp, 'preadmission')
      setOtpVerified(true)
      setSuccess('Phone number verified successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setOtpLoading(false)
    }
  }

  const handleNext = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.email) {
        setError('Please fill all required fields')
        return
      }
      if (!otpVerified) {
        setError('Please verify your phone number with OTP')
        return
      }
    }
    
    if (step === 2 && applicationType === 'admission') {
      if (!formData.idProofType || !formData.idProofNumber) {
        setError('Please provide ID proof details')
        return
      }
      if (!idProofFile) {
        setError('Please upload ID proof document')
        return
      }
    }
    
    setError('')
    setStep(step + 1)
  }

  const handleBack = () => {
    setError('')
    setStep(step - 1)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB')
        return
      }
      if (type === 'idproof') {
        setIdProofFile(file)
      } else if (type === 'payment') {
        setPaymentScreenshot(file)
      }
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (applicationType === 'trial') {
        await preadmissionAPI.submitTrialApplication(formData, idProofFile)
        setSuccess('Trial application submitted successfully! We will contact you to schedule your trial class.')
      } else {
        if (!paymentScreenshot) {
          setError('Please upload payment screenshot')
          setLoading(false)
          return
        }
        await preadmissionAPI.submitAdmissionApplication(formData, idProofFile, paymentScreenshot)
        setSuccess('Admission application submitted successfully! We will review and get back to you within 24-48 hours.')
      }
      setStep(99) // Success state
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Type Selection Screen
  if (!applicationType) {
    return (
      <motion.div 
        className="page preadmission"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="preadmission-hero">
          <div className="preadmission-hero-bg"></div>
          <div className="container">
            <motion.div 
              className="preadmission-hero-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="page-label">Get Started</span>
              <h1>Join <span className="highlight">Dream Dance Academy</span></h1>
              <p>Choose how you'd like to begin your dance journey with us.</p>
            </motion.div>
          </div>
        </section>

        <section className="section type-selection-section">
          <div className="container">
            <div className="type-cards">
              <motion.div 
                className="type-card trial-card"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => setApplicationType('trial')}
              >
                <div className="type-icon">🎯</div>
                <h2>Free Trial Class</h2>
                <p>Experience our academy with a complimentary trial session. No commitment required.</p>
                <ul>
                  <li>✓ One free class session</li>
                  <li>✓ Meet our instructors</li>
                  <li>✓ Explore dance styles</li>
                  <li>✓ No payment needed</li>
                </ul>
                <button className="btn btn-secondary">Start Trial →</button>
              </motion.div>

              <motion.div 
                className="type-card admission-card"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setApplicationType('admission')}
              >
                <div className="type-icon">🌟</div>
                <h2>Full Admission</h2>
                <p>Ready to commit? Apply for full admission and get your student ID instantly upon approval.</p>
                <ul>
                  <li>✓ Complete enrollment</li>
                  <li>✓ Get Student ID</li>
                  <li>✓ Access all classes</li>
                  <li>✓ Secure your spot</li>
                </ul>
                <button className="btn btn-gold">Apply Now →</button>
              </motion.div>
            </div>
          </div>
        </section>
      </motion.div>
    )
  }

  // Success Screen
  if (step === 99) {
    return (
      <motion.div 
        className="page preadmission"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <section className="preadmission-hero success-hero">
          <div className="preadmission-hero-bg"></div>
          <div className="container">
            <motion.div 
              className="success-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="success-icon">🎉</span>
              <h1>Application Submitted!</h1>
              <p>{success}</p>
              <div className="success-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <p>Check your email for confirmation</p>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <p>We'll call you within 24-48 hours</p>
                </div>
                {applicationType === 'trial' && (
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <p>Trial class date will be shared soon</p>
                  </div>
                )}
                {applicationType === 'admission' && (
                  <div className="detail-item">
                    <span className="detail-icon">🎫</span>
                    <p>Student ID will be shared after approval</p>
                  </div>
                )}
              </div>
              <a href="/" className="btn btn-primary">Return to Home</a>
            </motion.div>
          </div>
        </section>
      </motion.div>
    )
  }

  // Total steps based on application type
  const totalSteps = applicationType === 'trial' ? 2 : 4

  return (
    <motion.div 
      className="page preadmission"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="preadmission-hero">
        <div className="preadmission-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="preadmission-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="page-label">
              {applicationType === 'trial' ? 'Trial Registration' : 'Pre-Admission'}
            </span>
            <h1>{applicationType === 'trial' ? 'Book Your Trial Class' : 'Apply for Admission'}</h1>
            <p>Complete the form below to {applicationType === 'trial' ? 'schedule your free trial' : 'submit your admission application'}.</p>
          </motion.div>
        </div>
      </section>

      <section className="section preadmission-form-section">
        <div className="container">
          <div className="preadmission-wrapper">
            {/* Progress Steps */}
            <div className="progress-steps">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i} 
                  className={`progress-step ${step >= i + 1 ? 'active' : ''} ${step === i + 1 ? 'current' : ''}`}
                >
                  <div className="step-number">{i + 1}</div>
                  <span className="step-label">
                    {applicationType === 'trial' ? (
                      i === 0 ? 'Personal Info' : 'Dance Preferences'
                    ) : (
                      i === 0 ? 'Personal Info' : i === 1 ? 'ID Verification' : i === 2 ? 'Payment' : 'Review'
                    )}
                  </span>
                </div>
              ))}
              <div className="progress-line">
                <div className="progress-fill" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && <div className="alert alert-error">{error}</div>}
            {success && step !== 99 && <div className="alert alert-success">{success}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="preadmission-form">
              
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  className="step-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>Personal Information</h3>
                  <p className="step-description">Tell us about yourself.</p>
                  
                  {/* Branch Selection */}
                  {branches.length > 1 && (
                    <div className="form-group">
                      <label>Select Branch *</label>
                      <select name="branchId" value={formData.branchId} onChange={handleChange} required>
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" required />
                    </div>
                    <div className="form-group">
                      <label>Last Name *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Age *</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" min="3" max="100" required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                    </div>
                  </div>

                  {/* Phone with OTP */}
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <div className="phone-otp-row">
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="+91 98765 43210" 
                        disabled={otpVerified}
                        required 
                      />
                      {!otpVerified && (
                        <button 
                          type="button" 
                          className={`btn ${otpSent ? 'btn-secondary' : 'btn-primary'} otp-btn`}
                          onClick={handleSendOTP}
                          disabled={otpLoading || !formData.phone}
                        >
                          {otpLoading ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                      )}
                      {otpVerified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </div>

                  {/* OTP Input */}
                  {otpSent && !otpVerified && (
                    <div className="form-group otp-input-group">
                      <label>Enter OTP</label>
                      <div className="phone-otp-row">
                        <input 
                          type="text" 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP" 
                          maxLength={6}
                        />
                        <button 
                          type="button" 
                          className="btn btn-gold otp-btn"
                          onClick={handleVerifyOTP}
                          disabled={otpLoading || otp.length !== 6}
                        >
                          {otpLoading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" />
                  </div>

                  <div className="form-row form-row-3">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
                    </div>
                    <div className="form-group">
                      <label>ZIP Code</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="ZIP" />
                    </div>
                  </div>

                  {/* Parent/Guardian Info */}
                  <div className="form-section-title">Parent/Guardian Information</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Guardian Name</label>
                      <input type="text" name="parentGuardianName" value={formData.parentGuardianName} onChange={handleChange} placeholder="Full name" />
                    </div>
                    <div className="form-group">
                      <label>Guardian Phone</label>
                      <input type="tel" name="parentGuardianPhone" value={formData.parentGuardianPhone} onChange={handleChange} placeholder="Phone number" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <select name="parentGuardianRelation" value={formData.parentGuardianRelation} onChange={handleChange}>
                      <option value="">Select relationship</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Step 2 for Trial: Dance Preferences */}
              {step === 2 && applicationType === 'trial' && (
                <motion.div
                  className="step-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>Dance Preferences</h3>
                  <p className="step-description">Help us prepare for your trial class.</p>
                  
                  <div className="form-group">
                    <label>Preferred Dance Style *</label>
                    <select name="danceStyle" value={formData.danceStyle} onChange={handleChange} required>
                      <option value="">Select a style</option>
                      {danceStyles.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Experience Level *</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} required>
                      <option value="">Select level</option>
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="trial-info-box">
                    <h4>📅 What Happens Next?</h4>
                    <p>After submission, our team will contact you within 24 hours to schedule your free trial class.</p>
                  </div>
                </motion.div>
              )}

              {/* Step 2 for Admission: ID Verification */}
              {step === 2 && applicationType === 'admission' && (
                <motion.div
                  className="step-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>ID Verification</h3>
                  <p className="step-description">Upload your identity proof for verification.</p>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>ID Proof Type *</label>
                      <select name="idProofType" value={formData.idProofType} onChange={handleChange} required>
                        <option value="">Select ID type</option>
                        {idProofTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>ID Number *</label>
                      <input 
                        type="text" 
                        name="idProofNumber" 
                        value={formData.idProofNumber} 
                        onChange={handleChange} 
                        placeholder="Enter ID number" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Upload ID Proof Document *</label>
                    <div className="file-upload-area">
                      <input 
                        type="file" 
                        id="idProofFile"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'idproof')}
                      />
                      <label htmlFor="idProofFile" className="file-upload-label">
                        {idProofFile ? (
                          <span className="file-selected">✓ {idProofFile.name}</span>
                        ) : (
                          <>
                            <span className="upload-icon">📄</span>
                            <span>Click to upload or drag & drop</span>
                            <span className="file-hint">JPEG, PNG or PDF (max 10MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="form-section-title">Dance Preferences</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Preferred Dance Style</label>
                      <select name="danceStyle" value={formData.danceStyle} onChange={handleChange}>
                        <option value="">Select a style</option>
                        {danceStyles.map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Experience Level</label>
                      <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                        <option value="">Select level</option>
                        {experienceLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3 for Admission: Payment */}
              {step === 3 && applicationType === 'admission' && (
                <motion.div
                  className="step-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>Payment</h3>
                  <p className="step-description">Complete payment to finalize your admission.</p>
                  
                  <div className="payment-section">
                    <div className="payment-amount">
                      <span className="amount-label">Admission Fee</span>
                      <span className="amount-value">₹{formData.paymentAmount}</span>
                    </div>

                    <div className="qr-section">
                      <h4>Scan to Pay with PayTM</h4>
                      <div className="qr-code-container">
                        <img src={paytmQR} alt="PayTM QR Code" className="qr-code" />
                      </div>
                      <p className="qr-instructions">
                        Scan this QR code with your PayTM app to make payment.<br/>
                        After payment, upload the screenshot below.
                      </p>
                    </div>

                    <div className="form-group">
                      <label>Upload Payment Screenshot *</label>
                      <div className="file-upload-area payment-upload">
                        <input 
                          type="file" 
                          id="paymentFile"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'payment')}
                        />
                        <label htmlFor="paymentFile" className="file-upload-label">
                          {paymentScreenshot ? (
                            <span className="file-selected">✓ {paymentScreenshot.name}</span>
                          ) : (
                            <>
                              <span className="upload-icon">📸</span>
                              <span>Upload payment screenshot</span>
                              <span className="file-hint">JPEG or PNG (max 10MB)</span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="payment-note">
                      <strong>Note:</strong> Your admission will be confirmed after admin verifies the payment.
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4 for Admission: Review */}
              {step === 4 && applicationType === 'admission' && (
                <motion.div
                  className="step-content"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3>Review & Submit</h3>
                  <p className="step-description">Please review your information before submitting.</p>
                  
                  <div className="review-section">
                    <div className="review-group">
                      <h4>Personal Information</h4>
                      <div className="review-item"><span>Name:</span><strong>{formData.firstName} {formData.lastName}</strong></div>
                      <div className="review-item"><span>Age:</span><strong>{formData.age}</strong></div>
                      <div className="review-item"><span>Phone:</span><strong>{formData.phone}</strong></div>
                      <div className="review-item"><span>Email:</span><strong>{formData.email}</strong></div>
                      <div className="review-item"><span>Location:</span><strong>{formData.city}, {formData.state}</strong></div>
                    </div>

                    <div className="review-group">
                      <h4>Parent/Guardian</h4>
                      <div className="review-item"><span>Name:</span><strong>{formData.parentGuardianName || '-'}</strong></div>
                      <div className="review-item"><span>Phone:</span><strong>{formData.parentGuardianPhone || '-'}</strong></div>
                      <div className="review-item"><span>Relation:</span><strong>{formData.parentGuardianRelation || '-'}</strong></div>
                    </div>

                    <div className="review-group">
                      <h4>ID Verification</h4>
                      <div className="review-item"><span>ID Type:</span><strong>{idProofTypes.find(t => t.value === formData.idProofType)?.label}</strong></div>
                      <div className="review-item"><span>ID Number:</span><strong>{formData.idProofNumber}</strong></div>
                      <div className="review-item"><span>Document:</span><strong>{idProofFile?.name || '-'}</strong></div>
                    </div>

                    <div className="review-group">
                      <h4>Payment</h4>
                      <div className="review-item"><span>Amount:</span><strong>₹{formData.paymentAmount}</strong></div>
                      <div className="review-item"><span>Screenshot:</span><strong>{paymentScreenshot?.name || '-'}</strong></div>
                    </div>
                  </div>

                  <div className="terms-checkbox">
                    <label>
                      <input type="checkbox" required />
                      <span>I confirm that all information provided is accurate and I agree to the terms and conditions.</span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {step > 1 && (
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    ← Back
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => {
                    setApplicationType(null)
                    setStep(1)
                    setOtpSent(false)
                    setOtpVerified(false)
                    setOtp('')
                  }}
                >
                  Change Type
                </button>
                
                {step < totalSteps ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next Step →
                  </button>
                ) : (
                  <button type="submit" className="btn btn-gold" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Side Info */}
          <div className="preadmission-info">
            <div className="info-card">
              <h4>{applicationType === 'trial' ? 'Trial Class Benefits' : 'Admission Benefits'}</h4>
              <ul>
                {applicationType === 'trial' ? (
                  <>
                    <li><span>🎯</span> Free trial session</li>
                    <li><span>👩‍🏫</span> Meet our instructors</li>
                    <li><span>💃</span> Experience our studio</li>
                    <li><span>🎵</span> Try different styles</li>
                  </>
                ) : (
                  <>
                    <li><span>🎫</span> Unique Student ID</li>
                    <li><span>📱</span> Portal access</li>
                    <li><span>📚</span> Full curriculum</li>
                    <li><span>🏆</span> Event participation</li>
                  </>
                )}
              </ul>
            </div>

            <div className="info-card contact-card">
              <h4>Need Help?</h4>
              <p>Our team is here to assist.</p>
              <a href="tel:+919876543210">📞 +91 98765 43210</a>
              <a href="mailto:info@dreamdanceacademy.in">✉️ info@dreamdanceacademy.in</a>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default PreAdmission
