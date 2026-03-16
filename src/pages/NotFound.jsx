import { Link } from 'react-router-dom'
import { HelpCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <Header />
      <main className="main-content no-player">
        <div className="not-found-container">
          <div className="not-found-content">
            <HelpCircle size={80} color="#ff6b35" />
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you're looking for doesn't exist or has been moved.</p>
            <div className="not-found-actions">
              <Link to="/" className="btn btn-primary btn-lg">
                Go Home
              </Link>
              <Link to="/music" className="btn btn-secondary btn-lg">
                Browse Music
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
