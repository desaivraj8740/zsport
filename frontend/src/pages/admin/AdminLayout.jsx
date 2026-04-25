import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const getUser = () => { try { return JSON.parse(localStorage.getItem('adminUser')) } catch { return null } }

const allNavItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', roles: ['admin', 'director', 'streamer'] },
  { icon: 'group', label: 'User Management', path: '/admin/users', roles: ['admin'] },
  { icon: 'plagiarism', label: 'Piracy Tracker', path: '/admin/piracy', roles: ['admin', 'director'] },
  { icon: 'upload', label: 'Upload Content', path: '/admin/upload', roles: ['admin', 'director'] },
  { icon: 'video_library', label: 'Manage Content', path: '/admin/content', roles: ['admin', 'director', 'streamer'] },
  { icon: 'live_tv', label: 'My Livestreams', path: '/admin/streams', roles: ['admin', 'streamer'] },
  { icon: 'bar_chart', label: 'Insights', path: '/admin/insights', roles: ['admin', 'director'] },
]

const roleColors = { admin: { color: '#ff6b6b', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.25)' }, director: { color: 'var(--primary-dim)', bg: 'rgba(0,219,233,0.1)', border: 'rgba(0,219,233,0.2)' }, streamer: { color: 'var(--secondary-container)', bg: 'rgba(47,248,1,0.08)', border: 'rgba(47,248,1,0.2)' } }

export default function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = getUser()

  useEffect(() => {
    if (!user) navigate('/admin')
  }, [])

  if (!user) return null

  const rc = roleColors[user.role] || roleColors.admin
  const navItems = allNavItems.filter(n => n.roles.includes(user.role))

  const logout = () => { localStorage.removeItem('adminUser'); navigate('/admin') }

  return (
    <div className="adm-root">
      {/* Sidebar */}
      <aside className="adm-sidebar">
        <div className="adm-logo">
          <span className="material-symbols-outlined" style={{ color: '#ff6b6b', fontSize: 22 }}>shield</span>
          <span>SportShield</span>
          <span className="adm-portal-tag">Admin</span>
        </div>

        {/* Role badge */}
        <div className="adm-user-card" style={{ borderColor: rc.border }}>
          <div className="adm-avatar" style={{ background: rc.color, color: '#000' }}>
            {user.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div>
            <div className="adm-uname">{user.name}</div>
            <div className="adm-role" style={{ color: rc.color, borderColor: rc.border, background: rc.bg }}>{user.role.toUpperCase()}</div>
          </div>
        </div>

        <nav className="adm-nav">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`adm-link ${active ? 'active' : ''}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="adm-bottom">
          <Link to="/" className="adm-link" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>home</span> Main Site
          </Link>
          <button className="adm-link adm-logout" onClick={logout}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="adm-main">
        {/* Top bar */}
        <header className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>ADMIN PANEL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{user.email}</span>
            <div className="adm-avatar" style={{ width: 32, height: 32, background: rc.color, color: '#000', fontSize: 12, borderRadius: 8 }}>
              {user.name.split(' ').map(w => w[0]).join('')}
            </div>
          </div>
        </header>

        <div className="adm-content">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </div>
      </div>

      <style>{`
        .adm-root { display: flex; min-height: 100vh; background: var(--bg); }
        .adm-sidebar { width: 240px; flex-shrink: 0; background: #0a0a0c; border-right: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; }
        .adm-logo { display: flex; align-items: center; gap: 8px; padding: 20px 18px; font-family: var(--font-lexend); font-weight: 800; font-size: 16px; color: #fff; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .adm-portal-tag { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; background: rgba(255,107,107,0.12); color: #ff6b6b; border: 1px solid rgba(255,107,107,0.2); padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
        .adm-user-card { display: flex; align-items: center; gap: 10px; margin: 14px 12px; padding: 12px; border-radius: 10px; border: 1px solid; background: rgba(255,255,255,0.02); }
        .adm-avatar { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; flex-shrink: 0; font-family: var(--font-lexend); }
        .adm-uname { color: #fff; font-weight: 700; font-size: 13px; font-family: var(--font-lexend); }
        .adm-role { font-size: 9px; font-weight: 800; letter-spacing: 0.1em; padding: 2px 8px; border-radius: 4px; border: 1px solid; display: inline-block; margin-top: 3px; font-family: var(--font-inter); }
        .adm-nav { flex: 1; display: flex; flex-direction: column; padding: 8px; gap: 2px; }
        .adm-link { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 8px; font-family: var(--font-lexend); font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.18s, background 0.18s; background: none; border: none; cursor: pointer; width: 100%; }
        .adm-link:hover { color: #fff; background: rgba(255,255,255,0.04); }
        .adm-link.active { color: #ff6b6b; background: rgba(255,107,107,0.07); border-left: 3px solid #ff6b6b; padding-left: 9px; font-weight: 700; }
        .adm-bottom { padding: 12px 8px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 2px; }
        .adm-logout:hover { color: var(--error) !important; }
        .adm-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .adm-topbar { height: 56px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; background: rgba(10,10,12,0.8); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 10; }
        .adm-content { flex: 1; padding: 28px; overflow-y: auto; }
        @media (max-width: 768px) { .adm-sidebar { display: none; } .adm-content { padding: 16px; } }
      `}</style>
    </div>
  )
}

export { getUser, roleColors, allNavItems }
