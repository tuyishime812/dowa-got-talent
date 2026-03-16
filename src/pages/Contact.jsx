import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CompanyPages.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="company-page">
      <Header />
      <main className="main-content no-player">
        <div className="company-hero">
          <div className="hero-content">
            <MessageSquare size={48} color="#ff6b35" />
            <h1>Contact Us</h1>
            <p>We'd love to hear from you. Get in touch with our team.</p>
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>Have a question or feedback? Reach out to us using any of the methods below.</p>
              
              <div className="contact-item">
                <Mail size={20} color="#ff6b35" />
                <div>
                  <h3>Email</h3>
                  <span><a href="mailto:jeterothako276@gmail.com" style="color: inherit; text-decoration: none;">jeterothako276@gmail.com</a></span>
                </div>
              </div>

              <div className="contact-item">
                <Phone size={20} color="#ff6b35" />
                <div>
                  <h3>Phone (Malawi)</h3>
                  <span><a href="tel:+265991368564" style="color: inherit; text-decoration: none;">+265 991 368 564</a></span>
                </div>
              </div>

              <div className="contact-item">
                <Phone size={20} color="#ff6b35" />
                <div>
                  <h3>Phone (Israel)</h3>
                  <span><a href="tel:+972512563221" style="color: inherit; text-decoration: none;">051 256 3221</a></span>
                </div>
              </div>
              
              <div className="contact-item">
                <MapPin size={20} color="#ff6b35" />
                <div>
                  <h3>Office</h3>
                  <p>Lilongwe, Malawi</p>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              {submitted ? (
                <div className="success-message">
                  <h3>Message Sent!</h3>
                  <p>Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
