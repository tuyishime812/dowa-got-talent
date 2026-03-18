import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, Music, X, Check, Share2 } from 'lucide-react'
import './Songs.css'

export default function AdminSongs() {
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSong, setEditingSong] = useState(null)
  const [genres, setGenres] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    album_name: '',
    audio_url: '',
    cover_url: '',
    duration: '',
    genre_id: '',
    is_downloadable: true,
    featured: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchSongs()
    fetchGenres()
  }, [])

  const fetchSongs = async () => {
    try {
      const { data: songsData } = await supabase
        .from('songs')
        .select(`
          *,
          artists (name),
          albums (title),
          song_genres (genre_id),
          genres (name)
        `)
        .order('created_at', { ascending: false })

      setSongs(songsData || [])
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGenres = async () => {
    try {
      const { data } = await supabase.from('genres').select('*').order('name')
      setGenres(data || [])
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const handleOpenModal = (song = null) => {
    if (song) {
      setEditingSong(song)
      const genreId = song.song_genres?.[0]?.genre_id || song.genres?.[0]?.id || ''
      setFormData({
        title: song.title,
        artist_name: song.artists?.name || '',
        album_name: song.albums?.title || '',
        audio_url: song.audio_url,
        cover_url: song.cover_url || '',
        duration: song.duration || '',
        genre_id: genreId,
        is_downloadable: song.is_downloadable,
        featured: song.featured
      })
    } else {
      setEditingSong(null)
      setFormData({
        title: '',
        artist_name: '',
        album_name: '',
        audio_url: '',
        cover_url: '',
        duration: '',
        genre_id: '',
        is_downloadable: true,
        featured: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSong(null)
    setError('')
  }

  const handleUploadAudio = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('music')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('music')
        .getPublicUrl(fileName)

      setFormData({ ...formData, audio_url: publicUrl })
    } catch (error) {
      setError('Failed to upload audio: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      // Generate filename from artist name and song title
      const artistSlug = formData.artist_name
        ? formData.artist_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'unknown'
      const titleSlug = formData.title
        ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'untitled'
      const fileName = `${artistSlug}-${titleSlug}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName)

      setFormData({ ...formData, cover_url: publicUrl })
    } catch (error) {
      setError('Failed to upload cover: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.artist_name || !formData.audio_url) {
      setError('Please fill in all required fields')
      return
    }

    try {
      // Find or create artist
      let artistId = null
      
      // Check if artist exists
      const { data: existingArtist, error: fetchArtistError } = await supabase
        .from('artists')
        .select('id')
        .eq('name', formData.artist_name)
        .maybeSingle()

      if (fetchArtistError && !fetchArtistError.message.includes('No rows')) {
        throw new Error('Error finding artist: ' + fetchArtistError.message)
      }

      if (existingArtist) {
        artistId = existingArtist.id
      } else {
        // Create new artist
        const { data: newArtist, error: artistError } = await supabase
          .from('artists')
          .insert([{ name: formData.artist_name }])
          .select('id')
          .single()
        
        if (artistError) {
          console.error('Artist creation error:', artistError)
          throw new Error('Failed to create artist: ' + artistError.message)
        }
        artistId = newArtist.id
      }

      // Find or create album (if album name provided)
      let albumId = null
      if (formData.album_name) {
        const { data: existingAlbum } = await supabase
          .from('albums')
          .select('id')
          .eq('title', formData.album_name)
          .eq('artist_id', artistId)
          .maybeSingle()

        if (existingAlbum) {
          albumId = existingAlbum.id
        } else {
          const { data: newAlbum, error: albumError } = await supabase
            .from('albums')
            .insert([{ title: formData.album_name, artist_id: artistId }])
            .select('id')
            .single()
          
          if (albumError) {
            console.error('Album creation error:', albumError)
            throw new Error('Failed to create album: ' + albumError.message)
          }
          albumId = newAlbum.id
        }
      }

      const songData = {
        title: formData.title,
        artist_id: artistId,
        album_id: albumId || null,
        audio_url: formData.audio_url,
        cover_url: formData.cover_url || null,
        duration: parseInt(formData.duration) || null,
        is_downloadable: formData.is_downloadable,
        featured: formData.featured
      }

      if (editingSong) {
        const { error } = await supabase.from('songs').update(songData).eq('id', editingSong.id)
        if (error) throw error
        
        // Update genre relationship
        if (formData.genre_id) {
          // Delete existing genre relationships
          await supabase.from('song_genres').delete().eq('song_id', editingSong.id)
          // Add new genre relationship
          await supabase.from('song_genres').insert([{ song_id: editingSong.id, genre_id: formData.genre_id }])
        }
      } else {
        const { data: inserted, error } = await supabase.from('songs').insert([songData]).select('id').single()
        if (error) throw error
        
        // Add genre relationship if selected
        if (formData.genre_id && inserted?.id) {
          await supabase.from('song_genres').insert([{ song_id: inserted.id, genre_id: formData.genre_id }])
        }
      }

      handleCloseModal()
      fetchSongs()
      toast.success(editingSong ? 'Song updated successfully!' : 'Song added successfully!')
    } catch (error) {
      console.error('Song save error:', error)
      const errorMsg = 'Failed to save song: ' + error.message
      toast.error(errorMsg)
      setError(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      const { error } = await supabase.from('songs').delete().eq('id', id)
      if (error) {
        console.error('Delete error:', error)
        throw error
      }
      fetchSongs()
      toast.success('Song deleted successfully!')
    } catch (error) {
      console.error('Failed to delete song:', error)
      toast.error('Failed to delete song: ' + error.message)
    }
  }

  const handleShare = async (song) => {
    // Use slug if available, otherwise use UUID
    const songIdentifier = song.slug || song.id
    const shareUrl = `${window.location.origin}/song/${songIdentifier}`
    const shareData = {
      title: song.title,
      text: `Check out "${song.title}" by ${song.artists?.name || 'Unknown Artist'} on DGT Sounds!`,
      url: shareUrl
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share error:', err)
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard!')
      } catch {
        toast.error('Failed to share')
      }
    }
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AdminLayout>
      <div className="songs-page">
        <div className="page-header">
          <h2>Songs</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Song
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading songs...</div>
        ) : (
          <div className="songs-table">
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Artist</th>
                  <th>Album</th>
                  <th>Duration</th>
                  <th>Plays</th>
                  <th>Downloads</th>
                  <th>Downloadable</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.length === 0 ? (
                  <tr>
                    <td colSpan={9}>No songs yet. Add your first song!</td>
                  </tr>
                ) : (
                  songs.map((song) => (
                    <tr key={song.id}>
                      <td>
                        <img 
                          src={song.cover_url || 'https://via.placeholder.com/50'} 
                          alt="" 
                          className="song-cover"
                        />
                      </td>
                      <td>
                        <div className="song-title">
                          {song.title}
                          {song.featured && <span className="featured-badge">Featured</span>}
                        </div>
                      </td>
                      <td>{song.artists?.name || 'Unknown'}</td>
                      <td>{song.albums?.title || '-'}</td>
                      <td>{formatDuration(song.duration)}</td>
                      <td>{song.play_count || 0}</td>
                      <td>{song.download_count || 0}</td>
                      <td>
                        {song.is_downloadable ? (
                          <Check size={18} className="text-green" />
                        ) : (
                          <X size={18} className="text-red" />
                        )}
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleShare(song)}
                            title="Share"
                          >
                            <Share2 size={18} />
                          </button>
                          <button
                            className="btn-icon"
                            onClick={() => handleOpenModal(song)}
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(song.id)}
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingSong ? 'Edit Song' : 'Add New Song'}</h3>
                <button className="btn-icon" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Song Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Artist Name *</label>
                    <input
                      type="text"
                      value={formData.artist_name}
                      onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                      required
                      placeholder="Enter artist name (will be created if new)"
                    />
                  </div>

                  <div className="form-group">
                    <label>Album Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.album_name}
                      onChange={(e) => setFormData({ ...formData, album_name: e.target.value })}
                      placeholder="Enter album name (will be created if new)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Genre</label>
                  <select
                    value={formData.genre_id}
                    onChange={(e) => setFormData({ ...formData, genre_id: e.target.value })}
                  >
                    <option value="">Select Genre (Optional)</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Audio File *</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleUploadAudio}
                      disabled={uploading}
                      id="audio-upload"
                    />
                    <label htmlFor="audio-upload" className="file-label">
                      <Upload size={20} />
                      {uploading ? 'Uploading...' : formData.audio_url ? 'Change Audio' : 'Upload Audio'}
                    </label>
                    {formData.audio_url && (
                      <span className="file-name">Audio uploaded ✓</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label>Cover Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadCover}
                      disabled={uploading}
                      id="cover-upload"
                    />
                    <label htmlFor="cover-upload" className="file-label">
                      <Upload size={20} />
                      {uploading ? 'Uploading...' : formData.cover_url ? 'Change Cover' : 'Upload Cover'}
                    </label>
                    {formData.cover_url && (
                      <img src={formData.cover_url} alt="Preview" className="cover-preview" />
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (seconds)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="180"
                    />
                  </div>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_downloadable}
                      onChange={(e) => setFormData({ ...formData, is_downloadable: e.target.checked })}
                    />
                    Allow Downloads
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    Featured Song
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingSong ? 'Update Song' : 'Add Song'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
