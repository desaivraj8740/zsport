import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout, { getUser } from './AdminLayout'

const stats = [
  { label: 'Total Users', value: '12,480', icon: 'group', color: 'var(--primary-dim)', delta: '+3.2%' },
  { label: 'Active Streams', value: '48', icon: 'live_tv', color: 'var(--secondary-container)', delta: 'Live Now' },
  { label: 'Content Items', value: '1,024', icon: 'movie', color: '#a78bfa', delta: '+12 today' },
  { label: 'Piracy Alerts', value: '07', icon: 'plagiarism', color: '#f87171', delta: '2 new' },
]

const recentActivity = [
  { icon: 'person_add', msg: 'New Director "Alex Chen" added', time: '5 min ago', color: 'var(--primary-dim)' },
  { icon: 'warning', msg: 'Piracy detected on ShadyStreams.com', time: '12 min ago', color: '#f87171' },
  { icon: 'upload', msg: 'Content "IPL Final 2024" uploaded', time: '1 hour ago', color: 'var(--secondary-container)' },
  { icon: 'live_tv', msg: 'Streamer "Sam Live" started broadcast', time: '2 hours ago', color: '#a78bfa' },
  { icon: 'block', msg: 'User #8841 suspended for ToS violation', time: '3 hours ago', color: '#f87171' },
]

export default function AdminDashboard() {
  const user = getUser()
  const [counts, setCounts] = useState({ users: 0, streams: 0, videos: 0, piracy: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => { if(d.success) setCounts(d.data) })
  }, [])

  const stats = [
    { label: 'Total Users', value: counts.users, icon: 'group', color: 'var(--primary-dim)', delta: 'Registered' },
    { label: 'Active Streams', value: counts.streams, icon: 'live_tv', color: 'var(--secondary-container)', delta: 'Live Now' },
    { label: 'Content Items', value: counts.videos, icon: 'movie', color: '#a78bfa', delta: 'Published' },
    { label: 'Piracy Alerts', value: counts.piracy, icon: 'plagiarism', color: '#f87171', delta: 'Active' },
  ]

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 className="headline-lg" style={{ color: '#fff' }}>Welcome back, {user?.name}</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Here's what's happening on the platform today.</p>
        </div>

        {/* Stats */}
        <div className="adm-stats-grid">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="glass adm-stat-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p className="metadata" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{s.label}</p>
                  <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'var(--font-lexend)' }}>{s.value}</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 22 }}>{s.icon}</span>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: s.color, fontWeight: 700 }}>{s.delta}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent activity */}
        <motion.div className="glass adm-activity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="headline-md" style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>Recent Platform Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {recentActivity.map((a, i) => (
              <div key={i} className="adm-act-row">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: a.color, fontSize: 18 }}>{a.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontSize: 14 }}>{a.msg}</p>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .adm-stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; margin-bottom: 24px; }
        .adm-stat-card { border-radius: 16px; padding: 22px; }
        .adm-activity { border-radius: 16px; padding: 24px; }
        .adm-act-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .adm-act-row:last-child { border-bottom: none; }
      `}</style>
    </AdminLayout>
  )
}
