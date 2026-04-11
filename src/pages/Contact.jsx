import React, { useState } from 'react';
import Footer from '../components/Footer';

const styleTag = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');

  .contact-page * { box-sizing: border-box; margin: 0; padding: 0; }

  .contact-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f1b2d 0%, #1a2e4a 50%, #0d2137 100%);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
  }

  .contact-hero {
    text-align: center;
    padding: 5rem 2rem 2rem;
  }

  .contact-hero .badge {
    display: inline-block;
    background: rgba(251, 191, 36, 0.15);
    border: 1px solid rgba(251, 191, 36, 0.4);
    color: #fbbf24;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 0.4rem 1.2rem;
    border-radius: 999px;
    margin-bottom: 1.5rem;
  }

  .contact-hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    color: #f1f5f9;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .contact-hero h1 span {
    color: #fbbf24;
  }

  .contact-hero p {
    color: #94a3b8;
    font-size: 1.05rem;
    max-width: 480px;
    margin: 0 auto;
    line-height: 1.8;
  }

  .contact-body {
    display: flex;
    gap: 2.5rem;
    max-width: 1000px;
    margin: 3rem auto 5rem;
    padding: 0 2rem;
    width: 100%;
    flex-wrap: wrap;
  }

  .contact-info {
    flex: 1;
    min-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .info-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 1.4rem 1.6rem;
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    transition: background 0.2s;
  }

  .info-card:hover {
    background: rgba(251, 191, 36, 0.06);
    border-color: rgba(251, 191, 36, 0.2);
  }

  .info-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .info-card h4 {
    color: #f1f5f9;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .info-card p {
    color: #64748b;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .contact-form-wrap {
    flex: 1.4;
    min-width: 300px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2.5rem;
    backdrop-filter: blur(12px);
  }

  .form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.2rem;
    flex: 1;
    min-width: 140px;
  }

  .form-group label {
    color: #94a3b8;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    color: #f1f5f9;
    font-size: 0.95rem;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    width: 100%;
  }

  .form-group input::placeholder,
  .form-group textarea::placeholder {
    color: #475569;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #fbbf24;
    background: rgba(251, 191, 36, 0.05);
  }

  .form-group select option {
    background: #1a2e4a;
    color: #f1f5f9;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #0f1b2d;
    font-weight: 700;
    font-size: 1rem;
    font-family: 'DM Sans', sans-serif;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    letter-spacing: 0.5px;
    margin-top: 0.5rem;
    transition: opacity 0.2s, transform 0.1s;
  }

  .submit-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .submit-btn:active { transform: translateY(0); }

  .success-box {
    text-align: center;
    padding: 3rem 2rem;
  }

  .success-box .check {
    font-size: 3.5rem;
    margin-bottom: 1rem;
  }

  .success-box h2 {
    font-family: 'Playfair Display', serif;
    color: #f1f5f9;
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }

  .success-box p {
    color: #64748b;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  @media (max-width: 640px) {
    .contact-body { flex-direction: column; }
    .form-row { flex-direction: column; }
  }
`;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <style>{styleTag}</style>
      <div className="contact-page">
        <div style={{ flex: 1 }}>
          <div className="contact-hero">
            <div className="badge">✦ Get In Touch</div>
            <h1>Let's Start a <span>Conversation</span></h1>
            <p>Have a question, feedback, or partnership idea? We'd love to hear from you — every message matters to us.</p>
          </div>

          <div className="contact-body">
            {/* Info Cards */}
            <div className="contact-info">
              {[
                { icon: '📬', title: 'Email Me', desc: 'support@monexia.com\nI reply within 24 hours' },
                { icon: '📍', title: 'Located In', desc: 'Turkana West County, Kenya\nServing users across the globe' },
                { icon: '⏰', title: 'Working Hours', desc: 'Mon – Fri: 8am – 6pm EAT\nWeekends: Limited support' },
                { icon: '💬', title: 'Live Chat', desc: 'Available inside the app\nfor Pro & Business users' },
              ].map(({ icon, title, desc }) => (
                <div className="info-card" key={title}>
                  <div className="info-icon">{icon}</div>
                  <div>
                    <h4>{title}</h4>
                    <p style={{ whiteSpace: 'pre-line' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="contact-form-wrap">
              {sent ? (
                <div className="success-box">
                  <div className="check">✅</div>
                  <h2>Message Received!</h2>
                  <p>Thank you for reaching out. Our team will get back to you within 24 hours. In the meantime, feel free to explore Monexia.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Your Name</label>
                      <input placeholder="John Doe" required onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" placeholder="you@example.com" required onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <select onChange={e => setForm({ ...form, subject: e.target.value })}>
                      <option value="">Select a topic...</option>
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Billing & Payments</option>
                      <option>Partnership</option>
                      <option>Feedback</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Message</label>
                    <textarea
                      placeholder="Tell me what's on your mind — I'm all ears 👂"
                      rows={5}
                      style={{ resize: 'vertical' }}
                      required
                      onChange={e => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="submit-btn">🚀 Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}