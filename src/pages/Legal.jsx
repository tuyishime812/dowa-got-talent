import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './LegalPages.css'

export default function Legal() {
  return (
    <div className="legal-page">
      <Header />
      <main className="main-content no-player">
        <div className="legal-hero">
          <div className="hero-content">
            <Scale size={48} color="#ff6b35" />
            <h1>Legal Information</h1>
            <p>Copyright, trademarks, and legal notices.</p>
          </div>
        </div>

        <div className="legal-content">
          <div className="legal-section">
            <h2>Copyright Notice</h2>
            <p>© 2026 Pamodzi Multimedia. All rights reserved. The content, design, graphics, and compilation of all content on this site are the exclusive property of Pamodzi Multimedia and are protected by copyright laws.</p>
          </div>

          <div className="legal-section">
            <h2>Trademark Notice</h2>
            <p>Pamodzi, the Pamodzi logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Pamodzi Multimedia. You must not use such marks without the prior written permission of Pamodzi.</p>
          </div>

          <div className="legal-section">
            <h2>Music Licensing</h2>
            <p>All music available on Pamodzi is licensed from respective copyright holders. Unauthorized reproduction, distribution, or public performance of copyrighted music is prohibited.</p>
          </div>

          <div className="legal-section">
            <h2>DMCA Compliance</h2>
            <p>Pamodzi respects intellectual property rights. If you believe your work has been copied in a way that constitutes copyright infringement, please submit a DMCA notice to dmca@pamodzi.com.</p>
          </div>

          <div className="legal-section">
            <h2>Content Guidelines</h2>
            <p>Artists and creators must own or have appropriate licenses for all content uploaded to Pamodzi. We reserve the right to remove any content that violates our guidelines.</p>
          </div>

          <div className="legal-section">
            <h2>Dispute Resolution</h2>
            <p>Any disputes arising from the use of this platform shall be governed by the laws of Malawi. Users agree to submit to the exclusive jurisdiction of courts in Lilongwe, Malawi.</p>
          </div>

          <div className="legal-section">
            <h2>Third-Party Links</h2>
            <p>Our platform may contain links to third-party websites. We are not responsible for the content or privacy practices of such sites.</p>
          </div>

          <div className="legal-section">
            <h2>Contact Legal Department</h2>
            <p>For legal inquiries, please contact us at legal@pamodzi.com or write to us at:</p>
            <address>
              Pamodzi Multimedia<br />
              Legal Department<br />
              Lilongwe, Malawi
            </address>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
