import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

// Import images
import logoImage from '../../assets/logo.jpeg'
// Old studio images for "Our Story" section
import studioImage1 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29.jpeg'
import studioImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.30.jpeg'
import studioImage3 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21.jpeg'

// Featured horizontal images
import featuredImg1 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.51 (1).jpeg' // Kids Program (id 19)
import featuredImg2 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.52.jpeg' // Group Photo (id 22)
import featuredImg3 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.53.jpeg' // Workshop (id 30)

// Dance style images - professional photos
import classicalImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42 (2).jpeg'
import contemporaryImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.44.jpeg'
import hipHopImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.43.jpeg'
import zumbaImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.48.jpeg'
import kathakImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42 (1).jpeg'
// Replaced images that had other academy logos (UNITY, RISE & RHYTHM)
import bollywoodImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42.jpeg' // DDA branded - kids Bollywood
import balletImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.44 (1).jpeg' // DDA branded
import salsaImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.47 (1).jpeg' // Kids dancing - no external logo
import jazzImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.39.jpeg'
import folkImage from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42.jpeg'
import extraImage1 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.43 (1).jpeg'
import extraImage2 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.44 (1).jpeg'
import extraImage3 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.46.jpeg'
import extraImage4 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.46 (1).jpeg'
import extraImage5 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.47 (1).jpeg'
import extraImage6 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.43 (1).jpeg' // Replaced - original had UNITY logo
import qrCodeImage from '../../assets/qr.jpeg'

// New dance style images from newpics
import punjabiImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40.jpeg'
import bollywoodNewImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.42.jpeg'
import freestyleImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.45.jpeg'
import weddingDanceImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.46.jpeg'
import aerobicsImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.47.jpeg'
import salsaNewImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.48.jpeg'
import yogaImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49.jpeg'
import tuttingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.50.jpeg'
import lockingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.51.jpeg'
import houseDanceImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52.jpeg'
import poppingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.53.jpeg'

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
    { name: 'Kathak', image: classicalImage, description: 'Traditional Indian classical dance with graceful spins and expressions.' },
    { name: 'Contemporary', image: contemporaryImage, description: 'Express yourself through fluid, emotional movement and modern techniques.' },
    { name: 'Hip Hop', image: hipHopImage, description: 'Urban street dance with dynamic moves and high energy beats.' },
    { name: 'Zumba', image: zumbaImage, description: 'High-energy fitness dance that makes working out fun and exciting.' },
    { name: 'Bollywood', image: bollywoodNewImage, description: 'Vibrant Indian film-style dance with colorful choreography.' },
    { name: 'Punjabi', image: punjabiImage, description: 'Energetic Bhangra and Punjabi dance with traditional moves.' },
    { name: 'Folk Dance', image: bollywoodImage, description: 'Traditional cultural dances celebrating Indian heritage.' },
    { name: 'Freestyle', image: freestyleImage, description: 'Express your unique style through free-form dance movements.' },
    { name: 'Wedding Dance', image: weddingDanceImage, description: 'Special choreography for your wedding first dance and sangeet.' },
    { name: 'Aerobics', image: aerobicsImage, description: 'Fun cardio workout combining dance moves with fitness.' },
    { name: 'Salsa', image: salsaNewImage, description: 'Passionate Latin dance with partner work and rhythmic footwork.' },
    { name: 'Yoga', image: yogaImage, description: 'Mind-body practice combining movement, meditation and breathing.' },
    { name: 'Jazz', image: balletImage, description: 'Energetic and expressive dance with dynamic movements.' },
    { name: 'Kids Dance', image: salsaImage, description: 'Fun age-appropriate classes for young aspiring dancers.' },
    { name: 'Western', image: jazzImage, description: 'Modern western dance styles including jazz and freestyle.' },
    { name: 'Semi-Classical', image: folkImage, description: 'Fusion of classical and contemporary Indian dance forms.' },
    { name: 'Afro', image: extraImage1, description: 'Vibrant African dance styles with powerful rhythms and movements.' },
    { name: 'Ballet', image: extraImage2, description: 'Classical ballet focusing on technique, grace, and poise.' },
    { name: 'Belly Dance', image: extraImage3, description: 'Mesmerizing belly dance with isolations and fluid movements.' },
    { name: 'House', image: houseDanceImage, description: 'Fast-paced house dance with footwork and jacking.' },
    { name: 'K-Pop', image: extraImage5, description: 'Learn choreography from popular K-Pop songs and artists.' },
    { name: 'Krumping', image: extraImage6, description: 'Express raw emotion through powerful krump movements.' },
    { name: 'Locking', image: lockingImage, description: 'Funky locking with signature pauses and pointing.' },
    { name: 'Lyrical', image: contemporaryImage, description: 'Expressive dance combining ballet and jazz with emotion.' },
    { name: 'Old School', image: jazzImage, description: 'Classic hip hop grooves and party dances from the 80s-90s.' },
    { name: 'Popping', image: poppingImage, description: 'Iconic muscle contractions with hits, waves, and animation.' },
    { name: 'Tutting', image: tuttingImage, description: 'Create geometric shapes with your body and fingers.' },
    { name: 'Waacking', image: extraImage3, description: 'Dramatic arm movements and poses from the disco era.' },
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
            <div className="hero-dancer with-image hero-logo">
              <img src={logoImage} alt="Dream Dance Academy Logo" className="hero-image" />
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
                <span className="stat-label" style={{ color: "rgba(0,0,0,0.8)" ,fontWeight: "bold" }}
                >{stat.label}</span>
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
            <span style={{"font-size": "30px" }}>What We Offer</span>
            <h2 style={{ color: "rgba(255, 255, 255, 0.8)" }}>Dance Styles for Every Soul</h2>
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
                <div className="style-image-container">
                  <img src={style.image} alt={style.name} className="style-image" />
                </div>
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

      {/* Featured Moments Section */}
      <section className="section featured-moments">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>Highlights</span>
            <h2>Featured Moments</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <div className="featured-grid">
            <motion.div 
              className="featured-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src={featuredImg1} alt="Kids Dance Program" />
              <div className="featured-overlay">
                <h4>Kids Program</h4>
                <p>Young dancers showcasing their talent</p>
              </div>
            </motion.div>
            <motion.div 
              className="featured-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={featuredImg2} alt="Dance Group Photo" />
              <div className="featured-overlay">
                <h4>Our Dance Family</h4>
                <p>Dance batch group photo</p>
              </div>
            </motion.div>
            <motion.div 
              className="featured-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={featuredImg3} alt="Dance Workshop" />
              <div className="featured-overlay">
                <h4>Dance Workshop</h4>
                <p>Special training sessions</p>
              </div>
            </motion.div>
          </div>
          <div className="featured-cta">
            <Link to="/gallery" className="btn btn-secondary">View Full Gallery</Link>
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

      {/* QR Code Section */}
      <section className="section qr-section">
        <div className="container">
          <motion.div 
            className="qr-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="qr-text">
              <h3>Connect With Us</h3>
              <p>Scan this QR code to get in touch with us instantly or follow us on social media!</p>
            </div>
            <div className="qr-image-wrapper">
              <img src={qrCodeImage} alt="Dream Dance Academy QR Code" className="qr-image" />
            </div>
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
