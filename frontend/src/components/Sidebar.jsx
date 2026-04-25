import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { icon: 'home', label: 'Home', path: '/' },
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'live_tv', label: 'Live Events', path: '/streams' },
  { icon: 'security', label: 'Alerts', path: '/alerts' },
  { icon: 'info', label: 'About', path: '/about' },
  { icon: 'contact_page', label: 'Contact', path: '/contact' },
]

function SideContent({ onClose }) {
  const location = useLocation()
  return (
    <div className="sbcontent">
      <div className="sb-user glass-light">
        <div className="sb-avatar">PU</div>
        <div>
          <div className="sb-name">Premium User</div>
          <div className="sb-role">Elite Status</div>
        </div>
      </div>
      <nav className="sb-nav">
        {navItems.map(item => {
          const active = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} className={`sb-link ${active ? 'active' : ''}`} onClick={onClose}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="sb-bottom">
        <button className="sb-upgrade">Upgrade to Pro</button>
        <Link to="/login" className="sb-logout">
          <span className="material-symbols-outlined">logout</span>
          Logout
        </Link>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <aside className="sidebar desktop-sidebar"><SideContent /></aside>

      <button className="sb-fab glass" onClick={() => setOpen(p => !p)} aria-label="Menu">
        <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="sb-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="sidebar mobile-sidebar" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 280, damping: 28 }}>
              <SideContent onClose={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .sidebar { position: fixed; top: var(--nav-h); left: 0; width: var(--sidebar-w); height: calc(100vh - var(--nav-h)); background: rgba(9,9,11,0.92); backdrop-filter: blur(24px); border-right: 1px solid rgba(255,255,255,0.06); z-index: 50; }
        .sbcontent { display: flex; flex-direction: column; height: 100%; padding: 20px 0; }
        .sb-user { display: flex; align-items: center; gap: 12px; margin: 0 16px 20px; padding: 12px; border-radius: 12px; }
        .sb-avatar { width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, var(--primary-dim), #0066ff); display: flex; align-items: center; justify-content: center; color: #000; font-weight: 800; font-size: 13px; flex-shrink: 0; }
        .sb-name { color: #fff; font-weight: 700; font-size: 14px; font-family: var(--font-lexend); }
        .sb-role { color: var(--primary-dim); font-size: 10px; letter-spacing: 0.1em; font-weight: 700; text-transform: uppercase; margin-top: 2px; }
        .sb-nav { flex: 1; overflow-y: auto; padding: 0 8px; }
        .sb-link { display: flex; align-items: center; gap: 13px; padding: 11px 14px; border-radius: 0; font-family: var(--font-lexend); font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.42); text-decoration: none; transition: color 0.18s, background 0.18s; }
        .sb-link:hover { color: var(--primary-dim); background: rgba(0,219,233,0.04); }
        .sb-link.active { color: var(--primary-dim); font-weight: 700; border-left: 3px solid var(--primary-dim); background: rgba(0,219,233,0.06); padding-left: 11px; }
        .sb-bottom { padding: 14px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 6px; }
        .sb-upgrade { width: 100%; padding: 10px; background: rgba(0,219,233,0.08); border: 1px solid rgba(0,219,233,0.2); border-radius: 10px; color: var(--primary-dim); font-weight: 700; font-size: 13px; font-family: var(--font-lexend); cursor: pointer; transition: background 0.2s, color 0.2s; }
        .sb-upgrade:hover { background: var(--primary-dim); color: #000; }
        .sb-logout { display: flex; align-items: center; gap: 10px; color: rgba(255,255,255,0.32); text-decoration: none; font-size: 14px; font-family: var(--font-lexend); padding: 8px 4px; transition: color 0.2s; }
        .sb-logout:hover { color: var(--error); }
        .sb-fab { display: none; position: fixed; bottom: 22px; right: 22px; z-index: 60; width: 46px; height: 46px; border-radius: 50%; color: var(--primary-dim); cursor: pointer; align-items: center; justify-content: center; }
        .sb-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 59; backdrop-filter: blur(3px); }
        .mobile-sidebar { z-index: 60; }
        @media (max-width: 1024px) { .desktop-sidebar { display: none; } .sb-fab { display: flex; } }
      `}</style>
    </>
  )
}
