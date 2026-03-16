import { Play, Headphones } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="now-playing">
            <span className="live-indicator"></span>
            Now Streaming
          </div>
          
          <h1 className="hero-title">
            DISCOVER AUTHENTIC ENTERTAINMENT
          </h1>
          
          <p className="hero-subtitle">
            Stream exclusive music, watch premium shows, and discover rising talent 
            from across the continent in stunning quality.
          </p>
          
          <div className="hero-cta">
            <Link to="/music" className="btn btn-primary">
              <Play size={18} />
              Start Streaming Free
            </Link>
            <Link to="/music" className="btn btn-secondary">
              <Headphones size={18} />
              Listen to New Music
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
