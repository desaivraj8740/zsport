import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from './AdminLayout'

const sevColors = { Critical: '#ff4444', High: '#f97316', Medium: 'var(--primary-dim)' }
const statusMeta = {
  active: { color: '#ff4444', bg: 'rgba(255,68,68,0.1)', label: 'Active Piracy' },
  reported: { color: 'var(--primary-dim)', bg: 'rgba(0,219,233,0.08)', label: 'Reported' },
  taken_down: { color: 'var(--secondary-container)', bg: 'rgba(47,248,1,0.08)', label: 'Taken Down' },
}

export default function AdminPiracy() {
  const [records, setRecords] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/piracy')
      .then(r => r.json())
      .then(d => { if (d.success) setRecords(d.data || []) })
  }, [])

  const updateStatus = async (id, status, videoId = null) => {
    await fetch(`/api/piracy/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, videoId })
    })
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  const detectPiracy = async () => {
    const res = await fetch('/api/piracy/detect', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      // Refresh
      fetch('/api/piracy').then(r => r.json()).then(d => { if (d.success) setRecords(d.data || []) });
    } else {
      alert(data.message);
    }
  }

  const report = (id) => updateStatus(id, 'reported')
  const takedown = (id, videoId) => updateStatus(id, 'taken_down', videoId)

  const shown = filter === 'all' ? records : records.filter(r => r.status === filter)

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          <div>
            <h1 className="headline-lg" style={{ color: '#fff' }}>Piracy Tracker</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>Websites illegally streaming your exclusive content.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {['all', 'active', 'reported', 'taken_down'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`filter-chip ${filter === s ? 'active' : ''}`}
                style={{ fontSize: 11 }}>
                {s === 'all' ? 'All' : statusMeta[s]?.label || s}
              </button>
            ))}
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)', margin: '0 8px' }} />
            <button onClick={detectPiracy} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
               <span className="material-symbols-outlined" style={{ fontSize: 14 }}>radar</span>
               Scan Web
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Active Violations', val: records.filter(r => r.status === 'active').length, color: '#ff4444' },
            { label: 'Reported', val: records.filter(r => r.status === 'reported').length, color: 'var(--primary-dim)' },
            { label: 'Taken Down', val: records.filter(r => r.status === 'taken_down').length, color: 'var(--secondary-container)' },
          ].map(s => (
            <div key={s.label} className="glass" style={{ padding: '18px 20px', borderRadius: 14 }}>
              <p className="metadata" style={{ color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>{s.label}</p>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, fontFamily: 'var(--font-lexend)' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="glass" style={{ borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {['Content Name', 'Category', 'Piracy Site', 'URL', 'Severity', 'Found', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r, i) => {
                  const sm = statusMeta[r.status]
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.18s', cursor: 'default' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#fff' }}>{r.content}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{r.category}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#f87171' }}>warning</span>
                          <span style={{ color: '#f87171', fontWeight: 700, fontSize: 13 }}>{r.site}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'monospace', textDecoration: 'none' }} onClick={e => e.preventDefault()}>
                          {r.url.length > 32 ? r.url.slice(0, 32) + '…' : r.url}
                        </a>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: `${sevColors[r.severity]}18`, color: sevColors[r.severity], padding: '3px 9px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>{r.severity}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 11, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{r.found}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: sm.bg, color: sm.color, padding: '3px 9px', borderRadius: 4, fontSize: 10, fontWeight: 800, whiteSpace: 'nowrap' }}>{sm.label}</span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {r.status === 'active' && (
                            <button onClick={() => report(r.id)} title="Report" style={{ background: 'rgba(0,219,233,0.1)', border: '1px solid rgba(0,219,233,0.2)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: 'var(--primary-dim)', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-inter)' }}>
                              Report
                            </button>
                          )}
                          {r.status !== 'taken_down' && (
                            <button onClick={() => takedown(r.id, r.video_id)} title="DMCA Takedown" style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', color: '#ff6b6b', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-inter)' }}>
                              DMCA
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .filter-chip { padding: 7px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.55); font-family: var(--font-inter); transition: all 0.2s; }
        .filter-chip.active { background: #ff6b6b22; color: #ff6b6b; border-color: #ff6b6b55; }
        @media (max-width: 640px) { div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; } }
      `}</style>
    </AdminLayout>
  )
}
