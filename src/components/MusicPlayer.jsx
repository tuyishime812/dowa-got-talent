import { useState, useEffect, useRef, useCallback } from 'react'
import { useMusic } from '../context/MusicContext'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Heart, Share2, Download, Music2
} from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { downloadSongWithMetadata, simpleDownload } from '../lib/downloadUtils'
import './MusicPlayer.css'

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    toggleLike,
    isLiked
  } = useMusic()

  const toast = useToast()
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [showVisualizer, setShowVisualizer] = useState(false)

  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const visualizerRef = useRef(null)
  const animationRef = useRef(null)

  // Define functions before useEffects that use them
  const startVisualizer = useCallback(() => {
    if (!visualizerRef.current || !showVisualizer) return

    const canvas = visualizerRef.current
    const ctx = canvas.getContext('2d')
    const bars = 32

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#ff6b35')
      gradient.addColorStop(1, '#4a3b6e')
      ctx.fillStyle = gradient

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + 5
        const x = i * (canvas.width / bars)
        const y = canvas.height - height
        ctx.fillRect(x, y, canvas.width / bars - 2, height)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }, [showVisualizer])

  const stopVisualizer = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (visualizerRef.current) {
      const ctx = visualizerRef.current.getContext('2d')
      ctx.clearRect(0, 0, visualizerRef.current.width, visualizerRef.current.height)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  useEffect(() => {
    if (audioRef.current && currentSong) {
      // Set up audio element with mobile-friendly attributes
      audioRef.current.src = currentSong.audio_url || currentSong.audioUrl || ''
      audioRef.current.preload = 'metadata'
      audioRef.current.playsInline = true
      audioRef.current.setAttribute('playsinline', 'true')
      
      if (isPlaying) {
        // Mobile browsers require user interaction for autoplay
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              startVisualizer()
            })
            .catch((err) => {
              console.error('Playback error:', err)
              // Auto-play was prevented, show message to user
              if (err.name === 'NotAllowedError') {
                toast.info('Tap play button to start music')
              }
            })
        }
      }
    }
  }, [currentSong, isPlaying, startVisualizer, toast])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              startVisualizer()
            })
            .catch((err) => {
              console.error('Playback error:', err)
              if (err.name === 'NotAllowedError') {
                toast.info('Tap play button to start music')
              }
            })
        }
      } else {
        audioRef.current.pause()
        stopVisualizer()
      }
    }
  }, [isPlaying, startVisualizer, stopVisualizer, toast])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      setDuration(audio.duration || 0)
      setProgress((audio.currentTime / audio.duration) * 100 || 0)
    }

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        playNext()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [playNext, repeatMode])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch(e.code) {
        case 'Space':
          e.preventDefault()
          togglePlayPause()
          break
        case 'ArrowRight':
          if (audioRef.current) {
            audioRef.current.currentTime += 5
          }
          break
        case 'ArrowLeft':
          if (audioRef.current) {
            audioRef.current.currentTime -= 5
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(prev => Math.min(1, prev + 0.1))
          if (audioRef.current) audioRef.current.volume = Math.min(1, volume + 0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(prev => Math.max(0, prev - 0.1))
          if (audioRef.current) audioRef.current.volume = Math.max(0, volume - 0.1)
          break
        case 'KeyM':
          toggleMute()
          break
        case 'KeyN':
          playNext()
          break
        case 'KeyP':
          playPrevious()
          break
        case 'KeyL':
          if (currentSong) toggleLike(currentSong.id)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSong, togglePlayPause, playNext, playPrevious, toggleLike, volume, toggleMute])

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle)
    toast.info(isShuffle ? 'Shuffle off' : 'Shuffle on')
  }

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one']
    const currentIndex = modes.indexOf(repeatMode)
    const newMode = modes[(currentIndex + 1) % modes.length]
    setRepeatMode(newMode)
    toast.info(`Repeat: ${newMode === 'off' ? 'Off' : newMode === 'all' ? 'All' : 'One'}`)
  }

  const handleLike = () => {
    if (currentSong) {
      toggleLike(currentSong.id)
      toast.success(isLiked(currentSong.id) ? 'Removed from favorites' : 'Added to favorites! ❤️')
    }
  }

  const handleShare = async () => {
    if (!currentSong) return

    const shareData = {
      title: currentSong.title,
      text: `Check out "${currentSong.title}" by ${currentSong.artist} on Pamodzi!`,
      url: window.location.href
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
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        toast.success('Link copied to clipboard!')
      } catch {
        toast.error('Failed to share')
      }
    }
  }

  const handleDownload = async () => {
    if (!currentSong) return
    const audioUrl = currentSong.audio_url || currentSong.audioUrl
    if (!audioUrl || !currentSong.is_downloadable) {
      toast.error('Download not available for this song')
      return
    }

    try {
      toast.info(`⏳ Preparing download: ${currentSong.artist} - ${currentSong.title}...`)

      // Try to download with metadata first
      await downloadSongWithMetadata(currentSong)

      toast.success(`✅ Download started: ${currentSong.artist} - ${currentSong.title}`)

      // Track download
      try {
        const { supabase } = await import('../lib/supabase')
        await supabase.from('downloads').insert({ song_id: currentSong.id })
      } catch (e) {
        console.warn('Failed to track download:', e)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed. Trying alternative method...')

      // Fallback: simple download
      try {
        const filename = `${currentSong.artist} - ${currentSong.title}.mp3`
        await simpleDownload(audioUrl, filename)
        toast.success('Download started (without metadata)')
      } catch (e) {
        toast.error('Download failed. Opening in new tab...')
        window.open(audioUrl, '_blank')
      }
    }
  }

  // Handle touch events for better mobile support
  const handleTouchStart = useCallback((e) => {
    // Prevent default to avoid double-tap zoom issues
    if (e.target.tagName !== 'A') {
      e.preventDefault()
    }
  }, [])

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentSong) {
    return (
      <div className="music-player empty">
        <div className="player-container">
          <Music2 size={48} className="music-icon" />
          <p className="no-song-text">Select a song to play</p>
          <p className="keyboard-hint">
            <kbd>Space</kbd> Play/Pause &nbsp;
            <kbd>←</kbd><kbd>→</kbd> Seek &nbsp;
            <kbd>↑</kbd><kbd>↓</kbd> Volume
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} />

      <div className="player-container">
        {/* Song Info */}
        <div className="player-song-info">
          <img
            src={currentSong.cover_url || currentSong.coverUrl || 'https://via.placeholder.com/60x60/2d1f4e/ffffff?text=Music'}
            alt={currentSong.title}
            className="player-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/60x60/2d1f4e/ffffff?text=Music'
            }}
          />
          <div className="player-song-details">
            <span className="player-song-title">{currentSong.title}</span>
            <span className="player-song-artist">{currentSong.artist}</span>
          </div>
          <button 
            className={`control-btn like-btn ${isLiked(currentSong.id) ? 'liked' : ''}`}
            onClick={handleLike}
            title="Like/Favorite"
          >
            <Heart size={20} fill={isLiked(currentSong.id) ? '#ff6b35' : 'none'} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <div className="control-buttons">
            <button
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Shuffle (Toggle)"
            >
              <Shuffle size={18} />
            </button>
            <button className="control-btn" onClick={playPrevious} title="Previous (P)">
              <SkipBack size={20} />
            </button>
            <button className="control-btn play-btn" onClick={togglePlayPause} title="Play/Pause (Space)">
              {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
            </button>
            <button className="control-btn" onClick={playNext} title="Next (N)">
              <SkipForward size={20} />
            </button>
            <button
              className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={toggleRepeat}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={18} />
            </button>
          </div>

          <div className="progress-container" ref={progressRef} onClick={handleProgressClick}>
            <span className="time-current">{formatTime(currentTime)}</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              <div className="progress-thumb" style={{ left: `${progress}%` }}></div>
            </div>
            <span className="time-total">{formatTime(duration)}</span>
          </div>

          <div className="player-actions">
            <button className="control-btn action-btn" onClick={handleShare} title="Share">
              <Share2 size={18} />
            </button>
            {currentSong.is_downloadable && (
              <button
                className="control-btn action-btn"
                onClick={handleDownload}
                title="Download"
              >
                <Download size={18} />
              </button>
            )}
            <button
              className={`control-btn action-btn ${showVisualizer ? 'active' : ''}`}
              onClick={() => setShowVisualizer(!showVisualizer)}
              title="Toggle Visualizer"
            >
              <Music2 size={18} />
            </button>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="player-volume">
          <button className="control-btn volume-btn" onClick={toggleMute} title="Mute (M)">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            title="Volume (↑/↓)"
          />
        </div>
      </div>

      {/* Audio Visualizer */}
      {showVisualizer && (
        <div className="visualizer-container">
          <canvas 
            ref={visualizerRef} 
            width={200} 
            height={60}
            className="audio-visualizer"
          />
        </div>
      )}
    </div>
  )
}
