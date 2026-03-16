import { Link } from 'react-router-dom'
import { FileText, Shield, Scale } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LegalPages.css'

export default function Terms() {
  return (
    <div className="legal-page">
      <Header />
      <main className="main-content no-player">
        <div className="legal-hero">
          <div className="hero-content">
            <FileText size={48} color="#ff6b35" />
            <h1>Terms of Service</h1>
            <p>Last updated: March 1, 2026</p>
          </div>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Pamodzi, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </div>

          <div className="legal-section">
            <h2>2. Use License</h2>
            <p>Permission is granted to temporarily access the materials on Pamodzi for personal, non-commercial transitory viewing only.</p>
          </div>

          <div className="legal-section">
            <h2>3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account and any content you upload or share through the platform.</p>
          </div>

          <div className="legal-section">
            <h2>4. Intellectual Property</h2>
            <p>All content on Pamodzi, including music, text, graphics, and logos, is the property of Pamodzi or its content suppliers and is protected by copyright laws.</p>
          </div>

          <div className="legal-section">
            <h2>5. Prohibited Uses</h2>
            <p>You may not use our platform for any illegal purpose, to violate any laws, or to infringe on the rights of others.</p>
          </div>

          <div className="legal-section">
            <h2>6. Disclaimer</h2>
            <p>The materials on Pamodzi are provided on an 'as is' basis. Pamodzi makes no warranties, expressed or implied.</p>
          </div>

          <div className="legal-section">
            <h2>7. Limitations</h2>
            <p>In no event shall Pamodzi be liable for any damages arising out of the use or inability to use the materials on our platform.</p>
          </div>

          <div className="legal-section">
            <h2>8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the modified terms.</p>
          </div>

          <div className="legal-section">
            <h2>9. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us at legal@pamodzi.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
