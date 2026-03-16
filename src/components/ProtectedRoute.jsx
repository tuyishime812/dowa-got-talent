import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // If not logged in, redirect to login
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login. Current path:', location.pathname)
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  console.log('ProtectedRoute: User authenticated, allowing access to:', location.pathname)
  // User is logged in, allow access to admin
  return children
}
