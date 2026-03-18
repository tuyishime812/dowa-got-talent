import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Play, Download, Heart, Share2, ArrowLeft, Clock, TrendingUp, Facebook, Twitter, MessageCircle, Link as LinkIcon } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useToast } from '../context/ToastContext'
import { downloadSongWithMetadata, simpleDownload, mobileDownload } from '../lib/downloadUtils'
import './SongDetail.css'

export default function SongDetail() {
  const { id } = useParams()
  const [song, setSong] = useState(null)
  const [loading, setLoading] = useState(true)
  const { playSong, toggleLike, isLiked } = useMusic()
  const toast = useToast()

  useEffect(() => {
    fetchSong()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchSong = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select(`
          *,
          artists (name),
          albums (title),
          genres (name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setSong(data)
    } catch (err) {
      console.error('Error fetching song:', err)
      toast.error('Song not found')
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = () => {
    if (!song) return
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artists?.name || 'Unknown',
      audio_url: song.audio_url,
      cover_url: song.cover_url,
      is_downloadable: song.is_downloadable
    })
    toast.success(`Playing: ${song.title}`)
  }

  const handleDownload = async () => {
    if (!song || !song.is_downloadable) {
      toast.error('Download not available')
      return
    }

    // Check if mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Use mobile-friendly download
      toast.info(`⏳ Opening: ${song.artists?.name} - ${song.title}...`)
      mobileDownload(song.audio_url, `${song.artists?.name} - ${song.title}.mp3`)
      toast.success(`✅ Download opened in new tab!`)
      
      // Track download
      try {
        await supabase.from('downloads').insert({ song_id: song.id })
      } catch (e) {
        console.warn('Failed to track download:', e)
      }
      return
    }

    // Show confirmation toast
    toast.info(`⏳ Preparing download: ${song.artists?.name} - ${song.title}...`)

    try {
      // Download with metadata
      await downloadSongWithMetadata({
        title: song.title,
        artist: song.artists?.name || 'Unknown',
        audio_url: song.audio_url,
        cover_url: song.cover_url,
        album: song.albums?.title,
        year: song.created_at ? new Date(song.created_at).getFullYear() : null
      })

      // Track download
      await supabase.from('downloads').insert({
        song_id: song.id
      })

      toast.success(`✅ Download started!`)
    } catch {
      // Fallback: simple download
      try {
        const filename = `${song.artists?.name} - ${song.title}.mp3`
        await simpleDownload(song.audio_url, filename)
        toast.success('Download started (without metadata)')
      } catch (e) {
        toast.error('Download failed')
      }
    }
  }

  const handleLike = () => {
    if (song) {
      toggleLike(song.id)
      toast.success(isLiked(song.id) ? 'Removed from favorites' : 'Added to favorites! ❤️')
    }
  }

  const shareUrl = `${window.location.origin}/song/${id}`
  const shareText = `Check out "${song?.title}" by ${song?.artists?.name || 'Unknown Artist'} on DGT Sounds!`

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'width=600,height=400')
  }

  const shareToWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  if (loading) {
    return (
      <div className="song-detail-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading song...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!song) {
    return (
      <div className="song-detail-page">
        <Header />
        <div className="not-found">
          <h2>Song Not Found</h2>
          <Link to="/music" className="btn btn-primary">
            <ArrowLeft size={20} />
            Back to Music
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="song-detail-page">
      <Header />

      <div className="song-detail-container">
        <Link to="/music" className="back-link">
          <ArrowLeft size={20} />
          Back to Music
        </Link>

        <div className="song-detail-content">
          <div className="song-cover-large">
            <img
              src={song.cover_url || 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'}
              alt={song.title}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400/2d1f4e/ffffff?text=Music'
              }}
            />
          </div>

          <div className="song-info-large">
            <h1 className="song-title-large">{song.title}</h1>
            <p className="artist-name">{song.artists?.name || 'Unknown Artist'}</p>
            
            {song.albums && (
              <p className="album-name">Album: {song.albums.title}</p>
            )}

            {song.genres && song.genres.length > 0 && (
              <div className="genre-tags">
                {song.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>
            )}

            <div className="song-stats">
              <div className="stat">
                <Play size={18} />
                <span>{song.play_count || 0} plays</span>
              </div>
              <div className="stat">
                <Download size={18} />
                <span>{song.download_count || 0} downloads</span>
              </div>
              {song.duration && (
                <div className="stat">
                  <Clock size={18} />
                  <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </div>

            <div className="song-actions-large">
              <button className="btn-play-large" onClick={handlePlay}>
                <Play size={24} fill="white" />
                Play Now
              </button>

              {song.is_downloadable && (
                <button className="btn-download-large" onClick={handleDownload}>
                  <Download size={24} />
                  Download
                </button>
              )}

              <button className="btn-like-large" onClick={handleLike}>
                <Heart size={24} fill={isLiked(song.id) ? '#ff6b35' : 'none'} />
              </button>
            </div>

            {/* Social Share Icons */}
            <div className="social-share-section">
              <h3 className="share-title">Share this song</h3>
              <div className="social-share-icons">
                <button className="share-icon-btn facebook" onClick={shareToFacebook} title="Share on Facebook">
                  <Facebook size={24} />
                </button>
                <button className="share-icon-btn twitter" onClick={shareToTwitter} title="Share on Twitter/X">
                  <Twitter size={24} />
                </button>
                <button className="share-icon-btn whatsapp" onClick={shareToWhatsapp} title="Share on WhatsApp">
                  <MessageCircle size={24} />
                </button>
                <button className="share-icon-btn copy" onClick={copyLink} title="Copy Link">
                  <LinkIcon size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
