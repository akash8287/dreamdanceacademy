import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Schedule.css'

const Schedule = () => {
  const [activeDay, setActiveDay] = useState('monday')

  const days = [
    { id: 'monday', label: 'Mon' },
    { id: 'tuesday', label: 'Tue' },
    { id: 'wednesday', label: 'Wed' },
    { id: 'thursday', label: 'Thu' },
    { id: 'friday', label: 'Fri' },
    { id: 'saturday', label: 'Sat' },
    { id: 'sunday', label: 'Sun' }
  ]

  const schedule = {
    monday: [
      { time: '9:00 AM', class: 'Kids Ballet', instructor: 'Lisa Thompson', level: 'Ages 4-7', studio: 'Studio A' },
      { time: '10:30 AM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'Beginner', studio: 'Studio B' },
      { time: '12:00 PM', class: 'Contemporary', instructor: 'Elena Volkov', level: 'Intermediate', studio: 'Studio A' },
      { time: '4:00 PM', class: 'Kids Hip Hop', instructor: 'James Rivera', level: 'Ages 8-12', studio: 'Studio C' },
      { time: '5:30 PM', class: 'Hip Hop', instructor: 'James Rivera', level: 'All Levels', studio: 'Studio C' },
      { time: '7:00 PM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'Advanced', studio: 'Studio A' }
    ],
    tuesday: [
      { time: '9:00 AM', class: 'Yoga for Dancers', instructor: 'Elena Volkov', level: 'All Levels', studio: 'Studio B' },
      { time: '10:30 AM', class: 'Jazz', instructor: 'Sarah Kim', level: 'Beginner', studio: 'Studio A' },
      { time: '12:00 PM', class: 'Contemporary', instructor: 'Elena Volkov', level: 'Advanced', studio: 'Studio A' },
      { time: '4:00 PM', class: 'Kids Jazz', instructor: 'Sarah Kim', level: 'Ages 8-12', studio: 'Studio B' },
      { time: '5:30 PM', class: 'Salsa', instructor: 'Carlos Mendez', level: 'Beginner', studio: 'Studio C' },
      { time: '7:00 PM', class: 'Jazz', instructor: 'Sarah Kim', level: 'Intermediate', studio: 'Studio A' }
    ],
    wednesday: [
      { time: '9:00 AM', class: 'Kids Ballet', instructor: 'Lisa Thompson', level: 'Ages 4-7', studio: 'Studio A' },
      { time: '10:30 AM', class: 'Bollywood', instructor: 'Raj Patel', level: 'All Levels', studio: 'Studio C' },
      { time: '12:00 PM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'Intermediate', studio: 'Studio A' },
      { time: '4:00 PM', class: 'Kids Contemporary', instructor: 'Elena Volkov', level: 'Ages 8-12', studio: 'Studio B' },
      { time: '5:30 PM', class: 'Hip Hop', instructor: 'James Rivera', level: 'Intermediate', studio: 'Studio C' },
      { time: '7:00 PM', class: 'Bollywood', instructor: 'Raj Patel', level: 'All Levels', studio: 'Studio C' }
    ],
    thursday: [
      { time: '9:00 AM', class: 'Pilates', instructor: 'Maria Santos', level: 'All Levels', studio: 'Studio B' },
      { time: '10:30 AM', class: 'Jazz', instructor: 'Sarah Kim', level: 'Advanced', studio: 'Studio A' },
      { time: '12:00 PM', class: 'Contemporary', instructor: 'Elena Volkov', level: 'Beginner', studio: 'Studio A' },
      { time: '4:00 PM', class: 'Kids Hip Hop', instructor: 'James Rivera', level: 'Ages 4-7', studio: 'Studio C' },
      { time: '5:30 PM', class: 'Bachata', instructor: 'Carlos Mendez', level: 'All Levels', studio: 'Studio C' },
      { time: '7:00 PM', class: 'Jazz', instructor: 'Sarah Kim', level: 'All Levels', studio: 'Studio A' }
    ],
    friday: [
      { time: '9:00 AM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'Beginner', studio: 'Studio A' },
      { time: '10:30 AM', class: 'Kathak', instructor: 'Priya Nair', level: 'Beginner', studio: 'Studio B' },
      { time: '12:00 PM', class: 'Hip Hop', instructor: 'James Rivera', level: 'Advanced', studio: 'Studio C' },
      { time: '4:00 PM', class: 'Kids Ballet', instructor: 'Lisa Thompson', level: 'Ages 8-12', studio: 'Studio A' },
      { time: '5:30 PM', class: 'Salsa', instructor: 'Carlos Mendez', level: 'Intermediate', studio: 'Studio C' },
      { time: '7:00 PM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'Intermediate', studio: 'Studio A' }
    ],
    saturday: [
      { time: '9:00 AM', class: 'Kids Ballet', instructor: 'Lisa Thompson', level: 'Ages 4-7', studio: 'Studio A' },
      { time: '9:00 AM', class: 'Kids Hip Hop', instructor: 'James Rivera', level: 'Ages 8-12', studio: 'Studio C' },
      { time: '10:30 AM', class: 'Classical Ballet', instructor: 'Maria Santos', level: 'All Levels', studio: 'Studio A' },
      { time: '10:30 AM', class: 'Kathak', instructor: 'Priya Nair', level: 'Intermediate', studio: 'Studio B' },
      { time: '12:00 PM', class: 'Contemporary', instructor: 'Elena Volkov', level: 'All Levels', studio: 'Studio A' },
      { time: '12:00 PM', class: 'Bollywood', instructor: 'Raj Patel', level: 'All Levels', studio: 'Studio C' },
      { time: '2:00 PM', class: 'Hip Hop', instructor: 'James Rivera', level: 'All Levels', studio: 'Studio C' },
      { time: '3:30 PM', class: 'Jazz', instructor: 'Sarah Kim', level: 'All Levels', studio: 'Studio A' }
    ],
    sunday: [
      { time: '10:00 AM', class: 'Kathak', instructor: 'Priya Nair', level: 'Advanced', studio: 'Studio B' },
      { time: '10:00 AM', class: 'Contemporary', instructor: 'Elena Volkov', level: 'Intermediate', studio: 'Studio A' },
      { time: '12:00 PM', class: 'Salsa Social', instructor: 'Carlos Mendez', level: 'All Levels', studio: 'Studio C' },
      { time: '2:00 PM', class: 'Open Practice', instructor: 'Various', level: 'All Students', studio: 'All Studios' },
      { time: '4:00 PM', class: 'Performance Rehearsal', instructor: 'Various', level: 'By Invitation', studio: 'Main Hall' }
    ]
  }

  const getLevelColor = (level) => {
    if (level.includes('Beginner') || level.includes('Ages')) return 'level-beginner'
    if (level.includes('Intermediate')) return 'level-intermediate'
    if (level.includes('Advanced')) return 'level-advanced'
    return 'level-all'
  }

  return (
    <motion.div 
      className="page schedule"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="schedule-hero">
        <div className="schedule-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="schedule-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Class Schedule</span>
            <h1>Find Your <span className="highlight">Perfect Class</span></h1>
            <p>Browse our weekly schedule and find the classes that fit your lifestyle. All classes are held at our main studio location.</p>
          </motion.div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="section schedule-section">
        <div className="container">
          {/* Day Selector */}
          <div className="day-selector">
            {days.map((day) => (
              <button
                key={day.id}
                className={`day-btn ${activeDay === day.id ? 'active' : ''}`}
                onClick={() => setActiveDay(day.id)}
              >
                {day.label}
              </button>
            ))}
          </div>

          {/* Schedule Table */}
          <motion.div 
            className="schedule-table"
            key={activeDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="schedule-header">
              <div className="header-time">Time</div>
              <div className="header-class">Class</div>
              <div className="header-instructor">Instructor</div>
              <div className="header-level">Level</div>
              <div className="header-studio">Studio</div>
              <div className="header-action"></div>
            </div>
            {schedule[activeDay].map((item, index) => (
              <motion.div
                key={index}
                className="schedule-row"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="row-time">{item.time}</div>
                <div className="row-class">{item.class}</div>
                <div className="row-instructor">{item.instructor}</div>
                <div className="row-level">
                  <span className={`level-badge ${getLevelColor(item.level)}`}>{item.level}</span>
                </div>
                <div className="row-studio">{item.studio}</div>
                <div className="row-action">
                  <Link to="/enrollment" className="book-btn">Book</Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Legend */}
          <div className="schedule-legend">
            <span className="legend-title">Level Guide:</span>
            <span className="legend-item">
              <span className="level-badge level-beginner">Beginner</span>
              New to dance
            </span>
            <span className="legend-item">
              <span className="level-badge level-intermediate">Intermediate</span>
              1-2 years experience
            </span>
            <span className="legend-item">
              <span className="level-badge level-advanced">Advanced</span>
              3+ years experience
            </span>
            <span className="legend-item">
              <span className="level-badge level-all">All Levels</span>
              Everyone welcome
            </span>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section section-dark schedule-info">
        <div className="container">
          <div className="info-grid">
            <motion.div 
              className="info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="info-icon">📍</span>
              <h3>Location</h3>
              <p>123 Dance Avenue<br/>Creative District, CA 90210</p>
            </motion.div>
            <motion.div 
              className="info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="info-icon">🕐</span>
              <h3>Studio Hours</h3>
              <p>Mon - Sat: 9AM - 9PM<br/>Sunday: 10AM - 6PM</p>
            </motion.div>
            <motion.div 
              className="info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="info-icon">📞</span>
              <h3>Contact</h3>
              <p>+1 (555) 123-4567<br/>info@dreamdanceacademy.com</p>
            </motion.div>
            <motion.div 
              className="info-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="info-icon">ℹ️</span>
              <h3>Note</h3>
              <p>Schedule subject to change.<br/>Check website for updates.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section schedule-cta">
        <div className="container">
          <motion.div 
            className="schedule-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Start Dancing?</h2>
            <p>Book your first class today and discover the joy of movement.</p>
            <div className="cta-buttons">
              <Link to="/enrollment" className="btn btn-gold">Enroll Now</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Schedule
