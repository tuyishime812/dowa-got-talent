import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CompanyPages.css'

export default function Team() {
  return (
    <div className="company-page">
      <Header />
      <main className="main-content no-player">
        <div className="company-hero">
          <div className="hero-content">
            <h1>Our Team</h1>
            <p>Meet the founder behind Pamodzi.</p>
          </div>
        </div>

        <div className="team-section">
          <div className="team-grid" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <div className="team-card">
              <img src="https://via.placeholder.com/200x200/2d1f4e/ffffff?text=TM" alt="Tuyishime Martin" />
              <h3>Tuyishime Martin</h3>
              <p>CEO & Founder</p>
            </div>
          </div>
        </div>

        <div className="mission-section">
          <h2>Our Mission</h2>
          <p className="mission-text">
            To amplify voices and bring authentic entertainment to the world.
            We believe in the power of music and stories to connect people across borders
            and cultures.
          </p>
        </div>

        <div className="contact-cta">
          <h2>Get in Touch</h2>
          <p>Have questions or want to collaborate?</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Contact Us
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
