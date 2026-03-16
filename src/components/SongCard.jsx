import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import './SongCard.css'

export default function SongCard({ song, onPlay }) {
  const { title, artist, coverUrl, duration, id } = song

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onPlay) {
      onPlay(song)
    }
  }

  return (
    <Link to={`/song/${id}`} className="song-card-link">
      <div className="song-card">
        <div className="song-cover">
          <img
            src={coverUrl || 'https://via.placeholder.com/150x150/2d1f4e/ffffff?text=Music'}
            alt={title}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x150/2d1f4e/ffffff?text=Music'
            }}
          />
          <button
            className="play-overlay"
            onClick={handlePlayClick}
            type="button"
          >
            <Play size={24} fill="white" />
          </button>
        </div>

        <div className="song-info">
          <h3 className="song-title">{title}</h3>
          <p className="song-artist">{artist}</p>
          {duration && (
            <span className="song-duration">{formatDuration(duration)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
