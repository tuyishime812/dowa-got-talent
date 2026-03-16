import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import './Carousel.css'

export default function Carousel({ children, title, badge }) {
  const trackRef = useRef(null)

  const scroll = (direction) => {
    if (trackRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400
      trackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  return (
    <section className="carousel-section">
      <div className="carousel-container">
        <div className="section-header">
          <div className="section-title-with-badge">
            <h2 className="section-title">{title}</h2>
            {badge && <span className="badge badge-exclusive">{badge}</span>}
          </div>
        </div>

        <div className="carousel-wrapper">
          <button 
            className="carousel-nav prev" 
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="carousel-track" ref={trackRef}>
            {children}
          </div>

          <button 
            className="carousel-nav next" 
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
