import { Link } from 'react-router-dom'
import { Check, Star, Zap } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import './CompanyPages.css'

export default function Pricing() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Stream unlimited music',
        'Create playlists',
        'Basic audio quality',
        'Ad-supported'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      features: [
        'Ad-free listening',
        'High quality audio (320kbps)',
        'Offline downloads',
        'Unlimited skips',
        'Early access to new features'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Creator',
      price: '$19.99',
      period: 'per month',
      features: [
        'Everything in Premium',
        'Upload your music',
        'Analytics dashboard',
        'Monetization tools',
        'Priority support',
        'Verified badge'
      ],
      cta: 'Become a Creator',
      popular: false
    }
  ]

  return (
    <div className="company-page">
      <Header />
      <main className="main-content no-player">
        <div className="company-hero">
          <div className="hero-content">
            <Star size={48} color="#ff6b35" />
            <h1>Simple, Transparent Pricing</h1>
            <p>Choose the plan that's right for you.</p>
          </div>
        </div>

        <div className="pricing-section">
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <div key={index} className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <span className="popular-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <div className="price">
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                <ul className="features-list">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <Check size={18} color="#22c55e" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="faq-preview">
          <h2>Common Questions</h2>
          <div className="faq-grid">
            <div className="faq-box">
              <h3>Can I cancel anytime?</h3>
              <p>Yes, you can cancel your subscription at any time with no questions asked.</p>
            </div>
            <div className="faq-box">
              <h3>Is there a free trial?</h3>
              <p>Premium comes with a 14-day free trial. No credit card required to start.</p>
            </div>
            <div className="faq-box">
              <h3>What payment methods do you accept?</h3>
              <p>We accept credit cards, PayPal, and mobile money in select countries.</p>
            </div>
          </div>
        </div>

        <div className="enterprise-section">
          <Zap size={48} color="#ff6b35" />
          <h2>Enterprise Plans</h2>
          <p>Need a custom solution for your business or organization?</p>
          <Link to="/contact" className="btn btn-secondary btn-lg">
            Contact Sales
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
