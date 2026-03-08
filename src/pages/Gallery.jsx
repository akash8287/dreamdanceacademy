import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

import galleryItems, { galleryFilters } from '../constants/galleryImages'

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)

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
            {galleryFilters.map((filter) => (
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
