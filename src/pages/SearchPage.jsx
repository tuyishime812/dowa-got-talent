import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useMusic } from '../context/MusicContext'
import { Search, Filter, Music, Disc, Mic2, X, SlidersHorizontal } from 'lucide-react'
import Header from '../components/Header'
import SongCard from '../components/SongCard'
import AlbumCard from '../components/AlbumCard'
import './SearchPage.css'

export default function SearchPage() {
  const { playSong } = useMusic()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  
  // Filters
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterType, setFilterType] = useState('all') // all, songs, albums, artists
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [sortBy, setSortBy] = useState('relevance') // relevance, popular, recent, alphabetical
  
  // Genres
  const [genres, setGenres] = useState([])

  useEffect(() => {
    fetchGenres()
  }, [])

  const fetchGenres = async () => {
    try {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name')
      
      if (!error && data) {
        setGenres(data)
      }
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  const performSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setHasSearched(true)
    
    try {
      let query = supabase
        .from('songs')
        .select(`
          *,
          artists (name),
          albums (title),
          song_genres (genre_id),
          genres (name)
        `)
      
      // Search filter
      query = query.or(`title.ilike.%${searchQuery}%,artists.name.ilike.%${searchQuery}%`)
      
      // Type filter
      if (filterType === 'songs') {
        query = query.not('id', 'is', null)
      }
      
      // Genre filter
      if (selectedGenre !== 'all') {
        query = query.eq('song_genres.genre_id', selectedGenre)
      }
      
      // Execute query
      const { data, error } = await query
      
      if (error) throw error
      
      // Process results
      let processed = data.map(song => ({
        ...song,
        artist: song.artists?.name || 'Unknown',
        album: song.albums?.title,
        genre: song.genres?.[0]?.name,
        type: 'song'
      }))
      
      // Search albums
      if (filterType === 'all' || filterType === 'albums') {
        const { data: albumsData } = await supabase
          .from('albums')
          .select(`
            *,
            artists (name)
          `)
          .or(`title.ilike.%${searchQuery}%,artists.name.ilike.%${searchQuery}%`)
        
        if (albumsData) {
          const albumResults = albumsData.map(album => ({
            ...album,
            artist: album.artists?.name,
            type: 'album'
          }))
          processed = [...processed, ...albumResults]
        }
      }
      
      // Search artists
      if (filterType === 'all' || filterType === 'artists') {
        const { data: artistsData } = await supabase
          .from('artists')
          .select('*')
          .ilike('name', `%${searchQuery}%`)
        
        if (artistsData) {
          const artistResults = artistsData.map(artist => ({
            ...artist,
            type: 'artist'
          }))
          processed = [...processed, ...artistResults]
        }
      }
      
      // Sort results
      processed = sortResults(processed)
      
      setResults(processed)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const sortResults = (results) => {
    const sorted = [...results]
    
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => (b.play_count || 0) - (a.play_count || 0))
        break
      case 'recent':
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'alphabetical':
        sorted.sort((a, b) => a.title?.localeCompare(b.title) || a.name?.localeCompare(b.name))
        break
      default:
        // Relevance - keep as is
        break
    }
    
    return sorted
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setFilterType('all')
    setSelectedGenre('all')
    setSortBy('relevance')
  }

  const handlePlay = (song) => {
    playSong({
      id: song.id,
      title: song.title,
      artist: song.artist,
      audio_url: song.audio_url || song.audioUrl,
      cover_url: song.cover_url || song.coverUrl,
      is_downloadable: song.is_downloadable
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filterType !== 'all') count++
    if (selectedGenre !== 'all') count++
    if (sortBy !== 'relevance') count++
    return count
  }

  return (
    <div className="search-page">
      <Header />
      
      <div className="search-hero">
        <div className="search-container">
          <div className="search-header">
            <Search size={48} className="search-icon" />
            <h1>Search Music</h1>
            <p>Find your favorite songs, albums, and artists</p>
          </div>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for songs, artists, albums..."
                className="search-input"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="clear-search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <button type="submit" className="btn-search" disabled={!searchQuery.trim()}>
              Search
            </button>
            
            <button
              type="button"
              className={`btn-filters ${filtersOpen ? 'active' : ''}`}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <SlidersHorizontal size={18} />
              Filters
              {getActiveFiltersCount() > 0 && (
                <span className="filter-badge">{getActiveFiltersCount()}</span>
              )}
            </button>
          </form>
          
          {/* Filters Panel */}
          {filtersOpen && (
            <div className="filters-panel">
              <div className="filter-header">
                <h3>
                  <Filter size={20} />
                  Filters
                </h3>
                <button onClick={clearFilters} className="btn-clear-filters">
                  Clear All
                </button>
              </div>
              
              <div className="filter-grid">
                <div className="filter-group">
                  <label>Type</label>
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="songs">Songs</option>
                    <option value="albums">Albums</option>
                    <option value="artists">Artists</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Genre</label>
                  <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="all">All Genres</option>
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="relevance">Relevance</option>
                    <option value="popular">Most Popular</option>
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="search-results-container">
        {loading && (
          <div className="loading-results">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        )}
        
        {!loading && hasSearched && results.length === 0 && (
          <div className="no-results">
            <Music size={64} className="no-results-icon" />
            <h2>No Results Found</h2>
            <p>Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-clear">
              Clear Filters
            </button>
          </div>
        )}
        
        {!loading && results.length > 0 && (
          <div className="results-content">
            <div className="results-header">
              <h2>
                {results.length} Result{results.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </h2>
            </div>
            
            <div className="results-grid">
              {results.map((item) => (
                item.type === 'song' ? (
                  <SongCard
                    key={item.id}
                    song={item}
                    onPlay={handlePlay}
                  />
                ) : item.type === 'album' ? (
                  <AlbumCard
                    key={item.id}
                    album={item}
                  />
                ) : (
                  <div key={item.id} className="artist-result">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/200x200/2d1f4e/ffffff?text=Artist'}
                      alt={item.name}
                      className="artist-image"
                    />
                    <h3>{item.name}</h3>
                    {item.bio && <p className="artist-bio">{item.bio.substring(0, 100)}...</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
        
        {!hasSearched && (
          <div className="search-suggestions">
            <h3>Popular Searches</h3>
            <div className="suggestion-tags">
              <button onClick={() => { setSearchQuery('Afrobeats'); performSearch() }}>Afrobeats</button>
              <button onClick={() => { setSearchQuery('Amapiano'); performSearch() }}>Amapiano</button>
              <button onClick={() => { setSearchQuery('Hip Hop'); performSearch() }}>Hip Hop</button>
              <button onClick={() => { setSearchQuery('R&B'); performSearch() }}>R&B</button>
              <button onClick={() => { setSearchQuery('Gospel'); performSearch() }}>Gospel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
