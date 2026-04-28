import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const cats = ['All Sports', 'Football', 'Basketball', 'Tennis', 'Esports', 'Cricket']

function SkeletonRect({ style }) { return <div className="skeleton" style={style} /> }

export default function Streams() {
  const [active, setActive] = useState('All Sports')
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        if (d.success) setStreams(d.data || [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const filtered = active === 'All Sports' ? streams : streams.filter(s => s.category?.includes(active))
  const feat = streams.length > 0 ? streams[0] : null

  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        <div style={{ padding: '24px var(--margin-safe) 0' }}>

          {/* Hero */}
          <section style={{ marginBottom: 36 }}>
            {loading
              ? <SkeletonRect style={{ height: 440, borderRadius: 24 }} />
              : feat ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Link to="/watch" className="str-hero">
                    <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1400&q=80&auto=format" alt="Feature" className="str-hero-img" />
                    <div className="str-hero-grad" />
                    <div className="str-hero-body">
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                        {feat.status === 'live' ? <div className="badge-live"><span className="live-dot" style={{ width: 7, height: 7 }} /> LIVE</div> : null}
                        <span style={{ color: 'var(--primary-dim)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>FEATURED STREAM</span>
                      </div>
                      <h2 className="headline-xl" style={{ color: '#fff', marginBottom: 20 }}>{feat.title}</h2>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span className="btn-primary" style={{ padding: '12px 22px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span> Watch Now
                        </span>
                        <span className="btn-ghost" style={{ padding: '12px 22px' }}>Match Details</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ) : <div style={{ color: 'gray', padding: 40, textAlign: 'center' }}>No streams currently live.</div>
            }
          </section>

          {/* Filters */}
          <section style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <h3 className="headline-lg" style={{ color: '#fff', marginBottom: 14 }}>Recommended Live</h3>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {cats.map(c => (
                    <button key={c} className={`filter-chip ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>{c}</button>
                  ))}
                </div>
              </div>
              <button className="icon-btn glass-light" style={{ width: 38, height: 38, borderRadius: 8 }}>
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </section>

          {/* Grid */}
          <section style={{ marginBottom: 64 }}>
            <div className="str-grid">
              {loading
                ? Array(8).fill(0).map((_, i) => (
                  <div key={i}>
                    <SkeletonRect style={{ aspectRatio: '16/9', borderRadius: 12 }} />
                    <SkeletonRect style={{ height: 16, borderRadius: 5, marginTop: 10, width: '80%' }} />
                    <SkeletonRect style={{ height: 12, borderRadius: 5, marginTop: 6, width: '55%' }} />
                  </div>
                ))
                : filtered.slice(1).map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link to="/watch" className="str-card glass">
                      <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                        <img src={s.thumbnail || "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80"} alt={s.title} className="str-card-img" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                        {s.status === 'live'
                          ? <div className="badge-live" style={{ position: 'absolute', top: 9, left: 9 }}><span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE</div>
                          : <div style={{ position: 'absolute', top: 9, left: 9, background: 'rgba(50,50,55,0.88)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>OFFLINE</div>
                        }
                        <div style={{ position: 'absolute', bottom: 7, right: 7, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 10, padding: '2px 7px', borderRadius: 4 }}>
                          {s.viewers} watching
                        </div>
                      </div>
                      <div style={{ padding: '12px 12px 14px' }}>
                        <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-lexend)', lineHeight: 1.3, marginBottom: 5 }}>{s.title}</h4>
                        <p className="metadata" style={{ color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}>{s.streamer_name || 'Streamer'}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              }
            </div>
          </section>
        </div>
        <Footer />
      </main>

      <style>{`
        .str-hero { display: block; position: relative; height: 440px; border-radius: 24px; overflow: hidden; text-decoration: none; border: 1px solid rgba(255,255,255,0.05); }
        .str-hero-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .str-hero:hover .str-hero-img { transform: scale(1.05); }
        .str-hero-grad { position: absolute; inset: 0; background: linear-gradient(to top, #0a0a0b 5%, rgba(9,9,11,0.12) 50%, transparent); }
        .str-hero-body { position: absolute; bottom: 0; left: 0; padding: 40px 44px; z-index: 2; max-width: 65%; }
        .str-prediction { position: absolute; right: 40px; bottom: 36px; z-index: 2; padding: 18px 22px; border-radius: 14px; border: 1px solid rgba(0,219,233,0.15); }
        .str-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .str-card { display: block; text-decoration: none; border-radius: 14px; overflow: hidden; transition: transform 0.25s; }
        .str-card:hover { transform: translateY(-4px); }
        .str-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s ease; }
        .str-card:hover .str-card-img { transform: scale(1.06); }
        .filter-chip { padding: 7px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.55); font-family: var(--font-inter); transition: all 0.2s; }
        .filter-chip:hover { color: var(--primary-dim); }
        .filter-chip.active { background: var(--primary-dim); color: #000; border-color: var(--primary-dim); }
        @media (max-width: 767px) { .str-prediction { display: none; } .str-hero-body { max-width: 100%; padding: 22px; } .str-hero { height: 280px; } }
      `}</style>
    </div>
  )
}
