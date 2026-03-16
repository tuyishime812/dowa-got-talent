import { Play } from 'lucide-react'
import './AlbumCard.css'

export default function AlbumCard({ album, onPlay }) {
  const { title, artist, coverUrl, trackCount, featured } = album

  const handlePlayClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onPlay) {
      onPlay(album)
    }
  }

  return (
    <div className={`album-card ${featured ? 'featured' : ''}`}>
      {featured && (
        <div className="featured-badge">0{featured}</div>
      )}

      <div className="album-cover">
        <img
          src={coverUrl || 'https://via.placeholder.com/300x300/2d1f4e/ffffff?text=Album'}
          alt={title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300/2d1f4e/ffffff?text=Album'
          }}
        />
        <button 
          className="play-overlay" 
          onClick={handlePlayClick}
          type="button"
        >
          <Play size={32} fill="white" />
        </button>
      </div>

      <div className="album-info">
        <span className="album-number">{trackCount} Tracks</span>
        <h3 className="album-title">{title}</h3>
        <p className="album-artist">{artist}</p>
      </div>
    </div>
  )
}
