import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <img src="/dowa_logo.png" alt="DGT Sounds" className="logo-icon" />
              <div className="logo-text">
                <span className="logo-name">DGT SOUNDS</span>
                <span className="logo-tagline">Authentic Entertainment</span>
              </div>
            </Link>
            <p className="footer-description">
              Stream exclusive music, watch premium shows, and discover rising talent
              from across the continent in stunning quality.
            </p>

            {/* Contact Info */}
            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span onClick={() => window.location.href = 'mailto:jeterothako276@gmail.com'} style={{cursor: 'pointer'}}>jeterothako276@gmail.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span onClick={() => window.location.href = 'tel:+265991368564'} style={{cursor: 'pointer'}}>+265 991 368 564</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span onClick={() => window.location.href = 'tel:+972512563221'} style={{cursor: 'pointer'}}>051 256 3221</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Lilongwe, Malawi</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="footer-social">
              <div className="social-link" onClick={() => window.open('https://www.facebook.com/share/1CQYbJFctv/', '_blank')} style={{cursor: 'pointer'}}>
                <Facebook size={20} />
              </div>
              <div className="social-link" onClick={() => window.open('https://twitter.com', '_blank')} style={{cursor: 'pointer'}}>
                <Twitter size={20} />
              </div>
              <div className="social-link" onClick={() => window.open('https://instagram.com', '_blank')} style={{cursor: 'pointer'}}>
                <Instagram size={20} />
              </div>
              <div className="social-link" onClick={() => window.open('https://youtube.com', '_blank')} style={{cursor: 'pointer'}}>
                <Youtube size={20} />
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="footer-links">
            <div className="footer-column">
              <h4>PLATFORM</h4>
              <Link to="/music">Music</Link>
              <Link to="/top-10">Top 10</Link>
            </div>

            <div className="footer-column">
              <h4>COMPANY</h4>
              <Link to="/team">Our Team</Link>
              <Link to="/contact">Contact Us</Link>
            </div>

            <div className="footer-column">
              <h4>LEGAL</h4>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/legal">Legal Notice</Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright">
            © 2026 DGT Sounds. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/legal">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
