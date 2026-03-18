import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, Music, Disc, Mic2, Users, Settings, LogOut, 
  Menu, X, Download, PlayCircle
} from 'lucide-react'
import './Admin.css'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut, isAdmin } = useAuth()

  console.log('AdminLayout: user =', user, 'isAdmin =', isAdmin, 'location =', location.pathname)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // If no user, let ProtectedRoute handle it
  if (!user) {
    return null
  }

  // Redirect if not admin
  if (!isAdmin) {
    console.log('AdminLayout: User is not admin')
    return (
      <div className="admin-layout">
        <div className="not-authorized">
          <h2>Not Authorized</h2>
          <p>You don't have admin access.</p>
          <button onClick={handleSignOut} className="btn btn-primary">Sign Out</button>
        </div>
      </div>
    )
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/songs', icon: Music, label: 'Songs' },
    { path: '/admin/albums', icon: Disc, label: 'Albums' },
    { path: '/admin/artists', icon: Mic2, label: 'Artists' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <Music size={28} />
            {sidebarOpen && <span>PAMODZI</span>}
          </Link>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="user-details">
                <span className="user-email">{user?.email}</span>
                <span className="user-role">Admin</span>
              </div>
            )}
          </div>
          <button className="nav-item logout-btn" onClick={handleSignOut}>
            <LogOut size={20} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h1 className="page-title">
              {navItems.find(item => item.path === location.pathname)?.label || 'Admin'}
            </h1>
          </div>
          <div className="header-actions">
            <a
              href={import.meta.env.VITE_SITE_URL || window.location.origin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <PlayCircle size={16} />
              View Site
            </a>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  )
}
