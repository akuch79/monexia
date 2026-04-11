import React from 'react';
import Footer from '../components/Footer';

const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .about-page * { box-sizing: border-box; margin: 0; padding: 0; }

  .about-page {
    min-height: 100vh;
    /* Rich, dark emerald to deep slate gradient */
    background: radial-gradient(circle at top left, #064e3b 0%, #020617 40%, #000000 100%);
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  .about-hero {
    text-align: center;
    padding: 8rem 2rem 4rem;
    max-width: 900px;
    margin: 0 auto;
    position: relative;
  }

  /* Decorative glow behind hero */
  .about-hero::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    background: #10b981;
    filter: blur(120px);
    opacity: 0.15;
    z-index: 0;
  }

  .about-hero .badge {
    position: relative;
    z-index: 1;
    display: inline-block;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #34d399;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0.5rem 1.5rem;
    border-radius: 100px;
    margin-bottom: 2rem;
  }

  .about-hero h1 {
    position: relative;
    z-index: 1;
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.8rem, 8vw, 5rem);
    color: #ffffff;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    font-weight: 900;
  }

  .about-hero h1 span { 
    background: linear-gradient(90deg, #34d399, #d1fae5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .about-hero p {
    color: #94a3b8;
    font-size: 1.25rem;
    line-height: 1.8;
    max-width: 700px;
    margin: 0 auto;
  }

  .about-stats {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    padding: 2rem;
    margin-bottom: 4rem;
  }

  .stat-pill {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 24px;
    padding: 1.5rem 2.5rem;
    text-align: center;
    min-width: 160px;
  }

  .stat-pill strong {
    color: #ffffff;
    font-size: 2rem;
    font-weight: 700;
    display: block;
    margin-bottom: 0.2rem;
  }

  .stat-pill span {
    color: #10b981;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .section-title {
    text-align: center;
    font-family: 'Playfair Display', serif;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #fff;
  }

  .about-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    padding: 0 2rem 6rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .about-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 32px;
    padding: 3rem 2rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
  }

  .about-card:hover {
    transform: translateY(-10px);
    background: rgba(16, 185, 129, 0.05);
    border-color: rgba(16, 185, 129, 0.3);
  }

  .about-card .card-icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    display: inline-block;
    filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
  }

  .about-card h3 {
    color: #ffffff;
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .about-card p {
    color: #94a3b8;
    font-size: 1rem;
    line-height: 1.7;
  }

  .about-mission {
    max-width: 900px;
    margin: 0 auto 8rem;
    padding: 4rem 3rem;
    text-align: center;
    background: linear-gradient(145deg, rgba(16, 185, 129, 0.1), rgba(2, 6, 23, 0.1));
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 40px;
    position: relative;
  }

  .about-mission h2 {
    font-family: 'Playfair Display', serif;
    color: #ffffff;
    font-size: 2.8rem;
    margin-bottom: 1.5rem;
  }

  .cta-section {
    text-align: center;
    padding: 6rem 2rem;
    background: rgba(255, 255, 255, 0.02);
    margin-top: auto;
  }

  .cta-btn {
    display: inline-block;
    background: #10b981;
    color: #000;
    padding: 1rem 2.5rem;
    border-radius: 100px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.3s;
    margin-top: 2rem;
  }

  .cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
  }

  @media (max-width: 768px) {
    .about-hero { padding-top: 5rem; }
    .about-mission { margin: 0 1.5rem 6rem; padding: 2rem; }
    .stat-pill { width: 100%; }
  }
`;

export default function About() {
  return (
    <>
      <style>{styleTag}</style>
      <div className="about-page">
        <div style={{ flex: 1 }}>
          
          <section className="about-hero">
            <div className="badge">✦ The Monexia Standard</div>
            <h1>Empowering Your <span>Global Wealth</span></h1>
            <p>
              Money speaks many languages, but financial freedom is universal. 
              We've built the bridge between where you are and where you want to be.
            </p>
          </section>

          <div className="about-stats">
            {[
              ['50K+', 'Users'],
              ['30+', 'Nations'],
              ['$0', 'Hidden Fees'],
              ['24/7', 'Assistance'],
            ].map(([val, label]) => (
              <div className="stat-pill" key={label}>
                <strong>{val}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <h2 className="section-title">Why Monexia?</h2>
          <div className="about-cards">
            {[
              ['💎', 'Absolute Clarity', 'Detailed breakdowns of your spending. We don’t just show you numbers; we show you your future habits.'],
              ['🌎', 'Borderless Core', 'Seamlessly switch between currencies with real-time mid-market exchange rates. Local feel, global reach.'],
              ['🛡️', 'Privacy First', 'Your data belongs to you. We use AES-256 encryption to ensure your financial life stays your business.'],
              ['⚡', 'Hyper-Fast', 'Cloud-native architecture ensures your dashboard loads instantly, whether you\'re in Lagos or London.'],
              ['🌱', 'Wealth Building', 'Set goals, create budgets, and watch your net worth grow with automated insights and suggestions.'],
              ['🤝', 'Human Support', 'Real people, real help. Our support team consists of financial experts ready to assist you any time.'],
            ].map(([icon, title, desc]) => (
              <div className="about-card" key={title}>
                <span className="card-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          <div className="about-mission">
            <h2>My Purpose</h2>
            <p style={{ fontSize: '1.15rem', color: '#cbd5e1' }}>
              I believe financial literacy is the ultimate equalizer. Monexia wasn't just built to track money; 
              it was built to give people <strong>time</strong> and <strong>peace of mind</strong>.
              <br /><br />
              In a world where economy is global, your tools should be too. We are committed to radical transparency 
              and building a platform that puts the user—not the bank—at the center of the story.
            </p>
            <div style={{ marginTop: '2.5rem' }}>
                <em style={{ color: '#10b981', fontStyle: 'normal', fontWeight: 600, fontSize: '1.3rem' }}>
                  "Finance is personal. Your tools should be too."
                </em>
            </div>
          </div>

          <section className="cta-section">
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem' }}>Ready to take control?</h2>
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Join 50,000+ users managing their future with Monexia.</p>
            <a href="/signup" className="cta-btn">Get Started for Free</a>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}