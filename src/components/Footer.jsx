import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      {/* Top glow bar */}
      <div style={styles.glowBar} />

      <div style={styles.inner}>
        {/* Brand Column */}
        <div style={styles.brandCol}>
          <span style={styles.logo}>💳 Monexia</span>
          <p style={styles.tagline}>
            Your global finance companion.<br />
            From Turkana to Tokyo — we've got you.
          </p>
          <div style={styles.locationBadge}>
            <span>📍</span>
            <span>Turkana West County, Kenya</span>
          </div>
          <div style={styles.socials}>
            {[
              { href: "https://https://www.facebook.com/margaretAkuchDeng", icon: <FaFacebookF /> },
              { href: "https://linkedin.com", icon: <FaLinkedinIn /> },
              { href: "https://github.com/akuch79", icon: <FaGithub /> },
            ].map(({ href, icon }, i) => (
              <a key={i} href={href} target="_blank" rel="noreferrer" style={styles.socialIcon}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #fbbf24, #f59e0b)';
                  e.currentTarget.style.color = '#0f1b2d';
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Navigate</h4>
          {[
            { to: "/", label: "🏠 Home" },
            { to: "/about", label: "ℹ️ About" },
            { to: "/contact", label: "✉️ Contact" },
            { to: "/dashboard", label: "📊 Dashboard" },
          ].map(({ to, label }) => (
            <Link key={label} to={to} style={styles.link}
              onMouseEnter={e => { e.target.style.color = '#fbbf24'; e.target.style.paddingLeft = '6px'; }}
              onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.paddingLeft = '0'; }}>
              {label}
            </Link>
          ))}
        </div>

        {/* Features */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Features</h4>
          {[
            "💸 Send & Receive Money",
            "🏦 Loan Access",
            "📈 Analytics",
            "🌍 Multi-Currency",
            "🔒 Secure Payments",
          ].map(label => (
            <span key={label} style={{ ...styles.link, cursor: 'default' }}>{label}</span>
          ))}
        </div>

        {/* Contact */}
        <div style={styles.col}>
          <h4 style={styles.colTitle}>Contact</h4>
          <a href="mailto:support@monexia.com" style={styles.link}
            onMouseEnter={e => e.target.style.color = '#fbbf24'}
            onMouseLeave={e => e.target.style.color = '#64748b'}>
            📬 support@monexia.com
          </a>
          <span style={styles.link}>⏰ Mon–Fri: 8am–6pm EAT</span>
          <span style={styles.link}>🌐 Serving 30+ Countries</span>
          <div style={styles.supportBadge}>
            <span style={styles.dot} />
            <span style={{ color: '#4ade80', fontSize: '0.78rem', fontWeight: 600 }}>Support Online</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomWrap}>
        <div style={styles.bottom}>
          <p style={styles.copy}>
            &copy; {new Date().getFullYear()} <strong style={{ color: '#fbbf24' }}>Monexia</strong>. All rights reserved.
          </p>
          <p style={styles.copy}>
            Made with ❤️ in <strong style={{ color: '#fbbf24' }}>Turkana West, Kenya</strong> &nbsp;·&nbsp; Finance without borders
          </p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'linear-gradient(180deg, rgba(10,20,35,0.98) 0%, rgba(5,12,24,1) 100%)',
    borderTop: '1px solid rgba(251,191,36,0.12)',
    backdropFilter: 'blur(16px)',
    marginTop: 'auto',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative',
  },
  glowBar: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #fbbf24, #f59e0b, transparent)',
    opacity: 0.6,
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 2rem 2rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '2.5rem',
  },
  brandCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    minWidth: '200px',
    flex: '1.2',
  },
  logo: {
    color: '#f1f5f9',
    fontWeight: 800,
    fontSize: '1.25rem',
    letterSpacing: '-0.3px',
  },
  tagline: {
    color: '#475569',
    fontSize: '0.83rem',
    lineHeight: 1.75,
    maxWidth: '220px',
  },
  locationBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    background: 'rgba(251,191,36,0.08)',
    border: '1px solid rgba(251,191,36,0.2)',
    borderRadius: '999px',
    padding: '0.3rem 0.85rem',
    color: '#94a3b8',
    fontSize: '0.75rem',
    width: 'fit-content',
  },
  socials: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    marginTop: '0.3rem',
  },
  socialIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: '0.82rem',
    transition: 'background 0.2s, color 0.2s, transform 0.2s, border-color 0.2s',
    textDecoration: 'none',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
    minWidth: '140px',
    flex: 1,
  },
  colTitle: {
    color: '#f1f5f9',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(251,191,36,0.15)',
  },
  link: {
    color: '#64748b',
    fontSize: '0.85rem',
    textDecoration: 'none',
    transition: 'color 0.2s, padding-left 0.2s',
    display: 'block',
    lineHeight: 1.6,
  },
  supportBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '0.3rem',
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#4ade80',
    boxShadow: '0 0 6px #4ade80',
    display: 'inline-block',
  },
  bottomWrap: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    padding: '1.2rem 2rem',
  },
  bottom: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  copy: {
    color: '#334155',
    fontSize: '0.78rem',
    margin: 0,
  },
};

export default Footer;