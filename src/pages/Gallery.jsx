import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

// Import logo
import logoImage from '../../assets/logo.jpeg'

// Import all images from newpics folder only
import img1 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40.jpeg' // Punjabi
import img2 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40 (1).jpeg' // Contemporary
import img3 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.40 (2).jpeg' // Classical Dance
import img4 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.41.jpeg' // DDA Logo
import img5 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.41 (1).jpeg' // Western Dance for Kids
import img6 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.42.jpeg' // Bollywood
import img7 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.42 (1).jpeg' // Dance Teachers Required
import img8 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.43.jpeg' // Video Shooters Required
import img9 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.44.jpeg' // Graphic Designers Required
import img10 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.44 (1).jpeg' // Hip Hop Fusion
import img11 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.45.jpeg' // Freestyle
import img12 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.45 (1).jpeg' // Bharatanatyam
import img13 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.46.jpeg' // Wedding Dance
import img14 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.47.jpeg' // Aerobics
import img15 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.47 (1).jpeg' // Couple Dance
import img16 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.48.jpeg' // Salsa
import img17 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49.jpeg' // Yoga
import img18 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49 (1).jpeg' // Zumba
import img19 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.49 (2).jpeg' // Waacking
import img20 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.50.jpeg' // Tutting
import img21 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.50 (2).jpeg' // Extra
import img22 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.51.jpeg' // Locking
import img23 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.51 (1).jpeg' // Extra
import img24 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.51 (2).jpeg' // Extra
import img25 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52.jpeg' // House Dance
import img26 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52 (1).jpeg' // Extra
import img27 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52 (2).jpeg' // Extra
import img28 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.52 (3).jpeg' // Extra
import img29 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.53.jpeg' // Popping
import img30 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 11.30.53 (1).jpeg' // Extra
import img31 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.45.jpeg' // Studio Photo
import img32 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.45 (1).jpeg' // Studio Photo
import img33 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.46.jpeg' // Studio Photo
import img34 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.46 (1).jpeg' // Studio Photo
import img35 from '../../assets/newpics/WhatsApp Image 2026-01-29 at 13.06.46 (2).jpeg' // Studio Photo

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'performances', label: 'Dance Styles' },
    { id: 'classes', label: 'Classes' },
    { id: 'studio', label: 'Studio' }
  ]

  const galleryItems = [
    // Dance Styles - Performances
    { id: 1, category: 'performances', image: img1, title: 'Punjabi Dance', description: 'Traditional Bhangra and Punjabi dance styles' },
    { id: 2, category: 'performances', image: img2, title: 'Contemporary', description: 'Fluid emotional movement and modern techniques' },
    { id: 3, category: 'performances', image: img3, title: 'Classical Dance', description: 'Traditional Indian classical dance forms' },
    { id: 4, category: 'performances', image: img5, title: 'Western Dance for Kids', description: 'Fun western dance styles for children' },
    { id: 5, category: 'performances', image: img6, title: 'Bollywood', description: 'Vibrant Indian film-style dance' },
    { id: 6, category: 'performances', image: img10, title: 'Hip Hop Fusion', description: 'Urban groove and hip hop dance styles' },
    { id: 7, category: 'performances', image: img11, title: 'Freestyle', description: 'Express yourself through free-form dance' },
    { id: 8, category: 'performances', image: img12, title: 'Bharatanatyam', description: 'Classical South Indian dance form' },
    { id: 9, category: 'performances', image: img13, title: 'Wedding Dance', description: 'Beautiful choreography for special occasions' },
    { id: 10, category: 'performances', image: img14, title: 'Aerobics', description: 'High-energy fitness dance workout' },
    { id: 11, category: 'performances', image: img15, title: 'Couple Dance', description: 'Elegant partner dancing' },
    { id: 12, category: 'performances', image: img16, title: 'Salsa', description: 'Passionate Latin dance' },
    { id: 13, category: 'classes', image: img17, title: 'Yoga', description: 'Mind-body practice and flexibility' },
    { id: 14, category: 'classes', image: img18, title: 'Zumba', description: 'High-energy Zumba fitness dance' },
    { id: 15, category: 'performances', image: img19, title: 'Waacking', description: 'Dramatic arm movements from disco era' },
    { id: 16, category: 'performances', image: img20, title: 'Tutting', description: 'Geometric shapes with body and fingers' },
    { id: 17, category: 'performances', image: img22, title: 'Locking', description: 'Funky locking with signature pauses' },
    { id: 18, category: 'performances', image: img25, title: 'House Dance', description: 'Fast-paced house dance with footwork' },
    { id: 19, category: 'performances', image: img29, title: 'Popping', description: 'Iconic muscle contractions and animation' },
    
    // Studio Photos
    { id: 20, category: 'studio', image: img4, title: 'DDA Branding', description: 'Dream Dance Academy official logo' },
    { id: 21, category: 'studio', image: logoImage, title: 'Our Logo', description: 'Dream Dance Academy brand' },
    { id: 22, category: 'studio', image: img31, title: 'Studio Session', description: 'Students at the dance studio' },
    { id: 23, category: 'studio', image: img32, title: 'Dance Practice', description: 'Group dance practice session' },
    { id: 24, category: 'studio', image: img33, title: 'Team Photo', description: 'Academy team group photo' },
    { id: 25, category: 'studio', image: img34, title: 'Studio Life', description: 'Behind the scenes at DDA' },
    { id: 26, category: 'studio', image: img35, title: 'Academy Moments', description: 'Capturing special moments' },
    
    // Additional dance styles
    { id: 27, category: 'performances', image: img21, title: 'Dance Performance', description: 'Professional dance showcase' },
    { id: 28, category: 'performances', image: img23, title: 'Group Dance', description: 'Synchronized group performance' },
    { id: 29, category: 'performances', image: img24, title: 'Dance Crew', description: 'Our talented dance crew' },
    { id: 30, category: 'performances', image: img26, title: 'Stage Show', description: 'Live stage performance' },
    { id: 31, category: 'performances', image: img27, title: 'Dance Showcase', description: 'Annual showcase performance' },
    { id: 32, category: 'performances', image: img28, title: 'Competition', description: 'Dance competition performance' },
    { id: 33, category: 'performances', image: img30, title: 'Urban Dance', description: 'Street style urban dance' },
  ]

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter)

  return (
    <motion.div 
      className="page gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="gallery-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Gallery</span>
            <h1>Moments in <span className="highlight">Motion</span></h1>
            <p>Explore highlights from our performances, classes, and events. Every image tells a story of passion, dedication, and artistry.</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section gallery-section">
        <div className="container">
          {/* Filter */}
          <div className="gallery-filter">
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

          {/* Gallery Grid */}
          <motion.div className="gallery-grid" layout>
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`gallery-item ${item.horizontal ? 'horizontal' : ''}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="gallery-image">
                    <img src={item.image} alt={item.title} className="gallery-img" />
                  </div>
                  <div className="gallery-overlay">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <span className="view-btn">View</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
              <div className="lightbox-image">
                <img src={selectedImage.image} alt={selectedImage.title} className="lightbox-img" />
              </div>
              <div className="lightbox-info">
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
                <span className="lightbox-category">{selectedImage.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="section gallery-cta">
        <div className="container">
          <motion.div 
            className="gallery-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Be Part of Our Story</h2>
            <p>Join Dream Dance Academy and create your own memorable moments on stage.</p>
            <Link to="/enrollment" className="btn btn-gold">Start Your Journey</Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Gallery
