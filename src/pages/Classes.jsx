import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Classes.css'

const Classes = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const classes = [
    {
      id: 1,
      name: 'Classical Ballet',
      category: 'classical',
      level: 'All Levels',
      duration: '60-90 min',
      icon: '🩰',
      description: 'Master the foundations of dance with classical ballet. Build strength, flexibility, and grace through traditional techniques passed down through generations.',
      schedule: 'Mon, Wed, Fri',
      price: '$120/month',
      features: ['Barre work', 'Center combinations', 'Pointe work (advanced)', 'Performance prep']
    },
    {
      id: 2,
      name: 'Contemporary Dance',
      category: 'modern',
      level: 'Intermediate+',
      duration: '75 min',
      icon: '💫',
      description: 'Express emotions through fluid movement. Contemporary dance combines elements of multiple dance styles, emphasizing personal expression and creativity.',
      schedule: 'Tue, Thu, Sat',
      price: '$110/month',
      features: ['Floor work', 'Improvisation', 'Contact techniques', 'Choreography']
    },
    {
      id: 3,
      name: 'Hip Hop',
      category: 'urban',
      level: 'All Levels',
      duration: '60 min',
      icon: '🔥',
      description: 'Learn the latest street dance styles including popping, locking, and breaking. High-energy classes set to the hottest beats.',
      schedule: 'Mon, Wed, Sat',
      price: '$100/month',
      features: ['Grooves & foundations', 'Freestyle', 'Choreography', 'Battle prep']
    },
    {
      id: 4,
      name: 'Jazz Dance',
      category: 'modern',
      level: 'All Levels',
      duration: '60 min',
      icon: '✨',
      description: 'Energetic and theatrical, jazz dance combines technique with showmanship. Perfect for those who love performing.',
      schedule: 'Tue, Thu',
      price: '$100/month',
      features: ['Jazz technique', 'Broadway style', 'Turns & leaps', 'Stage presence']
    },
    {
      id: 5,
      name: 'Kathak',
      category: 'classical',
      level: 'All Levels',
      duration: '90 min',
      icon: '🪘',
      description: 'Explore the ancient art of Indian classical dance. Kathak combines storytelling, footwork, and expressive movements.',
      schedule: 'Sat, Sun',
      price: '$130/month',
      features: ['Tatkar (footwork)', 'Hand gestures', 'Facial expressions', 'Traditional compositions']
    },
    {
      id: 6,
      name: 'Salsa & Latin',
      category: 'social',
      level: 'All Levels',
      duration: '60 min',
      icon: '💃',
      description: 'Feel the rhythm of Latin music and learn to salsa, bachata, and more. Partner and solo techniques included.',
      schedule: 'Fri, Sun',
      price: '$90/month',
      features: ['Basic steps', 'Partner work', 'Styling', 'Musicality']
    },
    {
      id: 7,
      name: 'Kids Dance',
      category: 'kids',
      level: 'Ages 4-12',
      duration: '45-60 min',
      icon: '🌈',
      description: 'Fun, age-appropriate classes introducing children to the joy of dance. Building coordination, confidence, and creativity.',
      schedule: 'Sat morning',
      price: '$80/month',
      features: ['Creative movement', 'Basic technique', 'Games & activities', 'Recital prep']
    },
    {
      id: 8,
      name: 'Bollywood Fusion',
      category: 'social',
      level: 'All Levels',
      duration: '60 min',
      icon: '🎬',
      description: 'High-energy dance combining traditional Indian movements with modern Bollywood choreography. Great cardio workout!',
      schedule: 'Wed, Sat',
      price: '$95/month',
      features: ['Bollywood hits', 'Folk fusion', 'Cardio dance', 'Performance pieces']
    }
  ]

  const filters = [
    { id: 'all', label: 'All Classes' },
    { id: 'classical', label: 'Classical' },
    { id: 'modern', label: 'Modern' },
    { id: 'urban', label: 'Urban' },
    { id: 'social', label: 'Social' },
    { id: 'kids', label: 'Kids' }
  ]

  const filteredClasses = activeFilter === 'all' 
    ? classes 
    : classes.filter(c => c.category === activeFilter)

  return (
    <motion.div 
      className="page classes"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="classes-hero">
        <div className="classes-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="classes-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Our Classes</span>
            <h1>Find Your <span className="highlight">Rhythm</span></h1>
            <p>From classical to contemporary, traditional to trending - explore our diverse range of dance classes designed for every age and skill level.</p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-wrapper">
            {filters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="section classes-grid-section">
        <div className="container">
          <motion.div 
            className="classes-grid"
            layout
          >
            {filteredClasses.map((danceClass, index) => (
              <motion.div
                key={danceClass.id}
                className="class-card"
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="class-card-header">
                  <span className="class-icon">{danceClass.icon}</span>
                  <div className="class-meta">
                    <span className="class-level">{danceClass.level}</span>
                    <span className="class-duration">{danceClass.duration}</span>
                  </div>
                </div>
                <h3>{danceClass.name}</h3>
                <p>{danceClass.description}</p>
                <div className="class-features">
                  {danceClass.features.map((feature, i) => (
                    <span key={i} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <div className="class-footer">
                  <div className="class-schedule">
                    <span className="schedule-icon">📅</span>
                    <span>{danceClass.schedule}</span>
                  </div>
                  <div className="class-price">{danceClass.price}</div>
                </div>
                <Link to="/enrollment" className="btn btn-primary class-btn">
                  Enroll Now
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="section section-dark class-info">
        <div className="container">
          <div className="info-grid">
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="info-icon">📚</span>
              <h3>Structured Curriculum</h3>
              <p>Our classes follow a progressive curriculum designed by industry experts to ensure steady improvement.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="info-icon">👥</span>
              <h3>Small Class Sizes</h3>
              <p>Maximum 15 students per class ensures personalized attention and faster progress.</p>
            </motion.div>
            <motion.div 
              className="info-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="info-icon">🎯</span>
              <h3>Free Trial Class</h3>
              <p>Not sure which class is right for you? Try any class free before committing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section classes-cta">
        <div className="container">
          <motion.div 
            className="classes-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Not Sure Where to Start?</h2>
            <p>Our team can help you choose the perfect class based on your goals, experience, and schedule.</p>
            <Link to="/contact" className="btn btn-gold">Get Guidance</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Classes
