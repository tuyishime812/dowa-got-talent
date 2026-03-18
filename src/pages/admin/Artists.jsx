import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import { Plus, Edit, Trash2, Upload, X, Check } from 'lucide-react'
import './Artists.css'

export default function AdminArtists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingArtist, setEditingArtist] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    image_url: '',
    verified: false
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const { data: artistsData } = await supabase.from('artists').select('*').order('name')
      setArtists(artistsData || [])
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (artist = null) => {
    if (artist) {
      setEditingArtist(artist)
      setFormData({
        name: artist.name,
        bio: artist.bio || '',
        image_url: artist.image_url || '',
        verified: artist.verified
      })
    } else {
      setEditingArtist(null)
      setFormData({
        name: '',
        bio: '',
        image_url: '',
        verified: false
      })
    }
    setError('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingArtist(null)
    setError('')
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      // Generate filename from artist name
      const artistSlug = formData.name
        ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : 'unknown'
      const fileName = `${artistSlug}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName)

      setFormData({ ...formData, image_url: publicUrl })
    } catch (error) {
      setError('Failed to upload image: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name) {
      setError('Please enter artist name')
      return
    }

    try {
      const artistData = {
        name: formData.name,
        bio: formData.bio || null,
        image_url: formData.image_url || null,
        verified: formData.verified
      }

      if (editingArtist) {
        const { error } = await supabase.from('artists').update(artistData).eq('id', editingArtist.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('artists').insert([artistData])
        if (error) throw error
      }

      handleCloseModal()
      fetchArtists()
      toast.success(editingArtist ? 'Artist updated successfully!' : 'Artist added successfully!')
    } catch (error) {
      setError('Failed to save artist: ' + error.message)
      toast.error('Failed to save artist: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this artist? This will also delete their songs and albums.')) return

    try {
      const { error } = await supabase.from('artists').delete().eq('id', id)
      if (error) {
        console.error('Delete error:', error)
        throw error
      }
      fetchArtists()
      toast.success('Artist deleted successfully!')
    } catch (error) {
      console.error('Failed to delete artist:', error)
      toast.error('Failed to delete artist: ' + error.message)
    }
  }

  return (
    <AdminLayout>
      <div className="artists-page">
        <div className="page-header">
          <h2>Artists</h2>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Add Artist
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading artists...</div>
        ) : (
          <div className="artists-grid">
            {artists.length === 0 ? (
              <div className="no-items">No artists yet. Add your first artist!</div>
            ) : (
              artists.map((artist) => (
                <div key={artist.id} className="artist-card">
                  <div className="artist-image-wrapper">
                    <img 
                      src={artist.image_url || 'https://via.placeholder.com/200?text=Artist'} 
                      alt={artist.name}
                      className="artist-image"
                    />
                    {artist.verified && (
                      <span className="verified-badge">
                        <Check size={14} />
                      </span>
                    )}
                  </div>
                  <div className="artist-info">
                    <h3>{artist.name}</h3>
                    {artist.bio && (
                      <p className="artist-bio">{artist.bio.substring(0, 80)}...</p>
                    )}
                    <div className="artist-actions">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleOpenModal(artist)}
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(artist.id)}
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
                <h3>{editingArtist ? 'Edit Artist' : 'Add New Artist'}</h3>
                <button className="btn-icon" onClick={handleCloseModal}>
                  <X size={20} />
                </button>
              </div>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Artist Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about the artist..."
                  />
                </div>

                <div className="form-group">
                  <label>Artist Image</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadImage}
                      disabled={uploading}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="file-label">
                      <Upload size={20} />
                      {uploading ? 'Uploading...' : formData.image_url ? 'Change Image' : 'Upload Image'}
                    </label>
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="cover-preview" />
                    )}
                  </div>
                </div>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.verified}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  />
                  Verified Artist
                </label>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {editingArtist ? 'Update Artist' : 'Add Artist'}
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
