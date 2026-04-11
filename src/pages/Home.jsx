import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Ensure the path to your Footer file is correct

const homeStyles = `
  .home-container { 
    background: #0a0f0d; 
    color: #fff; 
    min-height: 100vh; 
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    flex-direction: column;
  }
  .hero { 
    padding: 10rem 2rem; 
    text-align: center; 
    background: radial-gradient(circle at center, #1a2a26 0%, #0a0f0d 100%); 
    flex: 1;
  }
  .hero h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); margin-bottom: 1.5rem; color: #f8fafc; }
  .hero span { color: #10b981; }
  .hero p { font-size: 1.2rem; color: #94a3b8; max-width: 600px; margin: 0 auto 2.5rem; }
  .cta-group { display: flex; gap: 1rem; justify-content: center; }
  .btn-primary { background: #10b981; color: #064e3b; padding: 1rem 2rem; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.3s; }
  .btn-secondary { border: 1px solid #10b981; color: #10b981; padding: 1rem 2rem; border-radius: 12px; font-weight: 700; text-decoration: none; }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2); }
`;

export default function Home() {
  return (
    <div className="home-container">
      <style>{homeStyles}</style>
      
      <section className="hero">
        <h1>Master Your Wealth, <span>Globally.</span></h1>
        <p>The only financial dashboard that speaks every currency and understands every market. Take control of your future today.</p>
        <div className="cta-group">
          <Link to="/signup" className="btn-primary">Start for Free</Link>
          <Link to="/about" className="btn-secondary">How it Works</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}