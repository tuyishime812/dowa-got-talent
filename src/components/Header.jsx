import { Link, useNavigate } from 'react-router-dom'
import { Menu, Search, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Header.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/dowa_logo.png" alt="DGT Sounds" className="logo-icon" />
          <div className="logo-text">
            <span className="logo-name">DGT SOUNDS</span>
            <span className="logo-tagline">Now Streaming</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div className="nav-item dropdown">
            <button className="nav-link">
              PLATFORM
            </button>
            <div className="dropdown-menu">
              <Link to="/music" className="dropdown-item">
                <span className="status-dot live"></span>
                Music
              </Link>
              <Link to="/top-10" className="dropdown-item">
                <span className="status-dot live"></span>
                🔥 Top 10
              </Link>
            </div>
          </div>

          <div className="nav-item dropdown">
            <button className="nav-link">
              COMPANY
            </button>
            <div className="dropdown-menu">
              <Link to="/team" className="dropdown-item">Our Team</Link>
              <Link to="/contact" className="dropdown-item">Contact Us</Link>
            </div>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="header-actions">
          {/* Search */}
          <a
            href="/search"
            className="action-btn search-btn"
            title="Advanced Search"
          >
            <Search size={20} />
          </a>

          {/* Login/Logout */}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="btn btn-sm btn-secondary">
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              )}
              <button className="btn btn-sm btn-secondary" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : null}

          {/* Mobile Menu Button */}
          <button
            className="action-btn mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <div className="mobile-nav-section">
              <h4>PLATFORM</h4>
              <Link to="/music" onClick={() => setMobileMenuOpen(false)}>Music</Link>
              <Link to="/top-10" onClick={() => setMobileMenuOpen(false)}>🔥 Top 10</Link>
            </div>
            <div className="mobile-nav-section">
              <h4>COMPANY</h4>
              <Link to="/team" onClick={() => setMobileMenuOpen(false)}>Our Team</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>
            </div>
            <div className="mobile-nav-section mobile-auth">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="mobile-link btn-block">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="mobile-link btn-block">
                    Sign Out
                  </button>
                </>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
