import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react'
import './Albums.css'

export default function AdminAlbums() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAlbum, setEditingAlbum] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    artist_name: '',
    cover_url: '',
    release_date: '',
    description: '',
    featured: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchAlbums()
  }, [])

  const fetchAlbums = async () => {
    try {
      const { data, error } = await supabase
        .from('albums')
        .select('*, artists(name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setAlbums(data || [])
    } catch (error) {
      console.error('Error fetching albums:', error)
      toast.error('Failed to load albums')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (album = null) => {
    if (album) {
      setEditingAlbum(album)
      setFormData({
        title: album.title,
        artist_name: album.artists?.name || '',
        cover_url: album.cover_url || '',
        release_date: album.release_date || '',
        description: album.description || '',
        featured: album.featured
      })
    } else {
      setEditingAlbum(null)
      setFormData({
        title: '',
        artist_name: '',
        cover_url: '',
        release_date: '',
        description: '',
        featured: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAlbum(null)
    setError('')
  }

  const handleUploadCover = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validImageTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        throw new Error('Please upload a valid image file (JPG, PNG, GIF, WEBP).')
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit.')
      }

      const fileExt = file.name.split('.').pop()
      const artistSlug = formData.artist_name
        ? formData.artist_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'unknown'
      const titleSlug = formData.title
        ? formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'untitled'
      const fileName = `albums/${artistSlug}-${titleSlug}-${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('404')) {
          throw new Error('Storage bucket not found. Please contact administrator.')
        }
        throw uploadError
      }

      const { data: urlData } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName)

      const publicUrl = urlData?.publicUrl
      if (!publicUrl) {
        throw new Error('Failed to get public URL')
      }

      setFormData({ ...formData, cover_url: publicUrl })
      toast.success('Cover uploaded successfully!')
    } catch (error) {
      console.error('Cover upload error:', error)
      const errorMsg = error.message || 'Failed to upload cover'
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.artist_name) {
      setError('Please fill in required fields')
      return
    }

    try {
      // Find or create artist
      let artistId = null

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
        const { data: newArtist, error: artistError } = await supabase
          .from('artists')
          .insert([{ name: formData.artist_name }])
          .select('id')
          .single()

        if (artistError) throw artistError
        artistId = newArtist.id
      }

      const albumData = {
        title: formData.title,
        artist_id: artistId,
        cover_url: formData.cover_url || null,
        release_date: formData.release_date || null,
        description: formData.description || null,
        featured: formData.featured
      }

      let resultError
      if (editingAlbum) {
        const { error } = await supabase.from('albums').update(albumData).eq('id', editingAlbum.id)
        resultError = error
      } else {
        const { error } = await supabase.from('albums').insert([albumData])
        resultError = error
      }

      if (resultError) throw resultError

      handleCloseModal()
      fetchAlbums()
      toast.success(editingAlbum ? 'Album updated successfully!' : 'Album added successfully!')
    } catch (error) {
      console.error('Album save error:', error)
      const errorMsg = error.message || 'Failed to save album'
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this album?')) return

    try {
      const { error } = await supabase.from('albums').delete().eq('id', id)
      if (error) throw error
      fetchAlbums()
      toast.success('Album deleted successfully!')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete album: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="albums-page">
        <div className="page-header">
          <h2>Albums</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Album
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading albums...</div>
        ) : (
          <div className="albums-grid">
            {albums.length === 0 ? (
              <div className="no-items">No albums yet. Add your first album!</div>
            ) : (
              albums.map((album) => (
                <div key={album.id} className="album-card">
                  <div className="album-cover-wrapper">
                    <img
                      src={album.cover_url || 'https://via.placeholder.com/200'}
                      alt={album.title}
                      className="album-cover"
                    />
                    {album.featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <div className="album-info">
                    <h3>{album.title}</h3>
                    <p>{album.artists?.name || 'Unknown Artist'}</p>
                    <div className="album-meta">
                      <span>{album.track_count || 0} tracks</span>
                      {album.release_date && (
                        <span>{new Date(album.release_date).getFullYear()}</span>
                      )}
                    </div>
                    <div className="album-actions">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleOpenModal(album)}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(album.id)}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingAlbum ? 'Edit Album' : 'Add New Album'}</h3>
                <button className="btn-icon" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Album Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

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
                  <label>Release Date</label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Album description..."
                  />
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

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  Featured Album
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingAlbum ? 'Update Album' : 'Add Album'}
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
