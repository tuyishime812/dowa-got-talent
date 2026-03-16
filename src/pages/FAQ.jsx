import { Link } from 'react-router-dom'
import { HelpCircle, MessageCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './ResourcePages.css'

export default function FAQ() {
  const faqs = [
    {
      category: 'General',
      questions: [
        { q: 'What is Pamodzi?', a: 'Pamodzi is a premier music streaming platform, featuring exclusive tracks, albums, and content from artists across the continent.' },
        { q: 'Is Pamodzi free to use?', a: 'Yes! You can create a free account and stream music. Some features like downloads may require purchase.' },
        { q: 'Which countries can use Pamodzi?', a: 'Pamodzi is available worldwide, with a focus on quality content and artists.' }
      ]
    },
    {
      category: 'Music & Downloads',
      questions: [
        { q: 'Can I download music for offline listening?', a: 'Yes, downloadable tracks have a download button. Some tracks may require purchase.' },
        { q: 'What audio quality do you offer?', a: 'We stream at up to 320kbps MP3 quality. Some tracks are available in FLAC for premium quality.' },
        { q: 'How do I add songs to my playlist?', a: 'Click the heart icon on any song to add it to your favorites.' }
      ]
    },
    {
      category: 'For Artists',
      questions: [
        { q: 'How can I upload my music?', a: 'Sign up for a creator account at /creator-studio and follow the upload process.' },
        { q: 'How do I get verified?', a: 'Verified artists have a blue checkmark. Contact our team after uploading your music for verification.' },
        { q: 'How do artists get paid?', a: 'Artists earn from streams, downloads, and direct fan support. Payments are processed monthly.' }
      ]
    },
    {
      category: 'Account & Support',
      questions: [
        { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page and follow the instructions.' },
        { q: 'Can I change my email address?', a: 'Yes, go to your account settings and update your email address.' },
        { q: 'How do I contact support?', a: 'Email us at support@pamodzi.com or use the contact form on our contact page.' }
      ]
    }
  ]

  return (
    <div className="resource-page">
      <Header />
      <main className="main-content no-player">
        <div className="resource-hero">
          <div className="hero-content">
            <HelpCircle size={48} color="#ff6b35" />
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about Pamodzi.</p>
          </div>
        </div>

        <div className="faq-container">
          {faqs.map((section, index) => (
            <div key={index} className="faq-section">
              <h2>{section.category}</h2>
              <div className="faq-list">
                {section.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="faq-item">
                    <h3>{faq.q}</h3>
                    <p>{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="contact-support">
          <MessageCircle size={48} color="#ff6b35" />
          <h2>Still Have Questions?</h2>
          <p>Our support team is here to help.</p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Contact Support
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
