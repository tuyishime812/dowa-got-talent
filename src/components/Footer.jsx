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
                <span><a href="mailto:jeterothako276@gmail.com" style="color: inherit; text-decoration: none;">jeterothako276@gmail.com</a></span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span><a href="tel:+265991368564" style="color: inherit; text-decoration: none;">+265 991 368 564 (Malawi)</a></span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span><a href="tel:+972512563221" style="color: inherit; text-decoration: none;">051 256 3221 (Israel)</a></span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Lilongwe, Malawi</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="footer-social">
              <a href="https://www.facebook.com/share/1CQYbJFctv/" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Youtube size={20} />
              </a>
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
