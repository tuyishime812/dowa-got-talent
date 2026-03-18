import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/admin/AdminLayout'
import { Music, Disc, Mic2, TrendingUp, Download, Play } from 'lucide-react'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({
    songs: 0,
    albums: 0,
    artists: 0,
    plays: 0,
    downloads: 0
  })
  const [recentSongs, setRecentSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      await Promise.all([fetchStats(), fetchRecentSongs()])
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Fetch counts in parallel
      const [songsRes, albumsRes, artistsRes] = await Promise.all([
        supabase.from('songs').select('id', { count: 'exact', head: true }),
        supabase.from('albums').select('id', { count: 'exact', head: true }),
        supabase.from('artists').select('id', { count: 'exact', head: true })
      ])

      // Fetch total plays and downloads
      const playsRes = await supabase.from('songs').select('play_count')
      const downloadsRes = await supabase.from('songs').select('download_count')

      const totalPlays = playsRes.data?.reduce((sum, s) => sum + (s.play_count || 0), 0) || 0
      const totalDownloads = downloadsRes.data?.reduce((sum, s) => sum + (s.download_count || 0), 0) || 0

      setStats({
        songs: songsRes.count || 0,
        albums: albumsRes.count || 0,
        artists: artistsRes.count || 0,
        plays: totalPlays,
        downloads: totalDownloads
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError('Failed to load statistics: ' + error.message)
    }
  }

  const fetchRecentSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select(`
          id,
          title,
          cover_url,
          play_count,
          download_count,
          created_at,
          artists (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentSongs(data || [])
    } catch (error) {
      console.error('Error fetching recent songs:', error)
    }
  }

  const statCards = [
    { title: 'Total Songs', value: stats.songs, icon: Music, color: '#ff6b35' },
    { title: 'Total Albums', value: stats.albums, icon: Disc, color: '#4a3b6e' },
    { title: 'Total Artists', value: stats.artists, icon: Mic2, color: '#22c55e' },
    { title: 'Total Plays', value: stats.plays.toLocaleString(), icon: Play, color: '#3b82f6' },
    { title: 'Total Downloads', value: stats.downloads.toLocaleString(), icon: Download, color: '#8b5cf6' }
  ]

  return (
    <AdminLayout>
      <div className="dashboard">
        {error && (
          <div className="error-banner">
            <h3>⚠️ Error Loading Dashboard</h3>
            <p>{error}</p>
            <button onClick={fetchAllData} className="btn btn-secondary">Retry</button>
          </div>
        )}

        <div className="stats-grid">
          {statCards.map((stat, index) => (
            <div key={index} className="stat-card">
              <div 
                className="stat-icon" 
                style={{ background: `${stat.color}20`, color: stat.color }}
              >
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.title}</span>
                <span className="stat-value">{loading ? '-' : stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="recent-section">
          <h2 className="section-title">Recently Added Songs</h2>
          {loading ? (
            <div className="loading">Loading recent songs...</div>
          ) : recentSongs.length === 0 ? (
            <div className="no-items">
              <p>No songs yet. Add your first song!</p>
              <a href="/admin/songs" className="btn btn-primary">Add Song</a>
            </div>
          ) : (
            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Artist</th>
                    <th>Plays</th>
                    <th>Downloads</th>
                    <th>Date Added</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSongs.map((song) => (
                    <tr key={song.id}>
                      <td>
                        <img 
                          src={song.cover_url || 'https://via.placeholder.com/40'} 
                          alt={song.title} 
                          className="song-cover" 
                        />
                      </td>
                      <td className="song-title-cell">{song.title}</td>
                      <td>{song.artists?.name || 'Unknown'}</td>
                      <td>{song.play_count || 0}</td>
                      <td>{song.download_count || 0}</td>
                      <td>{new Date(song.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
