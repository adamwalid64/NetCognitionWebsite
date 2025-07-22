import './App.css'
import { useState, useEffect } from 'react'
import anwarImage from './assets/anwar-walid-image.jpg'
import deepakImage from './assets/deepak.gif'
import showcaseBg from './assets/showcase_bg.png'
import logo from './assets/logo.png'

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Animated counter effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target
          const finalValue = parseFloat(target.getAttribute('data-target'))
          animateCounter(target, finalValue)
          observer.unobserve(target)
        }
      })
    }, observerOptions)

    // Observe all stat numbers
    const statNumbers = document.querySelectorAll('.stat-number')
    statNumbers.forEach(stat => observer.observe(stat))

    return () => {
      statNumbers.forEach(stat => observer.unobserve(stat))
    }
  }, [])

  // Chart animation effect
  useEffect(() => {
    let chartElement = null
    let isChartDrawn = false

    const chartObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isChartDrawn) {
          isChartDrawn = true
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            drawGrowthChart()
          })
          chartObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.3 })

    chartElement = document.getElementById('growthChart')
    if (chartElement) {
      chartObserver.observe(chartElement)
    }

    return () => {
      if (chartElement) {
        chartObserver.unobserve(chartElement)
      }
    }
  }, [])

  // Counter animation function
  const animateCounter = (element, target) => {
    const duration = 2000
    const start = 0
    const increment = target / (duration / 16)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      
      const displayValue = target >= 10 ? current.toFixed(1) : current.toFixed(2)
      element.textContent = displayValue
    }, 16)

    // Cleanup function
    return () => clearInterval(timer)
  }

  // Chart drawing function
  const drawGrowthChart = () => {
    const canvas = document.getElementById('growthChart')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    
    // Limit device pixel ratio for better performance
    const pixelRatio = Math.min(window.devicePixelRatio, 2)
    canvas.width = rect.width * pixelRatio
    canvas.height = rect.height * pixelRatio
    ctx.scale(pixelRatio, pixelRatio)

    const width = rect.width
    const height = rect.height
    const padding = 40

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Data points for AI market growth (2023-2030)
    const data = [
      { year: 2023, value: 2.1 },
      { year: 2024, value: 3.2 },
      { year: 2025, value: 4.8 },
      { year: 2026, value: 7.1 },
      { year: 2027, value: 10.5 },
      { year: 2028, value: 15.2 },
      { year: 2029, value: 21.8 },
      { year: 2030, value: 31.5 }
    ]

    const xScale = (width - 2 * padding) / (data.length - 1)
    const yScale = (height - 2 * padding) / Math.max(...data.map(d => d.value))

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    // Vertical grid lines
    for (let i = 0; i < data.length; i++) {
      const x = padding + i * xScale
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Horizontal grid lines
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (height - 2 * padding) * (i / gridLines)
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Draw area chart
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)

    data.forEach((point, index) => {
      const x = padding + index * xScale
      const y = height - padding - (point.value * yScale)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.lineTo(width - padding, height - padding)
    ctx.closePath()

    // Create gradient for area
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(0, 168, 255, 0.3)')
    gradient.addColorStop(1, 'rgba(0, 168, 255, 0.05)')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.forEach((point, index) => {
      const x = padding + index * xScale
      const y = height - padding - (point.value * yScale)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.strokeStyle = '#00a8ff'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw data points
    data.forEach((point, index) => {
      const x = padding + index * xScale
      const y = height - padding - (point.value * yScale)
      
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00a8ff'
      ctx.fill()
      
      // Add glow effect
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 168, 255, 0.2)'
      ctx.fill()
    })

    // Draw labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '12px Inter, sans-serif'
    ctx.textAlign = 'center'

    data.forEach((point, index) => {
      const x = padding + index * xScale
      const y = height - padding + 20
      
      ctx.fillText(point.year.toString(), x, y)
    })
  }

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <img src={logo} alt="NetCognition Logo" className="navbar-logo-image" />
            <span className="navbar-logo-text">NetCognition</span>
          </div>
          <ul className="navbar-nav">
            <li><a href="#home">Home</a></li>
            <li><a href="#mission">About</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Showcase Section */}
      <section id="home" className="showcase">
        {/* Background Image */}
        <div 
          className="showcase-background"
          style={{
            backgroundImage: `url(${showcaseBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1
          }}
        />
        
        <div className="showcase-container">
          <h1 className="showcase-title">
            Agentic AI for Smarter Networks
          </h1>
          <p className="showcase-subtitle">
            Autonomous, goal-driven AI agents orchestrating smarter, faster, and greener cellular network performance, purpose-built for Open RAN environments.
          </p>
          <a href="#contact" className="cta-button">
            Get Started
          </a>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="mission">
        <div className="mission-container">
          <h2 className="mission-title">Our Mission</h2>
          <div className="mission-bubbles">
            <div className="mission-bubble">
              <div className="mission-bubble-icon">🖥️</div>
              <h3>
                Autonomous<br />
                Intelligence
              </h3>
              <p>
                We build AI agents that think, plan, and act — enabling self-optimizing networks that adapt in real time with minimal human input.
              </p>
            </div>
            <div className="mission-bubble">
              <div className="mission-bubble-icon">📡</div>
              <h3>Smarter Network Performance</h3>
              <p>
                By combining intelligent orchestration with rApps, we boost efficiency, reduce energy consumption, and improve quality of service across Open RAN environments.
              </p>
            </div>
            <div className="mission-bubble">
              <div className="mission-bubble-icon">🧑‍🤝‍🧑</div>
              <h3>Scalable, Standards-Based Impact</h3>
              <p>
                Our platform is cloud-portable and O-RAN compliant, designed to integrate with existing infrastructure and scale across industries like manufacturing, logistics, and healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="statistics">
        <div className="statistics-container">
          <h2 className="statistics-title">Market Impact</h2>
          <div className="statistics-cards">
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-number" data-target="3.98">0</div>
              <div className="stat-label">Billion USD</div>
              <div className="stat-description">Open RAN Market by 2030</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚀</div>
              <div className="stat-number" data-target="19.6">0</div>
              <div className="stat-label">Billion USD</div>
              <div className="stat-description">AI in Telecom Market</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-number" data-target="45.2">0</div>
              <div className="stat-label">% CAGR</div>
              <div className="stat-description">AI Market Growth Rate</div>
            </div>
          </div>
          
          {/* Chart Section */}
          <div className="chart-container">
            <h3 className="chart-title">Agentic AI Market Growth Trajectory</h3>
            <div className="chart-wrapper">
              <canvas id="growthChart" className="growth-chart"></canvas>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section id="team" className="team">
        <div className="team-container">
          <h2 className="team-title">Meet the Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="team-member-profile">
                <img 
                  src={anwarImage}
                  alt="Anwar Walid"
                  className="team-member-image"
                />
              </div>
              <h3 className="team-member-name">Anwar Walid</h3>
              <p className="team-member-role">Founder</p>
              <p className="team-member-bio">
              Anwar Walid is an IEEE Fellow and renowned networking expert, honored with the 2019 ACM SIGCOMM Networking Systems Award and the 2017 IEEE William R. Bennett Prize. He led the Mathematics of Systems Research Department at Nokia Bell Labs, serves as Adjunct Professor at Columbia University, and was Associate Editor for leading IEEE and ACM journals. He is also an elected member of Tau Beta Pi and IFIP Working Group 7.3.
              </p>
              <a 
                href="https://www.linkedin.com/in/anwar-walid-b0b72432/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="team-member-linkedin"
              >
                <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
            <div className="team-member">
              <div className="team-member-profile">
                <img 
                  src={deepakImage}
                  alt="Deepak Kataria"
                  className="team-member-image"
                />
              </div>
              <h3 className="team-member-name">Deepak Kataria</h3>
              <p className="team-member-role">Founder</p>
              <p className="team-member-bio">
              Deepak Kataria is a telecom and cloud veteran with 25+ years of experience across operators, OEMs, silicon vendors, and integrators. He holds 10 U.S. patents, co-founded IPJunction Inc., and is Principal Solution Consultant at Ericsson. He chairs the IEEE Princeton Central Jersey Section, co-chairs the IEEE FNI AI/ML group, and leads the IEEE Sarnoff Symposium. He studied at Rutgers and completed executive training at Harvard.
              </p>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="team-member-linkedin"
              >
                <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Connect on LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="contact-container">
          <h2 className="contact-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Ready to Transform Your Network?</h3>
              <p>
                Connect with our team to learn how our AI agents can optimize your Open RAN 
                infrastructure and drive smarter, more efficient network performance.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-text">
                    <h4>Email</h4>
                    <p>info@netcognition.ai</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">🌐</div>
                  <div className="contact-text">
                    <h4>Website</h4>
                    <p>www.netcognition.ai</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <h4>Location</h4>
                    <p>Princeton, NJ</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form className="contact-form-fields">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" className="form-input" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Company" className="form-input" />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" className="form-textarea" rows="5"></textarea>
                </div>
                <button type="submit" className="contact-submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
