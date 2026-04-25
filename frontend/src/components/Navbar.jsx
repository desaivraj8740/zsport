import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Live', path: '/streams' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Watch', path: '/watch' },
  { label: 'Alerts', path: '/alerts' },
]

export default function Navbar({ transparent = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <nav className="navbar" style={{ background: transparent && !scrolled ? 'transparent' : undefined }} data-scrolled={scrolled}>
        <div className="navbar-inner">
          <Link to="/" className="nav-logo">SportShield</Link>
          <div className="nav-links desktop-only">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}>{l.label}</Link>
            ))}
          </div>
          <div className="nav-right">
            <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
            <button className="icon-btn"><span className="material-symbols-outlined">settings</span></button>
            <Link to="/watch" className="btn-primary" style={{ padding: '8px 18px', borderRadius: 999, fontSize: 13 }}>Watch Now</Link>
            <button className="icon-btn mobile-only" onClick={() => setMobileOpen(p => !p)}>
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-nav glass"
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.18 }}>
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} className={`mobile-link ${location.pathname === l.path ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}>{l.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          height: var(--nav-h);
          background: rgba(9,9,11,0.85);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.3s, box-shadow 0.3s;
        }
        .navbar[data-scrolled="true"] { box-shadow: 0 4px 24px rgba(0,0,0,0.35); background: rgba(9,9,11,0.97) !important; }
        .navbar-inner { max-width: 1600px; margin: 0 auto; height: 100%; display: flex; align-items: center; gap: 28px; padding: 0 var(--margin-safe); }
        .nav-logo { font-family: var(--font-lexend); font-size: 21px; font-weight: 800; font-style: italic; color: var(--primary-dim); text-decoration: none; letter-spacing: -0.02em; }
        .nav-links { display: flex; align-items: center; gap: 24px; }
        .nav-link { font-family: var(--font-lexend); font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.5); text-decoration: none; transition: color 0.2s; padding-bottom: 2px; }
        .nav-link:hover { color: #fff; }
        .nav-link.active { color: var(--primary-dim); border-bottom: 2px solid var(--primary-dim); }
        .nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
        .mobile-nav { position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 99; padding: 12px var(--margin-safe); display: flex; flex-direction: column; gap: 2px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .mobile-link { text-decoration: none; padding: 12px 14px; border-radius: 8px; color: rgba(255,255,255,0.6); font-family: var(--font-lexend); font-weight: 600; font-size: 15px; transition: color 0.2s, background 0.2s; }
        .mobile-link:hover,.mobile-link.active { color: var(--primary-dim); background: rgba(0,219,233,0.05); }
        @media (min-width: 769px) { .mobile-only { display: none !important; } }
        @media (max-width: 768px) { .desktop-only { display: none !important; } }
      `}</style>
    </>
  )
}
