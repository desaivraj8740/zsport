import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Navigate back to where they came from or dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        if (!form.username || !form.password) {
          setError('Please fill in all fields.')
          setLoading(false)
          return
        }
        const res = await login(form.username, form.password)
        if (res.success) {
          navigate(from, { replace: true })
        } else {
          setError(res.message)
        }
      } else {
        if (!form.username || !form.email || !form.password || !form.confirm) {
          setError('Please fill in all fields.')
          setLoading(false); return;
        }
        if (form.password !== form.confirm) {
          setError('Passwords do not match.')
          setLoading(false); return;
        }
        if (!agreed) {
          setError('You must agree to the Terms & Conditions.')
          setLoading(false); return;
        }
        const res = await register(form.username, form.email, form.password)
        if (res.success) {
          navigate(from, { replace: true })
        } else {
          setError(res.message)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setIsLogin(true)
    setForm(f => ({ ...f, username: 'demo', password: 'demo@123' }))
    setError('')
  }

  return (
    <div className="auth-page">
      {/* Subtle animated background */}
      <div className="auth-mesh-bg" />
      <div className="auth-particles" />

      <Link to="/" className="auth-logo">
        <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--primary-dim)' }}>shield</span>
        SportShield
      </Link>

      <motion.div className="auth-card glass glow-strong" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        
        {/* Toggle tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); }}>Login</button>
          <button className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); }}>Sign Up</button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 className="headline-lg" style={{ color: '#fff', fontSize: 24, marginBottom: 6 }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{isLogin ? 'Enter your credentials to access your account.' : 'Join to watch exclusive live sports events.'}</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, padding: '10px 14px', color: '#ff6b6b', fontSize: 13, marginBottom: 20 }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {!isLogin && (
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              </div>
            )}
            
            <div>
              <label className="form-label">{isLogin ? 'Username or Email' : 'Username'}</label>
              <input type="text" className="form-input" placeholder={isLogin ? "demo / desaivraj73@gmail.com" : "username"} value={form.username} onChange={e => setForm(f => ({...f, username: e.target.value}))} />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} style={{ paddingRight: 40 }} />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPass(!showPass)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ marginTop: 16 }}>
                    <label className="form-label">Confirm Password</label>
                    <input type={showPass ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 18, cursor: 'pointer' }}>
                    <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--primary-dim)' }} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
                      I agree to the <a href="#" style={{ color: 'var(--primary-dim)', textDecoration: 'none' }}>Terms & Conditions</a> and processing of my personal data.
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLogin && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                Demo bypass available:
                <button type="button" onClick={fillDemo} style={{ background: 'none', border: 'none', color: 'var(--primary-dim)', cursor: 'pointer', fontWeight: 700, marginLeft: 6 }}>Auto-fill</button>
              </div>
              <a href="#" style={{ color: 'var(--primary-dim)', fontSize: 13, textDecoration: 'none' }}>Forgot password?</a>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: 24, fontSize: 15 }} disabled={loading}>
            {loading ? <span className="material-symbols-outlined" style={{ animation: 'spin 1s linear infinite' }}>refresh</span> : <span className="material-symbols-outlined">{isLogin ? 'login' : 'person_add'}</span>}
            {isLogin ? 'Sign In to SportShield' : 'Create Free Account'}
          </button>
        </form>

      </motion.div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; background: #080809; padding: 20px; }
        .auth-mesh-bg { position: fixed; inset: 0; background: radial-gradient(circle at 10% 20%, rgba(0, 219, 233, 0.05) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(47, 248, 1, 0.03) 0%, transparent 40%); animation: meshMove 15s ease-in-out infinite alternate; pointer-events: none; }
        .auth-particles { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 30px 30px; animation: slideIn 20s linear infinite; pointer-events: none; }
        .auth-logo { position: absolute; top: 30px; left: 40px; display: flex; gap: 8px; align-items: center; text-decoration: none; color: #fff; font-family: var(--font-lexend); font-size: 20px; font-weight: 800; font-style: italic; z-index: 10; }
        .auth-card { width: 100%; max-width: 420px; padding: 36px; border-radius: 20px; z-index: 10; background: rgba(15,15,16,0.6); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.05); }
        .auth-tabs { display: flex; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 4px; margin-bottom: 28px; }
        .auth-tab { flex: 1; padding: 10px; border: none; background: transparent; color: rgba(255,255,255,0.4); font-family: var(--font-inter); font-weight: 700; font-size: 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .auth-tab.active { background: rgba(255,255,255,0.08); color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .auth-eye-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: rgba(255,255,255,0.4); cursor: pointer; display: flex; transition: color 0.2s; }
        .auth-eye-btn:hover { color: #fff; }
        @keyframes meshMove { 0% { transform: scale(1); } 100% { transform: scale(1.15) translate(2%, 2%); } }
        @keyframes slideIn { 0% { background-position: 0 0; } 100% { background-position: 30px 30px; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 600px) { .auth-logo { position: static; margin-bottom: 30px; justify-content: center; } .auth-page { flex-direction: column; justify-content: flex-start; padding-top: 40px; } .auth-card { padding: 24px; } }
      `}</style>
    </div>
  )
}


