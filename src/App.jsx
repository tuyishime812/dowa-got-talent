import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useMusic } from './context/MusicContext'
import ProtectedRoute from './components/ProtectedRoute'
import Header from './components/Header'
import Footer from './components/Footer'
import MusicPlayer from './components/MusicPlayer'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'
import Top10 from './pages/Top10'
import SearchPage from './pages/SearchPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import SongDetail from './pages/SongDetail'
import FAQ from './pages/FAQ'
import Team from './pages/Team'
import Contact from './pages/Contact'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Legal from './pages/Legal'
import Pricing from './pages/Pricing'
import GettingStarted from './pages/GettingStarted'
import EarlyAccess from './pages/EarlyAccess'
import Dashboard from './pages/admin/Dashboard'
import AdminSongs from './pages/admin/Songs'
import AdminAlbums from './pages/admin/Albums'
import AdminArtists from './pages/admin/Artists'
import AdminUsers from './pages/admin/Users'
import AdminSettings from './pages/admin/Settings'
import './App.css'

// Pages with player
const pagesWithPlayer = [
  '/', '/music', '/top-10',
  '/faq', '/team', '/contact', '/song',
  '/terms', '/privacy', '/legal', '/search',
  '/pricing', '/getting-started', '/early-access'
]

function AppContent() {
  const { currentSong } = useMusic()
  const [currentPage, _] = useState('/')

  const handlePlaySong = () => {
    // This will be handled by MusicContext
  }

  const _showPlayer = pagesWithPlayer.includes(currentPage) && currentSong

  return (
    <div className="app">
      <Routes>
        {/* Auth Routes - No Header/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Public Site Routes */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home onPlaySong={handlePlaySong} />
              <Footer />
            </>
          }
        />
        <Route
          path="/music"
          element={
            <>
              <Header />
              <MusicPage onPlaySong={handlePlaySong} />
              <Footer />
            </>
          }
        />
        <Route
          path="/top-10"
          element={<Top10 />}
        />
        <Route
          path="/search"
          element={<SearchPage />}
        />
        <Route
          path="/song/:id"
          element={
            <>
              <Header />
              <SongDetail />
              <Footer />
            </>
          }
        />

        {/* Resource Routes */}
        <Route
          path="/faq"
          element={
            <>
              <Header />
              <FAQ />
              <Footer />
            </>
          }
        />
        <Route
          path="/getting-started"
          element={
            <>
              <Header />
              <GettingStarted />
              <Footer />
            </>
          }
        />
        <Route
          path="/early-access"
          element={
            <>
              <Header />
              <EarlyAccess />
              <Footer />
            </>
          }
        />

        {/* Company Routes */}
        <Route
          path="/team"
          element={
            <>
              <Header />
              <Team />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <Header />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route
          path="/pricing"
          element={
            <>
              <Header />
              <Pricing />
              <Footer />
            </>
          }
        />

        {/* Legal Routes */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/legal" element={<Legal />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/songs"
          element={
            <ProtectedRoute>
              <AdminSongs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/albums"
          element={
            <ProtectedRoute>
              <AdminAlbums />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/artists"
          element={
            <ProtectedRoute>
              <AdminArtists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Music Player - Shows on most pages */}
      {currentSong && <MusicPlayer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
