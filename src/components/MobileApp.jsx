import { Smartphone, Download } from 'lucide-react'
import './MobileApp.css'

export default function MobileApp() {
  return (
    <section className="mobile-app">
      <div className="mobile-app-container">
        <div className="mobile-app-content">
          <div className="app-icon">
            <Smartphone size={64} />
          </div>
          
          <h2 className="app-title">DOWNLOAD OUR APPS</h2>
          <p className="app-subtitle">
            Experience DGT Sounds on mobile. Download our apps for iOS and Android
            and take your music everywhere you go.
          </p>
          
          <div className="app-badges">
            <span className="availability-badge">Available Now</span>
            
            <div className="store-buttons">
              <a href="#" className="store-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="store-text">
                  <span>Download on the</span>
                  <strong>App Store</strong>
                </div>
              </a>
              
              <a href="#" className="store-btn">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L3.84,2.15C3.84,2.15 6.05,2.66 6.05,2.66Z" />
                </svg>
                <div className="store-text">
                  <span>Get it on</span>
                  <strong>Google Play</strong>
                </div>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mobile-app-image">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="app-preview">
                <div className="preview-header">DGT SOUNDS</div>
                <div className="preview-content">
                  <div className="preview-song">
                    <div className="preview-cover"></div>
                    <div className="preview-info">
                      <div className="preview-title"></div>
                      <div className="preview-artist"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
