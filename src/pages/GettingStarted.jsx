import { Link } from 'react-router-dom'
import { Book, Play, CheckCircle, ArrowRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ResourcePages.css'

export default function GettingStarted() {
  const steps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up for free and get instant access to our music library.',
      icon: CheckCircle
    },
    {
      step: 2,
      title: 'Explore Music',
      description: 'Browse thousands of tracks from artists across all genres.',
      icon: Play
    },
    {
      step: 3,
      title: 'Create Playlists',
      description: 'Save your favorite songs and create custom playlists.',
      icon: Book
    },
    {
      step: 4,
      title: 'Download & Enjoy',
      description: 'Download tracks for offline listening (when available).',
      icon: CheckCircle
    }
  ]

  return (
    <div className="resource-page">
      <Header />
      <main className="main-content no-player">
        <div className="resource-hero">
          <div className="hero-content">
            <Book size={48} color="#ff6b35" />
            <h1>Getting Started</h1>
            <p>Everything you need to know to start your Pamodzi journey.</p>
          </div>
        </div>

        <div className="steps-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            {steps.map((item) => (
              <div key={item.step} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">
                  <item.icon size={32} color="#ff6b35" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-links-section">
          <h2>Quick Links</h2>
          <div className="quick-links-grid">
            <Link to="/how-to-buy" className="quick-link-card">
              <ArrowRight size={24} color="#ff6b35" />
              <h3>How to Buy Music</h3>
              <p>Learn about purchasing and downloading tracks.</p>
            </Link>
            <Link to="/payment-methods" className="quick-link-card">
              <ArrowRight size={24} color="#4a3b6e" />
              <h3>Payment Methods</h3>
              <p>See all available payment options.</p>
            </Link>
            <Link to="/faq" className="quick-link-card">
              <ArrowRight size={24} color="#22c55e" />
              <h3>FAQ</h3>
              <p>Find answers to common questions.</p>
            </Link>
            <Link to="/creator-studio" className="quick-link-card">
              <ArrowRight size={24} color="#ff6b35" />
              <h3>Creator Studio</h3>
              <p>Start uploading your own music.</p>
            </Link>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Get Started?</h2>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
