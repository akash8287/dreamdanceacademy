import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'performances', label: 'Performances' },
    { id: 'classes', label: 'Classes' },
    { id: 'events', label: 'Events' },
    { id: 'studio', label: 'Studio' }
  ]

  const galleryItems = [
    { id: 1, category: 'performances', icon: '🎭', title: 'Annual Showcase 2024', description: 'Our biggest event featuring all dance styles' },
    { id: 2, category: 'classes', icon: '🩰', title: 'Ballet Class', description: 'Classical training in progress' },
    { id: 3, category: 'events', icon: '🎉', title: 'Summer Workshop', description: 'Intensive dance workshop with guest instructors' },
    { id: 4, category: 'studio', icon: '🏛️', title: 'Main Studio', description: 'Our state-of-the-art dance floor' },
    { id: 5, category: 'performances', icon: '💃', title: 'Latin Night', description: 'Salsa and bachata performances' },
    { id: 6, category: 'classes', icon: '🔥', title: 'Hip Hop Session', description: 'Breaking it down with James' },
    { id: 7, category: 'events', icon: '🏆', title: 'Competition Winners', description: 'Our team at nationals' },
    { id: 8, category: 'studio', icon: '🎵', title: 'Sound System', description: 'Premium audio equipment' },
    { id: 9, category: 'performances', icon: '✨', title: 'Contemporary Piece', description: 'Emotional storytelling through dance' },
    { id: 10, category: 'classes', icon: '🪘', title: 'Kathak Class', description: 'Traditional Indian dance training' },
    { id: 11, category: 'events', icon: '🎬', title: 'Bollywood Night', description: 'Celebrating Indian cinema through dance' },
    { id: 12, category: 'studio', icon: '🪞', title: 'Mirror Wall', description: 'Perfect for technique practice' },
    { id: 13, category: 'performances', icon: '🌟', title: 'Jazz Showcase', description: 'High-energy jazz performance' },
    { id: 14, category: 'classes', icon: '👧', title: 'Kids Program', description: 'Young dancers learning the basics' },
    { id: 15, category: 'events', icon: '🎊', title: 'Year End Celebration', description: 'Celebrating our achievements' },
    { id: 16, category: 'performances', icon: '🎪', title: 'Fusion Show', description: 'Blending multiple dance styles' }
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
                  className="gallery-item"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  onClick={() => setSelectedImage(item)}
                >
                  <div className="gallery-image">
                    <span className="image-icon">{item.icon}</span>
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
                <span className="lightbox-icon">{selectedImage.icon}</span>
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

      {/* Video Section */}
      <section className="section section-dark video-section">
        <div className="container">
          <motion.div 
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span>Featured</span>
            <h2>Watch Our Performances</h2>
            <div className="decorative-line"></div>
          </motion.div>
          <div className="video-grid">
            <motion.div 
              className="video-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="video-thumbnail">
                <span className="thumbnail-icon">🎬</span>
                <span className="play-btn">▶</span>
              </div>
              <h4>Annual Showcase 2024 Highlights</h4>
            </motion.div>
            <motion.div 
              className="video-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="video-thumbnail">
                <span className="thumbnail-icon">🩰</span>
                <span className="play-btn">▶</span>
              </div>
              <h4>Ballet Gala Performance</h4>
            </motion.div>
            <motion.div 
              className="video-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="video-thumbnail">
                <span className="thumbnail-icon">🔥</span>
                <span className="play-btn">▶</span>
              </div>
              <h4>Hip Hop Battle Championship</h4>
            </motion.div>
          </div>
        </div>
      </section>

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
