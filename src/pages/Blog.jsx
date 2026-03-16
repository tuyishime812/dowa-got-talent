import { Link } from 'react-router-dom'
import { FileText, Calendar, User } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CompanyPages.css'

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: 'The Rise of Amapiano: How a Genre Conquered the World',
      excerpt: 'Exploring the journey of Amapiano from township studios to global stages.',
      author: 'Music Team',
      date: 'March 1, 2026',
      image: 'https://via.placeholder.com/400x250/2d1f4e/ffffff?text=Amapiano'
    },
    {
      id: 2,
      title: '5 Emerging Artists to Watch in 2026',
      excerpt: 'Discover the next generation of music superstars.',
      author: 'Editorial',
      date: 'February 28, 2026',
      image: 'https://via.placeholder.com/400x250/4a3b6e/ffffff?text=Artists'
    },
    {
      id: 3,
      title: 'Behind the Scenes: How We Build Pamodzi',
      excerpt: 'A look into our technology stack and development process.',
      author: 'Tech Team',
      date: 'February 25, 2026',
      image: 'https://via.placeholder.com/400x250/2d1f4e/ffffff?text=Tech'
    }
  ]

  return (
    <div className="company-page">
      <Header />
      <main className="main-content no-player">
        <div className="company-hero">
          <div className="hero-content">
            <FileText size={48} color="#ff6b35" />
            <h1>Blog</h1>
            <p>Stories, news, and insights from the world of music.</p>
          </div>
        </div>

        <div className="blog-section">
          <div className="blog-grid">
            {posts.map((post) => (
              <article key={post.id} className="blog-card">
                <img src={post.image} alt={post.title} />
                <div className="blog-content">
                  <div className="blog-meta">
                    <User size={14} />
                    <span>{post.author}</span>
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to="/blog" className="read-more">Read More →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="newsletter-section">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest news, releases, and exclusive content delivered to your inbox.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
