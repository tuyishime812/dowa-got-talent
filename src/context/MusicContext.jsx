import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MusicContext = createContext({})

export function MusicProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [queueIndex, setQueueIndex] = useState(-1)
  const [likedSongs, setLikedSongs] = useState([])
  const [user, setUser] = useState(null)

  const fetchLikedSongs = async (userId) => {
    try {
      const { data } = await supabase
        .from('likes')
        .select('song_id')
        .eq('user_id', userId)

      setLikedSongs(data?.map(l => l.song_id) || [])
    } catch (error) {
      console.error('Error fetching liked songs:', error)
    }
  }

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) {
        fetchLikedSongs(user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user
        setUser(currentUser)
        if (currentUser) {
          fetchLikedSongs(currentUser.id)
        } else {
          setLikedSongs([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const playSong = (song, newQueue = null) => {
    if (newQueue) {
      setQueue(newQueue)
      const index = newQueue.findIndex(s => s.id === song.id)
      setQueueIndex(index)
    } else if (queue.length === 0) {
      setQueue([song])
      setQueueIndex(0)
    }
    
    setCurrentSong(song)
    setIsPlaying(true)
    
    // Track play
    trackPlay(song.id)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (queue.length === 0) return
    
    const nextIndex = queueIndex + 1
    if (nextIndex < queue.length) {
      setQueueIndex(nextIndex)
      setCurrentSong(queue[nextIndex])
      setIsPlaying(true)
      trackPlay(queue[nextIndex].id)
    }
  }

  const playPrevious = () => {
    if (queue.length === 0) return
    
    const prevIndex = queueIndex - 1
    if (prevIndex >= 0) {
      setQueueIndex(prevIndex)
      setCurrentSong(queue[prevIndex])
      setIsPlaying(true)
      trackPlay(queue[prevIndex].id)
    }
  }

  const addToQueue = (song) => {
    setQueue([...queue, song])
  }

  const clearQueue = () => {
    setQueue([])
    setQueueIndex(-1)
    setCurrentSong(null)
    setIsPlaying(false)
  }

  const trackPlay = async (songId) => {
    try {
      await supabase.from('song_plays').insert({
        song_id: songId,
        played_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error tracking play:', error)
    }
  }

  const toggleLike = async (songId) => {
    if (!user) {
      console.warn('User must be logged in to like songs')
      return
    }

    const isLiked = likedSongs.includes(songId)
    
    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songId)
        
        setLikedSongs(likedSongs.filter(id => id !== songId))
      } else {
        await supabase
          .from('likes')
          .insert({
            user_id: user.id,
            song_id: songId
          })
        
        setLikedSongs([...likedSongs, songId])
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const isLiked = (songId) => {
    return likedSongs.includes(songId)
  }

  const value = {
    currentSong,
    isPlaying,
    queue,
    queueIndex,
    likedSongs,
    playSong,
    togglePlayPause,
    playNext,
    playPrevious,
    addToQueue,
    clearQueue,
    toggleLike,
    isLiked,
    user
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}
