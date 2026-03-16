import { Play } from 'lucide-react'
import './SongGrid.css'

export default function SongGrid({ songs, onPlay, title, badge }) {
  return (
    <section className="song-grid-section">
      <div className="song-grid-container">
        <div className="section-header">
          <div className="section-title-with-badge">
            <h2 className="section-title">{title}</h2>
            {badge && <span className="badge badge-exclusive">{badge}</span>}
          </div>
        </div>

        <div className="song-grid">
          {songs.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => onPlay(song)}
            >
              <div className="song-card-cover">
                <img
                  src={song.coverUrl || 'https://via.placeholder.com/200'}
                  alt={song.title}
                />
                <div className="play-overlay">
                  <Play size={32} fill="white" />
                </div>
              </div>
              <div className="song-card-info">
                <h3 className="song-card-title">{song.title}</h3>
                <p className="song-card-artist">{song.artist}</p>
                <div className="song-card-stats">
                  <span className="stat">
                    ▶ {song.playCount?.toLocaleString() || 0}
                  </span>
                  <span className="stat">
                    ⬇ {song.downloadCount?.toLocaleString() || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
