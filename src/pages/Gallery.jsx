import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Gallery.css'

// Import logo
import logoImage from '../../assets/logo.jpeg'

// Import videos
import performanceVideo1 from '../../assets/WhatsApp Video 2026-01-19 at 19.21.54.mp4'
import performanceVideo2 from '../../assets/WhatsApp Video 2026-01-19 at 19.22.21.mp4'

// Import all professional dance images - Jan 21
import danceImg1 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.39.jpeg'
import danceImg2 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42.jpeg'
import danceImg3 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42 (1).jpeg'
import danceImg4 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42 (2).jpeg'
import danceImg5 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.42 (3).jpeg'
import danceImg6 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.43.jpeg'
import danceImg7 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.43 (1).jpeg'
import danceImg8 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.44.jpeg'
import danceImg9 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.44 (1).jpeg'
import danceImg10 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.46.jpeg'
import danceImg11 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.46 (1).jpeg'
import danceImg12 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.46 (2).jpeg'
import danceImg13 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.47.jpeg'
import danceImg14 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.47 (1).jpeg'
import danceImg15 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.48.jpeg'
import danceImg16 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.49.jpeg'
import danceImg17 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.49 (1).jpeg'
import danceImg18 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.49 (2).jpeg'
import danceImg19 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.50.jpeg'
import danceImg20 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.51.jpeg'
import danceImg21 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.51 (1).jpeg'
import danceImg22 from '../../assets/WhatsApp Image 2026-01-21 at 10.14.55.jpeg'

// Import studio/event images - Jan 21 (10.13.xx series)
import studioImg1 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.50.jpeg'
import studioImg2 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.51.jpeg'
import studioImg3 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.51 (1).jpeg'
import studioImg4 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.51 (2).jpeg'
import studioImg5 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.51 (3).jpeg'
import studioImg6 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.52.jpeg'
import studioImg7 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.52 (1).jpeg'
import studioImg8 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.52 (2).jpeg'
import studioImg9 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.53.jpeg'
import studioImg10 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.53 (1).jpeg'
import studioImg11 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.53 (2).jpeg'
import studioImg12 from '../../assets/WhatsApp Image 2026-01-21 at 10.13.54.jpeg'

// Import older images - Jan 19 & 20
import oldImg1 from '../../assets/WhatsApp Image 2026-01-19 at 19.07.44.jpeg'
import oldImg2 from '../../assets/WhatsApp Image 2026-01-20 at 19.02.26.jpeg'

// Import all old Jan 19 images
import old19Img1 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21.jpeg'
import old19Img2 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.21 (1).jpeg'
import old19Img3 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22.jpeg'
import old19Img4 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.22 (1).jpeg'
import old19Img5 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23.jpeg'
import old19Img6 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23 (1).jpeg'
import old19Img7 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.23 (2).jpeg'
import old19Img8 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24.jpeg'
import old19Img9 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24 (1).jpeg'
import old19Img10 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.24 (2).jpeg'
import old19Img11 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25.jpeg'
import old19Img12 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25 (1).jpeg'
import old19Img13 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.25 (2).jpeg'
import old19Img14 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26.jpeg'
import old19Img15 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26 (1).jpeg'
import old19Img16 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.26 (2).jpeg'
import old19Img17 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.27.jpeg'
import old19Img18 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.27 (1).jpeg'
import old19Img19 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.27 (2).jpeg'
import old19Img20 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28.jpeg'
import old19Img21 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28 (1).jpeg'
import old19Img22 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.28 (2).jpeg'
import old19Img23 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29.jpeg'
import old19Img24 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29 (1).jpeg'
import old19Img25 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.29 (2).jpeg'
import old19Img26 from '../../assets/WhatsApp Image 2026-01-19 at 19.22.30.jpeg'

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
    // Professional Dance Photos - Performances
    { id: 1, category: 'performances', image: danceImg1, title: 'Dream Dance Academy', description: 'Professional group performance showcase' },
    { id: 2, category: 'performances', image: danceImg8, title: 'Contemporary Ensemble', description: 'Large group contemporary performance' },
    { id: 3, category: 'performances', image: danceImg10, title: 'Dynamic Group Dance', description: 'Energetic jumping pose performance' },
    { id: 4, category: 'performances', image: danceImg4, title: 'Kathak Performance', description: 'Classical Kathak dancers on stage' },
    { id: 5, category: 'performances', image: danceImg22, title: 'Folk Dance Show', description: 'Colorful traditional folk performance' },
    
    // Classes
    { id: 6, category: 'classes', image: danceImg6, title: 'Hip Hop Class', description: 'Urban dance training session' },
    { id: 7, category: 'classes', image: danceImg15, title: 'Zumba Session', description: 'High-energy fitness dance class' },
    { id: 8, category: 'classes', image: danceImg2, title: 'Bollywood Dance', description: 'Kids learning Bollywood choreography' },
    { id: 9, category: 'classes', image: danceImg3, title: 'Classical Training', description: 'Traditional dance techniques' },
    { id: 10, category: 'classes', image: danceImg19, title: 'Street Dance', description: 'Urban street dance training' },
    { id: 11, category: 'classes', image: danceImg20, title: 'Group Practice', description: 'Students practicing choreography' },
    
    // Events
    { id: 12, category: 'events', image: danceImg13, title: 'Kids Performance', description: 'Young dancers at annual showcase' },
    { id: 13, category: 'events', image: danceImg14, title: 'Dance Competition', description: 'Competition team rehearsal' },
    { id: 14, category: 'events', image: danceImg16, title: 'Annual Day', description: 'Annual day celebrations' },
    { id: 15, category: 'events', image: danceImg17, title: 'Jazz Performance', description: 'Elegant jazz dance showcase' },
    { id: 16, category: 'events', image: danceImg18, title: 'Contemporary Show', description: 'Fusion dance presentation' },
    
    // Studio
    { id: 17, category: 'studio', image: studioImg1, title: 'Academy Event', description: 'Birthday celebration at studio' },
    { id: 18, category: 'studio', image: studioImg2, title: 'Dance Practice', description: 'Group practice session' },
    { id: 19, category: 'studio', image: studioImg3, title: 'Kids Program', description: 'Children dance performance' },
    { id: 20, category: 'studio', image: studioImg4, title: 'Admin Office', description: 'Our registration desk' },
    { id: 21, category: 'studio', image: studioImg5, title: 'Trophy Display', description: 'Awards and achievements' },
    { id: 22, category: 'studio', image: studioImg6, title: 'Group Photo', description: 'Dance batch group picture' },
    
    // More Performances
    { id: 23, category: 'performances', image: danceImg5, title: 'Group Formation', description: 'Choreographed group formation' },
    { id: 24, category: 'performances', image: danceImg7, title: 'Hip Hop Crew', description: 'Urban dance crew showcase' },
    { id: 25, category: 'performances', image: danceImg9, title: 'Stage Performance', description: 'Professional stage show' },
    { id: 26, category: 'performances', image: danceImg11, title: 'Dance Troupe', description: 'Academy dance troupe' },
    { id: 27, category: 'performances', image: danceImg12, title: 'Fusion Dance', description: 'Contemporary fusion piece' },
    { id: 28, category: 'performances', image: danceImg21, title: 'Urban Performance', description: 'Street style performance' },
    
    // More Studio/Events
    { id: 29, category: 'studio', image: studioImg7, title: 'Practice Session', description: 'Daily practice at studio' },
    { id: 30, category: 'events', image: studioImg9, title: 'Workshop', description: 'Special dance workshop' },
    { id: 31, category: 'studio', image: studioImg10, title: 'Student Group', description: 'Our talented students' },
    { id: 32, category: 'events', image: studioImg11, title: 'Event Day', description: 'Special event celebration' },
    { id: 33, category: 'studio', image: studioImg12, title: 'Academy Tour', description: 'Inside Dream Dance Academy' },
    { id: 34, category: 'events', image: oldImg1, title: 'Academy Banner', description: 'Dream Dance Academy signboard' },
    { id: 35, category: 'studio', image: oldImg2, title: 'Studio Setup', description: 'Professional dance studio' },
    { id: 36, category: 'studio', image: logoImage, title: 'Our Logo', description: 'Dream Dance Academy brand' },
    
    // Old Gallery Images - Jan 19 (Original Collection)
    { id: 37, category: 'studio', image: old19Img1, title: 'Dance Studio', description: 'Professional dance floor' },
    { id: 38, category: 'classes', image: old19Img2, title: 'Group Class', description: 'Dance training session' },
    { id: 39, category: 'classes', image: old19Img3, title: 'Zumba Class', description: 'High-energy fitness dance' },
    { id: 40, category: 'classes', image: old19Img4, title: 'Bollywood Class', description: 'Bollywood choreography session' },
    { id: 41, category: 'performances', image: old19Img5, title: 'Stage Show', description: 'Contemporary dance piece' },
    { id: 42, category: 'performances', image: old19Img6, title: 'Classical Dance', description: 'Bharatanatyam performance' },
    { id: 43, category: 'performances', image: old19Img7, title: 'Group Performance', description: 'Dance troupe on stage' },
    { id: 44, category: 'classes', image: old19Img8, title: 'Hip Hop Training', description: 'Urban dance class' },
    { id: 45, category: 'events', image: old19Img9, title: 'Online Classes', description: 'Virtual dance sessions' },
    { id: 46, category: 'events', image: old19Img10, title: 'Workshop Session', description: 'Special dance workshop' },
    { id: 47, category: 'events', image: old19Img11, title: 'Dance Styles', description: 'Multiple dance styles offered' },
    { id: 48, category: 'classes', image: old19Img12, title: 'Kathak Class', description: 'Classical Kathak training' },
    { id: 49, category: 'events', image: old19Img13, title: 'Summer Program', description: 'Summer dance workshop' },
    { id: 50, category: 'performances', image: old19Img14, title: 'Classical Show', description: 'Traditional dance performance' },
    { id: 51, category: 'performances', image: old19Img15, title: 'Kuchipudi', description: 'South Indian classical dance' },
    { id: 52, category: 'performances', image: old19Img16, title: 'Dance Recital', description: 'Annual dance recital' },
    { id: 53, category: 'events', image: old19Img17, title: 'Summer Classes', description: 'Summer camp activities' },
    { id: 54, category: 'performances', image: old19Img18, title: 'Hip Hop Show', description: 'Urban dance showcase' },
    { id: 55, category: 'events', image: old19Img19, title: 'Dance Event', description: 'Special dance event' },
    { id: 56, category: 'events', image: old19Img20, title: 'Academy Promo', description: 'Dance academy promotion' },
    { id: 57, category: 'studio', image: old19Img21, title: 'Studio Interior', description: 'Inside our academy' },
    { id: 58, category: 'studio', image: old19Img22, title: 'Practice Room', description: 'Dance practice area' },
    { id: 59, category: 'studio', image: old19Img23, title: 'LED Dance Floor', description: 'Modern dance studio' },
    { id: 60, category: 'studio', image: old19Img24, title: 'Studio Setup', description: 'Professional dance setup' },
    { id: 61, category: 'studio', image: old19Img25, title: 'Dance Room', description: 'Spacious dance room' },
    { id: 62, category: 'studio', image: old19Img26, title: 'Studio View', description: 'Beautiful studio space' }
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
