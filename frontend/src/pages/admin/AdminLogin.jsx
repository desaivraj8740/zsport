import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Demo credentials
const USERS = {
  admin: { pass: 'admin', role: 'admin', name: 'Super Admin', email: 'admin@sportshield.com' },
  director: { pass: 'director123', role: 'director', name: 'Alex Director', email: 'director@sportshield.com' },
  streamer: { pass: 'streamer123', role: 'streamer', name: 'Sam Streamer', email: 'streamer@sportshield.com' },
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (data.success) {
        if (data.user.role === 'user') {
          setError('Access denied. This portal is for administrators and creators only.')
        } else {
          localStorage.setItem('adminUser', JSON.stringify({ ...data.user, name: data.user.username.toUpperCase() }))
          navigate('/admin/dashboard')
        }
      } else {
        setError(data.message || 'Invalid credentials.')
      }
    } catch (err) {
      console.error(err)
      setError('Server unreachable. Please ensure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const fillCreds = (u, p) => { setUsername(u); setPassword(p); setError('') }

  return (
    <div className="admin-login-page">
      <div className="admin-login-mesh" />

      {/* Logo */}
      <div className="admin-login-logo">
        <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--primary-dim)' }}>shield</span>
        <span style={{ fontFamily: 'var(--font-lexend)', fontWeight: 800, fontSize: 20, color: '#fff' }}>SportShield</span>
        <div className="admin-badge">Admin Portal</div>
      </div>

      <motion.div className="admin-login-card glass" initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="headline-lg" style={{ color: '#fff', fontSize: 26 }}>Secure Admin Access</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 6 }}>Sign in with your role credentials.</p>
        </div>

        {/* Quick fill demo */}
        <div style={{ marginBottom: 22 }}>
          <p className="metadata" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Demo Quick-Fill:</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Admin', u: 'admin', p: 'admin', color: '#ff6b6b' },
              { label: 'Director', u: 'director', p: 'director123', color: 'var(--primary-dim)' },
              { label: 'Streamer', u: 'streamer', p: 'streamer123', color: 'var(--secondary-container)' },
            ].map(d => (
              <button key={d.label} onClick={() => fillCreds(d.u, d.p)}
                style={{ flex: 1, padding: '7px 0', border: `1px solid ${d.color}33`, borderRadius: 8, background: `${d.color}12`, color: d.color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-lexend)', transition: 'background 0.2s' }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label className="form-label">Username</label>
            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" autoComplete="off" />
          </div>
          <div className="admin-form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPass ? 'text' : 'password'} className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 44 }} />
              <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }} onClick={() => setShowPass(p => !p)}>
                <span className="material-symbols-outlined" style={{ fontSize: 19 }}>{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, padding: '10px 14px', color: '#ff6b6b', fontSize: 12, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15 }} disabled={loading}>
            {loading
              ? <><span className="material-symbols-outlined" style={{ fontSize: 18, animationName: 'spin', animationDuration: '0.8s', animationTimingFunction: 'linear', animationIterationCount: 'infinite', display: 'inline-block' }}>refresh</span> Authenticating...</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>lock_open</span> Sign In</>
            }
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="metadata" style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>Demo Credentials</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#ff6b6b' }}><b>Admin:</b> admin / admin — Full access</span>
            <span style={{ fontSize: 11, color: 'var(--primary-dim)' }}><b>Director:</b> director / director123 — Content & insights</span>
            <span style={{ fontSize: 11, color: 'var(--secondary-container)' }}><b>Streamer:</b> streamer / streamer123 — Live streaming only</span>
          </div>
        </div>
      </motion.div>

      {/* Glow orbs */}
      <div style={{ position: 'fixed', top: '20%', left: -60, width: 320, height: 320, background: 'rgba(0,219,233,0.07)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', right: -60, width: 280, height: 280, background: 'rgba(47,248,1,0.05)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-login-page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; background: var(--bg); position: relative; overflow: hidden; }
        .admin-login-mesh { position: fixed; inset: 0; background: radial-gradient(at 0% 0%, rgba(0,219,233,0.1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(47,248,1,0.06) 0, transparent 50%); pointer-events: none; }
        .admin-login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
        .admin-badge { background: rgba(255,107,107,0.12); border: 1px solid rgba(255,107,107,0.25); color: #ff6b6b; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
        .admin-login-card { width: 100%; max-width: 440px; border-radius: 20px; padding: 36px; box-shadow: 0 40px 100px rgba(0,0,0,0.5); }
        .admin-form-group { margin-bottom: 18px; }
      `}</style>
    </div>
  )
}
