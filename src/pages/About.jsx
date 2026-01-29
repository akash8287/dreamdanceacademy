import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './About.css'

// Import images
import mainBanner from '../../assets/WhatsApp Image 2026-01-19 at 19.07.44.jpeg'
import studioImage1 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29.jpeg'
import studioImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.30.jpeg'
import promoImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28.jpeg'

// New images
import newBollywoodImg from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.42.jpeg'
import newStudioImg from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.45.jpeg'

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const values = [
    {
      icon: '🎯',
      title: 'Excellence',
      description: 'We strive for the highest standards in dance education, continuously pushing boundaries.'
    },
    {
      icon: '❤️',
      title: 'Passion',
      description: 'Dance is our life. We bring enthusiasm and dedication to every class we teach.'
    },
    {
      icon: '🤝',
      title: 'Community',
      description: 'We foster a supportive, inclusive environment where everyone belongs.'
    },
    {
      icon: '🌟',
      title: 'Growth',
      description: 'We believe in continuous improvement, both as dancers and as individuals.'
    }
  ]

  const milestones = [
    { year: '2009', event: 'Dream Dance Academy founded with just 2 studios' },
    { year: '2012', event: 'Expanded to 6 studios, introduced Hip Hop program' },
    { year: '2015', event: 'Won National Dance Championship for the first time' },
    { year: '2017', event: 'Launched international exchange program' },
    { year: '2020', event: 'Introduced virtual classes reaching students worldwide' },
    { year: '2023', event: 'Celebrated 5000+ graduates and opened 3rd location' }
  ]

  return (
    <motion.div 
      className="page about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="about-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">About Us</span>
            <h1>The Art of Dance, The Joy of <span className="highlight">Movement</span></h1>
            <p>Discover the story behind Dream Dance Academy and our commitment to nurturing dancers of all ages and abilities.</p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section story-section">
        <div className="container">
          <div className="story-grid">
            <motion.div 
              className="story-visual"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="story-image-container">
                <div className="story-image main-image">
                  <img src={newBollywoodImg} alt="Dream Dance Academy" />
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="story-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Our Story</span>
              <h2>A Journey of Passion and Dedication</h2>
              <p>Dream Dance Academy was born from a simple belief: dance has the power to transform lives. Founded in 2009 by renowned choreographer Maria Santos, our academy started with just two studios and a handful of dedicated students.</p>
              <p>What began as a small community of dance enthusiasts has grown into one of the most respected dance institutions in the region. Today, we operate three state-of-the-art facilities with over 50 instructors and thousands of students who share our passion for movement.</p>
              <p>Our journey has been marked by countless performances, competitions, and most importantly, the personal growth of each dancer who walks through our doors.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section section-dark mission-section">
        <div className="container">
          <div className="mission-grid">
            <motion.div 
              className="mission-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Our Mission</span>
              <h2>Inspiring the Next Generation of Dancers</h2>
              <p>We are dedicated to providing exceptional dance education that nurtures creativity, builds confidence, and promotes physical well-being. Our mission is to make dance accessible to everyone, regardless of age, background, or experience level.</p>
            </motion.div>
            <motion.div 
              className="vision-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="section-label">Our Vision</span>
              <h2>Creating a World Where Everyone Dances</h2>
              <p>We envision a world where dance is recognized as an essential form of expression and education. Through our programs, we aim to cultivate artists who will shape the future of dance and inspire others to discover the joy of movement.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>What We Stand For</span>
            <h2>Our Core Values</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <div className="values-grid">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section timeline-section">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>Our Journey</span>
            <h2>Milestones & Achievements</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="timeline-content">
                  <span className="timeline-year">{milestone.year}</span>
                  <p>{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="section section-primary facilities-section">
        <div className="container">
          <div className="facilities-grid">
            <motion.div 
              className="facilities-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Our Space</span>
              <h2>World-Class Facilities</h2>
              <p>Our studios are designed to inspire and facilitate excellence in dance. Every detail has been carefully considered to create the perfect environment for learning and performance.</p>
              <ul className="facilities-list">
                <li>
                  <span className="facility-icon">🏛️</span>
                  <div>
                    <strong>8 Professional Studios</strong>
                    <p>Sprung floors, mirrors, and optimal lighting</p>
                  </div>
                </li>
                <li>
                  <span className="facility-icon">🎵</span>
                  <div>
                    <strong>State-of-the-Art Sound</strong>
                    <p>Premium audio systems in every studio</p>
                  </div>
                </li>
                <li>
                  <span className="facility-icon">🎬</span>
                  <div>
                    <strong>Recording Studio</strong>
                    <p>For performances and audition tapes</p>
                  </div>
                </li>
                <li>
                  <span className="facility-icon">👔</span>
                  <div>
                    <strong>Changing Rooms</strong>
                    <p>Spacious and comfortable facilities</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            <motion.div 
              className="facilities-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="facilities-images">
                <div className="facility-img">
                  <img src={newStudioImg} alt="Dance Studio" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section about-cta">
        <div className="container">
          <motion.div 
            className="about-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Begin Your Dance Journey?</h2>
            <p>Join our community of passionate dancers and discover what you're capable of.</p>
            <div className="about-cta-buttons">
              <Link to="/enrollment" className="btn btn-gold">Enroll Today</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About
