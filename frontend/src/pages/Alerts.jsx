import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const stats = [
  { label: 'Active Threats', value: '02', sub: 'High Severity', subColor: 'var(--error)' },
  { label: 'Login Attempts', value: '148', sub: '+12% vs Yesterday', subColor: 'var(--secondary-container)' },
  { label: 'Integrity Score', value: '98.4%', sub: 'Optimal', subColor: 'rgba(255,255,255,0.35)', valColor: 'var(--primary-dim)' },
  { label: 'CDN Nodes', value: '24/24', sub: 'All operational', subColor: 'var(--secondary-container)', valColor: '#fff' },
]

function SkeletonRect({ style }) { return <div className="skeleton" style={style} /> }

export default function Alerts() {
  const [search, setSearch] = useState('')
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/logs')
      .then(r => r.json())
      .then(d => {
        if (d.success) setAlerts(d.data || [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const list = search
    ? alerts.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.sev.toLowerCase().includes(search.toLowerCase()))
    : alerts

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div style={{ padding: '40px var(--margin-safe) 80px', maxWidth: 1360, margin: '0 auto' }}>

          {/* Header */}
          <motion.div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 44 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1 className="headline-xl" style={{ color: '#fff' }}>Security Command Center</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginTop: 8 }}>Real-time threat monitoring and account integrity status.</p>
            </div>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderRadius: 12 }}>
              <span className="live-dot" />
              <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em' }}>SYSTEM ACTIVE</span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="al-stats">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonRect key={i} style={{ borderRadius: 14, height: 110 }} />)
              : stats.map((s, i) => (
                <motion.div key={s.label} className="glass glow al-stat-card"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}>
                  <div className="metadata" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: s.valColor || '#fff', fontFamily: 'var(--font-lexend)' }}>{s.value}</div>
                  <div className="metadata" style={{ color: s.subColor, marginTop: 7 }}>{s.sub}</div>
                </motion.div>
              ))
            }
          </div>

          {/* Table */}
          <motion.div className="glass al-table-wrap" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="al-table-header">
              <h2 className="headline-md" style={{ color: '#fff' }}>Recent Security Alerts</h2>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'rgba(255,255,255,0.3)' }}>search</span>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search alerts..."
                  className="form-input"
                  style={{ paddingLeft: 36, width: 240, padding: '8px 12px 8px 36px', fontSize: 13 }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="al-table">
                <thead>
                  <tr>
                    {['Severity', 'Alert Details', 'Source IP', 'Timestamp', ''].map(h => (
                      <th key={h} className="al-th">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        {Array(5).fill(0).map((_, j) => (
                          <td key={j} style={{ padding: '16px 20px' }}><SkeletonRect style={{ height: 18, borderRadius: 4 }} /></td>
                        ))}
                      </tr>
                    ))
                    : list.map((a, i) => (
                      <motion.tr key={a.id} className="al-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ background: a.sevBg, color: a.sevColor, padding: '3px 10px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{a.sev}</span>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 3 }}>{a.title}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{a.desc}</div>
                        </td>
                        <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontSize: 12, color: 'var(--primary-dim)', whiteSpace: 'nowrap' }}>{a.ip}</td>
                        <td style={{ padding: '16px 20px', fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{a.time}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <button className="icon-btn"><span className="material-symbols-outlined" style={{ fontSize: 18 }}>more_vert</span></button>
                        </td>
                      </motion.tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className="al-pagination">
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Showing {list.length} of {alerts.length} alerts</span>
              <div style={{ display: 'flex', gap: 5 }}>
                {['Prev', '1', '2', 'Next'].map((l, i) => (
                  <button key={l} style={{ padding: '4px 11px', border: `1px solid ${l === '1' ? 'rgba(0,219,233,0.35)' : 'rgba(255,255,255,0.09)'}`, borderRadius: 6, background: l === '1' ? 'rgba(0,219,233,0.1)' : 'none', color: l === '1' ? 'var(--primary-dim)' : 'rgba(255,255,255,0.4)', fontSize: 12, cursor: 'pointer' }}>{l}</button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>

      <style>{`
        .al-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 32px; }
        .al-stat-card { padding: 22px; border-radius: 14px; transition: transform 0.22s; }
        .al-table-wrap { border-radius: 18px; overflow: hidden; }
        .al-table-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
        .al-table { width: 100%; border-collapse: collapse; }
        .al-th { padding: 11px 20px; text-align: left; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(255,255,255,0.05); white-space: nowrap; }
        .al-row { border-bottom: 1px solid rgba(255,255,255,0.03); transition: background 0.18s; }
        .al-row:hover { background: rgba(0,219,233,0.02); }
        .al-pagination { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
        @media (max-width: 900px) { .al-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .al-stats { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
