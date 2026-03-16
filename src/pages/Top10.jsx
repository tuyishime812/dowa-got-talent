import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Trophy, TrendingUp, Play, Heart, Download } from 'lucide-react'
import Header from '../components/Header'
import './Top10.css'

export default function Top10() {
  const [topSongs, setTopSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const { playSong, currentSong, isPlaying } = useMusic()

  useEffect(() => {
    fetchTopSongs()
    // Refresh top songs every 30 seconds to show real-time updates
    const interval = setInterval(fetchTopSongs, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchTopSongs = async () => {
    try {
      // Fetch songs with plays and downloads, calculate popularity score
      const { data, error } = await supabase
        .from('songs')
        .select(`
          *,
          artists (name)
        `)
        .order('play_count', { ascending: false })
        .limit(10)

      if (error) throw error

      // Calculate popularity score: plays + (downloads * 5)
      const ranked = data.map((song, index) => ({
        ...song,
        artist: song.artists?.name || 'Unknown',
        popularityScore: (song.play_count || 0) + ((song.download_count || 0) * 5),
        rank: index + 1
      }))

      // Sort by popularity score
      ranked.sort((a, b) => b.popularityScore - a.popularityScore)
      setTopSongs(ranked)
    } catch (error) {
      console.error('Error fetching top songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (song) => {
    const queue = topSongs.map(s => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
      audio_url: s.audio_url || s.audioUrl,
      cover_url: s.cover_url || s.coverUrl,
      is_downloadable: s.is_downloadable
    }))

    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url || song.audioUrl,
      cover_url: song.cover_url || song.coverUrl,
      is_downloadable: song.is_downloadable
    }, queue)
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy size={24} className="rank-icon gold" />
    if (rank === 2) return <Trophy size={24} className="rank-icon silver" />
    if (rank === 3) return <Trophy size={24} className="rank-icon bronze" />
    return <span className="rank-number">{rank}</span>
  }

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1'
    if (rank === 2) return 'rank-2'
    if (rank === 3) return 'rank-3'
    return ''
  }

  if (loading) {
    return (
      <div className="top10-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Top 10...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="top10-page">
      <Header />
      
      <div className="top10-hero">
        <div className="top10-header">
          <TrendingUp size={48} className="top10-icon" />
          <h1>🔥 Top 10 Trending</h1>
          <p>The hottest tracks right now, ranked by plays and downloads</p>
        </div>
      </div>

      <div className="top10-container">
        <div className="top10-list">
          {topSongs.map((song) => (
            <div
              key={song.id}
              className={`top10-card ${getRankClass(song.rank)} ${currentSong?.id === song.id ? 'playing' : ''}`}
            >
              <div className="song-rank">
                {getRankIcon(song.rank)}
              </div>

              <div className="song-cover-wrapper">
                <img
                  src={song.cover_url || 'https://via.placeholder.com/100x100/2d1f4e/ffffff?text=Music'}
                  alt={song.title}
                  className="song-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100/2d1f4e/ffffff?text=Music'
                  }}
                />
                <button
                  className="play-overlay"
                  onClick={() => handlePlay(song)}
                >
                  <Play size={32} fill="white" />
                </button>
              </div>

              <div className="song-info">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>

                <div className="song-stats">
                  <span className="stat" title="Plays">
                    <Play size={14} /> {song.play_count || 0}
                  </span>
                  <span className="stat" title="Downloads">
                    <Download size={14} /> {song.download_count || 0}
                  </span>
                </div>
              </div>

              <div className="song-actions">
                <button
                  className="btn-play"
                  onClick={() => handlePlay(song)}
                >
                  {currentSong?.id === song.id && isPlaying ? 'Playing' : 'Play'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
