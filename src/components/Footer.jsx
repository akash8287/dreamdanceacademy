import { Link } from 'react-router-dom'
import './Footer.css'

// Import QR code
import qrCodeImage from '../../assets/qr.jpeg'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-pattern"></div>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-icon">✦</span>
              <div className="logo-text">
                <span className="logo-name">Dream Dance</span>
                <span className="logo-tagline">Academy</span>
              </div>
            </Link>
            <p className="footer-description">
              Let your body speak, unleash the rhythm. Join us on a journey of self-expression
              through the art of dance. Organized by Shivam SMJ.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/classes">Our Classes</Link></li>
              <li><Link to="/instructors">Instructors</Link></li>
              <li><Link to="/schedule">Schedule</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Dance Styles</h4>
            <ul>
              <li><Link to="/classes">Bollywood</Link></li>
              <li><Link to="/classes">Hip Hop</Link></li>
              <li><Link to="/classes">Contemporary</Link></li>
              <li><Link to="/classes">K-Pop</Link></li>
              <li><Link to="/classes">Afro</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>More Styles</h4>
            <ul>
              <li><Link to="/classes">Ballet</Link></li>
              <li><Link to="/classes">Belly Dance</Link></li>
              <li><Link to="/classes">Waacking</Link></li>
              <li><Link to="/classes">Popping</Link></li>
              <li><Link to="/classes">Locking</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Get In Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <p>Bawana Road, Pehladpur<br />Near by Maan Medical</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <p>+91 7065910907<br />+91 9319205425</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <p>dreamdanceacademy28@gmail.com</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <p>www.dreamdanceacademy.in</p>
              </div>
            </div>
            <div className="footer-qr">
              <h4>Scan to Connect</h4>
              <img src={qrCodeImage} alt="Dream Dance Academy QR Code" className="footer-qr-img" />
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Dream Dance Academy. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
