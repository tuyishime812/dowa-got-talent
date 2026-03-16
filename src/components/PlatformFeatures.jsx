import { Music } from 'lucide-react'
import './PlatformFeatures.css'

const features = [
  {
    id: 'music',
    title: 'DGT SOUNDS MUSIC',
    description: "Stream hottest tracks",
    icon: Music,
    status: 'live',
    link: '/music'
  }
]

export default function PlatformFeatures() {
  return (
    <section className="platform-features">
      <div className="features-container">
        <div className="section-header">
          <h2 className="section-title">ONE PLATFORM. EVERY EXPERIENCE.</h2>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <a
              key={feature.id}
              href={feature.link}
              className={`feature-card ${feature.status}`}
            >
              <div className="feature-icon">
                <feature.icon size={32} />
              </div>
              <div className="feature-status">
                <span className="badge badge-live">Live</span>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
