import { Link } from 'react-router-dom'
import { ShoppingCart, Download, CreditCard, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ResourcePages.css'

export default function HowToBuy() {
  const steps = [
    {
      title: 'Find Your Music',
      description: 'Search or browse through our catalog to find the tracks you want.',
      icon: ShoppingCart
    },
    {
      title: 'Add to Cart',
      description: 'Click the download button on songs you want to purchase.',
      icon: ShoppingCart
    },
    {
      title: 'Checkout',
      description: 'Review your cart and proceed to secure checkout.',
      icon: CreditCard
    },
    {
      title: 'Download',
      description: 'After payment, download your tracks instantly in high quality.',
      icon: Download
    }
  ]

  return (
    <div className="resource-page">
      <Header />
      <main className="main-content no-player">
        <div className="resource-hero">
          <div className="hero-content">
            <ShoppingCart size={48} color="#ff6b35" />
            <h1>How to Buy Music</h1>
            <p>Simple steps to purchase and download your favorite tracks.</p>
          </div>
        </div>

        <div className="process-section">
          <h2>Purchase Process</h2>
          <div className="process-steps">
            {steps.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-icon-large">
                  <step.icon size={40} color="#ff6b35" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h2>Download Quality</h2>
            <p>All purchases include high-quality MP3 downloads (320kbps). Some tracks may also be available in FLAC format for audiophiles.</p>
          </div>
          <div className="info-card">
            <h2>License & Usage</h2>
            <p>Personal use: You can download and listen to your purchased music on any of your personal devices. Commercial use requires additional licensing.</p>
          </div>
          <div className="info-card">
            <h2>Refund Policy</h2>
            <p>Due to the digital nature of our products, refunds are only available in cases of technical issues that prevent download.</p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Start Building Your Collection</h2>
          <Link to="/music" className="btn btn-primary btn-lg">
            Browse Music
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
