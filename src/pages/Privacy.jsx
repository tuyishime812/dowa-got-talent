import { Link } from 'react-router-dom'
import { Shield, Lock, Eye, Database } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LegalPages.css'

export default function Privacy() {
  return (
    <div className="legal-page">
      <Header />
      <main className="main-content no-player">
        <div className="legal-hero">
          <div className="hero-content">
            <Shield size={48} color="#ff6b35" />
            <h1>Privacy Policy</h1>
            <p>Last updated: March 1, 2026</p>
          </div>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly to us, including your name, email address, and payment information when you create an account or make a purchase.</p>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information.</p>
          </div>

          <div className="legal-section">
            <h2>3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information with service providers who perform services on our behalf.</p>
          </div>

          <div className="legal-section">
            <h2>4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
          </div>

          <div className="legal-section">
            <h2>5. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.</p>
          </div>

          <div className="legal-section">
            <h2>6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data.</p>
          </div>

          <div className="legal-section">
            <h2>7. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to provide our services and comply with our legal obligations.</p>
          </div>

          <div className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to Privacy Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
          </div>

          <div className="legal-section">
            <h2>10. Contact Us</h2>
            <p>For questions about this Privacy Policy, please contact us at privacy@pamodzi.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
