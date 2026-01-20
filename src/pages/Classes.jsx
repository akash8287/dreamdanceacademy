import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Classes.css'

// Import images
import hipHopImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24.jpeg'
import kathakImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25 (1).jpeg'
import zumbaImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22.jpeg'
import classicalImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26.jpeg'
import contemporaryImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23.jpeg'
import kuchipuriImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22 (1).jpeg'
import classicalImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23 (1).jpeg'
import classPromoImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25.jpeg'

const Classes = () => {
  const [activeFilter, setActiveFilter] = useState('all')

  const classes = [
    {
      id: 1,
      name: 'Bharatanatyam',
      category: 'classical',
      level: 'All Levels',
      duration: '60-90 min',
      image: classicalImage,
      description: 'Master the foundations of classical Indian dance with Bharatanatyam. Build strength, flexibility, and grace through traditional techniques.',
      schedule: 'Mon, Wed, Fri',
      price: '₹2000/month',
      features: ['Traditional poses', 'Expressive movements', 'Footwork', 'Performance prep']
    },
    {
      id: 2,
      name: 'Contemporary Dance',
      category: 'modern',
      level: 'Intermediate+',
      duration: '75 min',
      image: contemporaryImage,
      description: 'Express emotions through fluid movement. Contemporary dance combines elements of multiple dance styles, emphasizing personal expression and creativity.',
      schedule: 'Tue, Thu, Sat',
      price: '₹1800/month',
      features: ['Floor work', 'Improvisation', 'Contact techniques', 'Choreography']
    },
    {
      id: 3,
      name: 'Hip Hop',
      category: 'urban',
      level: 'All Levels',
      duration: '60 min',
      image: hipHopImage,
      description: 'Learn the latest street dance styles including popping, locking, and breaking. High-energy classes set to the hottest beats.',
      schedule: 'Mon, Wed, Sat',
      price: '₹1500/month',
      features: ['Grooves & foundations', 'Freestyle', 'Choreography', 'Battle prep']
    },
    {
      id: 4,
      name: 'Zumba',
      category: 'modern',
      level: 'All Levels',
      duration: '60 min',
      image: zumbaImage,
      description: 'High-energy fitness dance class that makes working out fun. Great cardio and full body workout!',
      schedule: 'Tue, Thu',
      price: '₹1200/month',
      features: ['Cardio workout', 'Latin rhythms', 'Easy moves', 'Fun atmosphere']
    },
    {
      id: 5,
      name: 'Kathak',
      category: 'classical',
      level: 'All Levels',
      duration: '90 min',
      image: kathakImage,
      description: 'Explore the ancient art of Indian classical dance. Kathak combines storytelling, footwork, and expressive movements.',
      schedule: 'Sat, Sun',
      price: '₹2200/month',
      features: ['Tatkar (footwork)', 'Hand gestures', 'Facial expressions', 'Traditional compositions']
    },
    {
      id: 6,
      name: 'Kuchipuri',
      category: 'classical',
      level: 'All Levels',
      duration: '60 min',
      image: kuchipuriImage,
      description: 'Traditional South Indian classical dance form known for its grace, fluid movements, and dramatic storytelling.',
      schedule: 'Fri, Sun',
      price: '₹2000/month',
      features: ['Classical poses', 'Expressive dance', 'Traditional form', 'Performance pieces']
    },
    {
      id: 7,
      name: 'Kids Dance',
      category: 'kids',
      level: 'Ages 4-12',
      duration: '45-60 min',
      image: classPromoImage,
      description: 'Fun, age-appropriate classes introducing children to the joy of dance. Building coordination, confidence, and creativity.',
      schedule: 'Sat morning',
      price: '₹1000/month',
      features: ['Creative movement', 'Basic technique', 'Games & activities', 'Recital prep']
    },
    {
      id: 8,
      name: 'Bharatanatyam Advanced',
      category: 'classical',
      level: 'Advanced',
      duration: '90 min',
      image: classicalImage2,
      description: 'Advanced classical dance training for experienced dancers. Focus on complex compositions and performance excellence.',
      schedule: 'Wed, Sat',
      price: '₹2500/month',
      features: ['Complex footwork', 'Advanced poses', 'Performance prep', 'Competition training']
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
                  <div className="class-image-wrapper">
                    <img src={danceClass.image} alt={danceClass.name} className="class-image" />
                  </div>
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
