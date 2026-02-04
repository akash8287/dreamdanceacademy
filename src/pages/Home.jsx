import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Home.css'

// Import images
import logoImage from '../../assets/logo.jpeg'
import qrCodeImage from '../../assets/qr.jpeg'

// Import all dance style images from newpics folder only
import punjabiImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40.jpeg'
import contemporaryImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40 (1).jpeg'
import classicalImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40 (2).jpeg'
import kidsWesternImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.41 (1).jpeg'
import bollywoodImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.42.jpeg'
import hipHopImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.44 (1).jpeg'
import freestyleImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.45.jpeg'
import bharatanatyamImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.45 (1).jpeg'
import weddingDanceImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.46.jpeg'
import aerobicsImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.47.jpeg'
import coupleDanceImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.47 (1).jpeg'
import salsaImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.48.jpeg'
import yogaImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49.jpeg'
import zumbaImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49 (1).jpeg'
import waackingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49 (2).jpeg'
import tuttingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.50.jpeg'
import lockingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.51.jpeg'
import houseDanceImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52.jpeg'
import poppingImage from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.53.jpeg'

// Featured images for sections
import studioImg1 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.45.jpeg'
import studioImg2 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.45 (1).jpeg'
import studioImg3 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.46.jpeg'

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
    { name: 'Punjabi', image: punjabiImage, description: 'Energetic Bhangra and Punjabi dance with traditional moves.' },
    { name: 'Contemporary', image: contemporaryImage, description: 'Express yourself through fluid, emotional movement and modern techniques.' },
    { name: 'Classical Dance', image: classicalImage, description: 'Traditional Indian classical dance forms with graceful expressions.' },
    { name: 'Kids Western', image: kidsWesternImage, description: 'Fun western dance styles for young aspiring dancers.' },
    { name: 'Bollywood', image: bollywoodImage, description: 'Vibrant Indian film-style dance with colorful choreography.' },
    { name: 'Hip Hop', image: hipHopImage, description: 'Urban street dance with dynamic moves and high energy beats.' },
    { name: 'Freestyle', image: freestyleImage, description: 'Express your unique style through free-form dance movements.' },
    { name: 'Bharatanatyam', image: bharatanatyamImage, description: 'Classical South Indian dance with intricate footwork.' },
    { name: 'Wedding Dance', image: weddingDanceImage, description: 'Special choreography for your wedding and sangeet.' },
    { name: 'Aerobics', image: aerobicsImage, description: 'Fun cardio workout combining dance moves with fitness.' },
    { name: 'Couple Dance', image: coupleDanceImage, description: 'Elegant partner dancing for couples.' },
    { name: 'Salsa', image: salsaImage, description: 'Passionate Latin dance with rhythmic footwork.' },
    { name: 'Yoga', image: yogaImage, description: 'Mind-body practice combining movement and meditation.' },
    { name: 'Zumba', image: zumbaImage, description: 'High-energy fitness dance that makes working out fun.' },
    { name: 'Waacking', image: waackingImage, description: 'Dramatic arm movements and poses from the disco era.' },
    { name: 'Tutting', image: tuttingImage, description: 'Create geometric shapes with your body and fingers.' },
    { name: 'Locking', image: lockingImage, description: 'Funky locking with signature pauses and pointing.' },
    { name: 'House', image: houseDanceImage, description: 'Fast-paced house dance with footwork and jacking.' },
    { name: 'Popping', image: poppingImage, description: 'Iconic muscle contractions with hits, waves, and animation.' },
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
            <span style={{"fontSize": "30px" }}>What We Offer</span>
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
                  <img src={studioImg1} alt="Dance Studio" />
                </div>
                <div className="collage-item collage-2">
                  <img src={studioImg2} alt="Dance Studio" />
                </div>
                <div className="collage-item collage-3">
                  <img src={studioImg3} alt="Dance Studio" />
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
              <img src={bollywoodImage} alt="Bollywood Dance" />
              <div className="featured-overlay">
                <h4>Bollywood Dance</h4>
                <p>Vibrant group performances</p>
              </div>
            </motion.div>
            <motion.div 
              className="featured-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <img src={classicalImage} alt="Classical Dance" />
              <div className="featured-overlay">
                <h4>Classical Dance</h4>
                <p>Traditional Indian dance forms</p>
              </div>
            </motion.div>
            <motion.div 
              className="featured-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img src={hipHopImage} alt="Hip Hop Dance" />
              <div className="featured-overlay">
                <h4>Hip Hop</h4>
                <p>Urban groove and street dance</p>
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
