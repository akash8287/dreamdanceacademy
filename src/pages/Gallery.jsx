import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

// Import images
import mainBanner from '../../assets/WhatsApp Image 2026-01-19 at 19.07.44.jpeg'

// Import videos
import performanceVideo1 from '../../assets/WhatsApp Video 2026-01-19 at 19.21.54.mp4'
import performanceVideo2 from '../../assets/WhatsApp Video 2026-01-19 at 19.22.21.mp4'
import studioImage1 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21.jpeg'
import studioImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29.jpeg'
import studioImage3 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.30.jpeg'
import studioImage4 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21 (1).jpeg'
import studioImage5 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28 (1).jpeg'
import studioImage6 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29 (1).jpeg'
import hipHopImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24.jpeg'
import hipHopImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.27 (1).jpeg'
import kathakImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25 (1).jpeg'
import zumbaImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22.jpeg'
import classicalImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26.jpeg'
import classicalImage2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23 (1).jpeg'
import contemporaryImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23.jpeg'
import kuchipuriImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22 (1).jpeg'
import onlineClassImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24 (1).jpeg'
import summerClassImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.27.jpeg'
import promoImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28.jpeg'
import classPromoImage from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25.jpeg'

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [playingVideo, setPlayingVideo] = useState(null)
  const videoRef1 = useRef(null)
  const videoRef2 = useRef(null)

  const handleVideoPlay = (videoId) => {
    if (playingVideo === videoId) {
      // Pause the video
      if (videoId === 1 && videoRef1.current) {
        videoRef1.current.pause()
      } else if (videoId === 2 && videoRef2.current) {
        videoRef2.current.pause()
      }
      setPlayingVideo(null)
    } else {
      // Pause other video first
      if (videoRef1.current) videoRef1.current.pause()
      if (videoRef2.current) videoRef2.current.pause()
      
      // Play the selected video
      if (videoId === 1 && videoRef1.current) {
        videoRef1.current.play()
      } else if (videoId === 2 && videoRef2.current) {
        videoRef2.current.play()
      }
      setPlayingVideo(videoId)
    }
  }

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'performances', label: 'Performances' },
    { id: 'classes', label: 'Classes' },
    { id: 'events', label: 'Events' },
    { id: 'studio', label: 'Studio' }
  ]

  const galleryItems = [
    { id: 1, category: 'performances', image: mainBanner, title: 'Dream Dance Academy', description: 'Our academy entrance and signboard' },
    { id: 2, category: 'classes', image: classicalImage, title: 'Bharatanatyam Class', description: 'Classical dance training in progress' },
    { id: 3, category: 'events', image: summerClassImage, title: 'Summer Workshop', description: 'Intensive dance workshop with guest instructors' },
    { id: 4, category: 'studio', image: studioImage1, title: 'Main Studio', description: 'Our state-of-the-art dance floor' },
    { id: 5, category: 'performances', image: promoImage, title: 'Dance Showcase', description: 'Hip Hop, Bollywood, Freestyle & more' },
    { id: 6, category: 'classes', image: hipHopImage, title: 'Hip Hop Session', description: 'Best Hip Hop classes available' },
    { id: 7, category: 'events', image: classPromoImage, title: 'Dance Styles', description: 'All styles of dance available' },
    { id: 8, category: 'studio', image: studioImage2, title: 'LED Studio', description: 'Modern lighting and premium setup' },
    { id: 9, category: 'performances', image: contemporaryImage, title: 'Contemporary Piece', description: 'Best contemporary dance classes' },
    { id: 10, category: 'classes', image: kathakImage, title: 'Kathak Class', description: 'Traditional Indian dance training' },
    { id: 11, category: 'events', image: kuchipuriImage, title: 'Kuchipuri Dance', description: 'Classical South Indian dance form' },
    { id: 12, category: 'studio', image: studioImage3, title: 'Practice Area', description: 'Perfect for technique practice' },
    { id: 13, category: 'performances', image: zumbaImage, title: 'Zumba Classes', description: 'High-energy fitness dance' },
    { id: 14, category: 'classes', image: onlineClassImage, title: 'Online Classes', description: 'Learn from home with our online sessions' },
    { id: 15, category: 'events', image: classicalImage2, title: 'Bharatanatyam Show', description: 'Classical dance performances' },
    { id: 16, category: 'studio', image: studioImage5, title: 'Studio Interior', description: 'Modern dance studio setup' }
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
          <div className="video-grid-actual">
            <motion.div 
              className="video-card-actual"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="video-container" onClick={() => handleVideoPlay(1)}>
                <video 
                  ref={videoRef1}
                  src={performanceVideo1} 
                  className="performance-video"
                  playsInline
                  onEnded={() => setPlayingVideo(null)}
                />
                {playingVideo !== 1 && (
                  <div className="video-overlay-play">
                    <span className="play-icon">▶</span>
                  </div>
                )}
              </div>
              <div className="video-info">
                <h4>Dance Performance Showcase</h4>
                <p>Watch our talented dancers perform various styles</p>
              </div>
            </motion.div>
            <motion.div 
              className="video-card-actual"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="video-container" onClick={() => handleVideoPlay(2)}>
                <video 
                  ref={videoRef2}
                  src={performanceVideo2} 
                  className="performance-video"
                  playsInline
                  onEnded={() => setPlayingVideo(null)}
                />
                {playingVideo !== 2 && (
                  <div className="video-overlay-play">
                    <span className="play-icon">▶</span>
                  </div>
                )}
              </div>
              <div className="video-info">
                <h4>Academy Highlights</h4>
                <p>Experience the energy of Dream Dance Academy</p>
              </div>
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
