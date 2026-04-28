import { Link } from 'react-router-dom'

const footerLinks = ['Privacy Policy', 'Terms of Service', 'Help Center', 'Careers']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">ZSport</span>
          <p className="footer-copy">© 2025 ZSport. All Rights Reserved.</p>
        </div>
        <div className="footer-links">
          {footerLinks.map(l => (
            <a key={l} href="#" className="footer-link">{l}</a>
          ))}
        </div>
        <div className="footer-social">
          {['public', 'mail', 'forum'].map(icon => (
            <button key={icon} className="footer-social-btn">
              <span className="material-symbols-outlined">{icon}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        .footer {
          width: 100%;
          padding: 48px 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          background: #090909;
        }
        .footer-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 var(--margin-safe);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }
        .footer-brand { display: flex; flex-direction: column; gap: 6px; }
        .footer-logo {
          font-family: var(--font-lexend);
          font-size: 18px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
        }
        .footer-copy {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          font-family: var(--font-lexend);
          letter-spacing: 0.03em;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 24px;
        }
        .footer-link {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          font-family: var(--font-lexend);
          letter-spacing: 0.03em;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--primary-dim); }
        .footer-social { display: flex; gap: 12px; }
        .footer-social-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: none;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, border-color 0.2s;
        }
        .footer-social-btn:hover {
          color: var(--primary-dim);
          border-color: var(--primary-dim);
        }
        .footer-social-btn .material-symbols-outlined { font-size: 18px; }
        @media (max-width: 640px) {
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  )
}
