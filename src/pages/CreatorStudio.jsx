import { Link } from 'react-router-dom'
import { Headphones, Video, DollarSign, Users, Music } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CreatorStudio.css'

export default function CreatorStudio() {
  const features = [
    {
      icon: Music,
      title: 'Upload Music',
      description: 'Upload your tracks and reach millions of listeners.'
    },
    {
      icon: Video,
      title: 'Video Content',
      description: 'Share music videos and behind-the-scenes content.'
    },
    {
      icon: DollarSign,
      title: 'Monetization',
      description: 'Earn from streams, downloads, and direct fan support.'
    },
    {
      icon: Users,
      title: 'Fan Engagement',
      description: 'Build your community with direct fan interactions.'
    }
  ]

  return (
    <div className="creator-studio-page">
      <Header />
      <main className="main-content no-player">
        <div className="creator-hero">
          <div className="hero-content">
            <h1>CREATOR STUDIO</h1>
            <p>Your all-in-one platform to create, share, and monetize your content.</p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started Free
              </Link>
              <Link to="/how-to-buy" className="btn btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Everything You Need to Succeed</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={40} color="#ff6b35" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <h3>10K+</h3>
            <p>Active Creators</p>
          </div>
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Tracks Uploaded</p>
          </div>
          <div className="stat-item">
            <h3>1M+</h3>
            <p>Monthly Listeners</p>
          </div>
          <div className="stat-item">
            <h3>$500K+</h3>
            <p>Creator Earnings</p>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready to Share Your Talent?</h2>
          <p>Join thousands of creators already on Pamodzi.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Create Your Account
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
