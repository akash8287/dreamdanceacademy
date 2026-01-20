import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Instructors.css'

const Instructors = () => {
  const instructors = [
    {
      id: 1,
      name: 'Maria Santos',
      role: 'Founder & Artistic Director',
      specialty: 'Classical Ballet',
      experience: '25+ years',
      icon: '👩‍🎨',
      bio: 'Former principal dancer with the National Ballet, Maria founded Dream Dance Academy with a vision to make world-class dance education accessible to all.',
      achievements: ['National Ballet Principal', 'Choreographed 50+ productions', 'Dance Magazine Award Winner']
    },
    {
      id: 2,
      name: 'James Rivera',
      role: 'Hip Hop Director',
      specialty: 'Hip Hop & Street Dance',
      experience: '15+ years',
      icon: '🕺',
      bio: 'James has worked with top artists and dance crews worldwide. His innovative teaching style makes hip hop accessible while maintaining its authentic roots.',
      achievements: ['World Hip Hop Championship Judge', 'Celebrity choreographer', 'Viral dance creator']
    },
    {
      id: 3,
      name: 'Priya Nair',
      role: 'Classical Indian Dance',
      specialty: 'Kathak',
      experience: '20+ years',
      icon: '👩',
      bio: 'Trained under legendary gurus in India, Priya brings authentic Kathak traditions to our students while making it relevant for contemporary audiences.',
      achievements: ['Sangeet Natak Akademi recipient', 'International tour artist', 'Cultural ambassador']
    },
    {
      id: 4,
      name: 'Elena Volkov',
      role: 'Contemporary Lead',
      specialty: 'Contemporary & Modern',
      experience: '18+ years',
      icon: '👩‍🦰',
      bio: 'Elena combines technical precision with emotional depth. Her contemporary classes are known for pushing boundaries while nurturing individual expression.',
      achievements: ['Martha Graham Company alumna', 'International workshop leader', 'Choreography award winner']
    },
    {
      id: 5,
      name: 'Carlos Mendez',
      role: 'Latin Dance Specialist',
      specialty: 'Salsa & Latin',
      experience: '12+ years',
      icon: '🧑‍🦱',
      bio: 'Born in Cuba and raised on the dance floor, Carlos brings infectious energy and authentic Latin rhythms to every class.',
      achievements: ['World Salsa Champion', 'Dance studio owner', 'Social dance ambassador']
    },
    {
      id: 6,
      name: 'Sarah Kim',
      role: 'Jazz & Musical Theater',
      specialty: 'Jazz Dance',
      experience: '14+ years',
      icon: '👩‍🦳',
      bio: 'Broadway veteran Sarah brings theatrical magic to our jazz program, preparing students for stage performances and professional auditions.',
      achievements: ['Broadway performer', 'Music video choreographer', 'Dance competition judge']
    },
    {
      id: 7,
      name: 'Raj Patel',
      role: 'Bollywood Fusion',
      specialty: 'Bollywood & Fusion',
      experience: '10+ years',
      icon: '🧑',
      bio: 'Raj has choreographed for Bollywood films and brings that cinematic energy to his classes. His fusion style combines tradition with modern trends.',
      achievements: ['Bollywood film choreographer', 'TV show appearances', 'Wedding industry expert']
    },
    {
      id: 8,
      name: 'Lisa Thompson',
      role: 'Kids Program Director',
      specialty: 'Creative Movement',
      experience: '16+ years',
      icon: '👱‍♀️',
      bio: 'Lisa specializes in making dance fun and educational for young dancers. Her patient, encouraging approach helps children discover their love for movement.',
      achievements: ['Child development specialist', 'Curriculum designer', 'Teacher training mentor']
    }
  ]

  return (
    <motion.div 
      className="page instructors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className="instructors-hero">
        <div className="instructors-hero-bg"></div>
        <div className="container">
          <motion.div 
            className="instructors-hero-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="page-label">Our Team</span>
            <h1>Meet Our <span className="highlight">Instructors</span></h1>
            <p>World-class dancers and passionate educators dedicated to nurturing the next generation of artists.</p>
          </motion.div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="section instructors-section">
        <div className="container">
          <div className="instructors-grid">
            {instructors.map((instructor, index) => (
              <motion.div
                key={instructor.id}
                className="instructor-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="instructor-avatar">
                  <span className="avatar-icon">{instructor.icon}</span>
                </div>
                <div className="instructor-info">
                  <h3>{instructor.name}</h3>
                  <span className="instructor-role">{instructor.role}</span>
                  <div className="instructor-meta">
                    <span className="meta-item">
                      <span className="meta-icon">🎭</span>
                      {instructor.specialty}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      {instructor.experience}
                    </span>
                  </div>
                  <p>{instructor.bio}</p>
                  <div className="instructor-achievements">
                    <strong>Achievements:</strong>
                    <ul>
                      {instructor.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Team Section */}
      <section className="section section-primary join-section">
        <div className="container">
          <div className="join-grid">
            <motion.div 
              className="join-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label">Careers</span>
              <h2>Join Our Team</h2>
              <p>Are you a passionate dancer with a gift for teaching? We're always looking for talented instructors to join our growing family.</p>
              <ul className="join-benefits">
                <li>✓ Competitive compensation</li>
                <li>✓ Flexible scheduling</li>
                <li>✓ Professional development</li>
                <li>✓ Supportive community</li>
              </ul>
              <Link to="/contact" className="btn btn-gold">Apply Now</Link>
            </motion.div>
            <motion.div 
              className="join-visual"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="join-image">🤝</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section instructors-cta">
        <div className="container">
          <motion.div 
            className="instructors-cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Learn from the Best?</h2>
            <p>Book a trial class and experience our exceptional instruction firsthand.</p>
            <div className="cta-buttons">
              <Link to="/enrollment" className="btn btn-primary">Start Dancing</Link>
              <Link to="/schedule" className="btn btn-secondary">View Schedule</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Instructors
