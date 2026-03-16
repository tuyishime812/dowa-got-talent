import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import './PWAInstall.css'

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Don't show immediately, wait a bit
      setTimeout(() => {
        setShowInstall(true)
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setShowInstall(false)
    }
    
    setDeferredPrompt(null)
  }

  const handleClose = () => {
    setShowInstall(false)
  }

  if (!showInstall) return null

  return (
    <div className="pwa-install-banner">
      <div className="pwa-content">
        <div className="pwa-info">
          <span className="pwa-icon">🎵</span>
          <div>
            <h4>Install DGT Sounds</h4>
            <p>Get the app for a better experience</p>
          </div>
        </div>
        <div className="pwa-actions">
          <button className="btn-install" onClick={handleInstall}>
            <Download size={18} />
            Install
          </button>
          <button className="btn-close" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
