import { MusicProvider } from '../context/MusicContext'
import MusicPlayer from './MusicPlayer'

export default function Layout({ children }) {
  return (
    <MusicProvider>
      <div className="app-layout">
        <main className="main-content">{children}</main>
        <MusicPlayer />
      </div>
    </MusicProvider>
  )
}
