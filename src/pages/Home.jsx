import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

// Import images
import heroBanner from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28.jpeg'
import studioImage1 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29.jpeg'
import studioImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.30.jpeg'
import studioImage3 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21.jpeg'
import hipHopImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24.jpeg'
import kathakImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25 (1).jpeg'
import zumbaImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22.jpeg'
import classicalImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26.jpeg'
import contemporaryImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23.jpeg'
import bollywoodImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22 (1).jpeg'

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const danceStyles = [
    { name: 'Classical Dance', image: classicalImage, description: 'Master the timeless art of Bharatanatyam and classical forms.' },
    { name: 'Contemporary', image: contemporaryImage, description: 'Express yourself through fluid, emotional movement.' },
    { name: 'Hip Hop', image: hipHopImage, description: 'Learn the latest urban dance styles and techniques.' },
    { name: 'Zumba', image: zumbaImage, description: 'High-energy fitness dance that makes working out fun.' },
    { name: 'Kathak', image: kathakImage, description: 'Traditional Indian classical dance storytelling.' },
    { name: 'Kuchipuri', image: bollywoodImage, description: 'Traditional South Indian classical dance form.' },
  ]

  const stats = [
    { number: '15+', label: 'Years of Excellence' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '5000+', label: 'Happy Students' },
    { number: '100+', label: 'Awards Won' },
  ]

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      role: 'Parent',
      text: 'Dream Dance Academy has transformed my daughter. Her confidence and grace have blossomed beyond our expectations.',
      image: '👩'
    },
    {
      name: 'Marcus Chen',
      role: 'Adult Student',
      text: 'I started dancing at 35 thinking it was too late. The instructors here proved me wrong. Best decision ever!',
      image: '👨'
    },
    {
      name: 'Priya Sharma',
      role: 'Professional Dancer',
      text: 'The training I received here launched my career. The attention to technique and artistry is unmatched.',
      image: '👩‍🦱'
    },
  ]

  return (
    <motion.div 
      className="page home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="hero-tagline">Welcome to Dream Dance Academy</span>
            <h1>Where Every <span className="highlight">Movement</span> Tells a Story</h1>
            <p>Discover the joy of dance with world-class instruction. From beginners to professionals, we nurture talent and inspire artistic expression.</p>
            <div className="hero-buttons">
              <Link to="/enrollment" className="btn btn-gold">Start Your Journey</Link>
              <Link to="/classes" className="btn btn-secondary">Explore Classes</Link>
            </div>
          </motion.div>
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="hero-dancer with-image">
              <img src={heroBanner} alt="Dream Dance Academy" className="hero-image" />
            </div>
          </motion.div>
        </div>
        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-indicator"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="stat-item"
                variants={fadeInUp}
              >
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dance Styles Section */}
      <section className="section dance-styles">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>What We Offer</span>
            <h2>Dance Styles for Every Soul</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <motion.div 
            className="styles-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {danceStyles.map((style, index) => (
              <motion.div 
                key={index} 
                className="style-card"
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <img src={style.image} alt={style.name} className="style-image" />
                <h3>{style.name}</h3>
                <p>{style.description}</p>
                <Link to="/classes" className="style-link">
                  Learn More <span>→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section section-primary about-preview">
        <div className="container">
          <div className="about-preview-grid">
            <motion.div 
              className="about-preview-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Our Story</span>
              <h2>Nurturing Dancers Since 2009</h2>
              <p>Dream Dance Academy was founded with a vision to create a space where dance is more than movement—it's a transformative journey. Our state-of-the-art facilities and passionate instructors have helped thousands discover their rhythm.</p>
              <ul className="about-features">
                <li>✓ Professional-grade dance studios</li>
                <li>✓ Internationally trained instructors</li>
                <li>✓ Performance opportunities</li>
                <li>✓ All ages and skill levels welcome</li>
              </ul>
              <Link to="/about" className="btn btn-gold">Discover More</Link>
            </motion.div>
            <motion.div 
              className="about-preview-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="visual-collage">
                <div className="collage-item collage-1">
                  <img src={studioImage1} alt="Dance Studio" />
                </div>
                <div className="collage-item collage-2">
                  <img src={studioImage2} alt="Dance Studio" />
                </div>
                <div className="collage-item collage-3">
                  <img src={studioImage3} alt="Dance Studio" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>Success Stories</span>
            <h2>What Our Students Say</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <motion.div 
            className="testimonials-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                className="testimonial-card"
                variants={fadeInUp}
              >
                <div className="testimonial-quote">"</div>
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <span className="author-image">{testimonial.image}</span>
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background"></div>
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Dance?</h2>
            <p>Take the first step towards your dancing dreams. Join our community of passionate dancers today.</p>
            <div className="cta-buttons">
              <Link to="/enrollment" className="btn btn-gold">Enroll Now</Link>
              <Link to="/contact" className="btn btn-secondary">Get in Touch</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
