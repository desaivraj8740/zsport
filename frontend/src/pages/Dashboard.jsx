import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const leagues = [
  { name: 'Premier League', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80' },
  { name: 'NBA Basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80' },
  { name: 'Formula 1', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
  { name: 'Grand Slam Tennis', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80' },
  { name: 'NHL Hockey', img: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=400&q=80' },
  { name: 'WRC Rally', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80' },
]

function SkeletonRect({ style }) { return <div className="skeleton" style={style} /> }

export default function Dashboard() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then(r => r.json())
      .then(d => {
        if (d.success) setVideos(d.data || [])
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  const feat = videos.length > 0 ? videos[0] : null

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Sidebar />
      <main className="main-content with-sidebar">
        {/* Hero */}
        <div style={{ padding: '24px var(--margin-safe) 20px' }}>
          {loading
            ? <SkeletonRect style={{ height: 480, borderRadius: 24 }} />
            : feat ? (
              <motion.div className="db-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <img src={feat.thumbnail || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1400&q=80&auto=format'} alt="Featured" className="db-hero-img" />
                <div className="db-hero-grad" />
                <div className="db-hero-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    {feat.isLive ? <div className="badge-live nowrap"><span className="live-dot" style={{ width: 7, height: 7 }} /> LIVE NOW</div> : null}
                    <span style={{ color: 'var(--primary-dim)', fontFamily: 'var(--font-lexend)', fontWeight: 700, fontSize: 13 }}>{feat.category?feat.category.toUpperCase():'FEATURED EVENT'}</span>
                  </div>
                  <h1 className="headline-xl" style={{ color: '#fff', marginBottom: 14 }}>{feat.title}</h1>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.6, marginBottom: 24, maxWidth: 500 }}>
                    {feat.description || 'Experience the clash in stunning 4K HDR with exclusive tactical cameras.'}
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Link to="/watch" className="btn-primary" style={{ padding: '13px 26px', fontSize: 15 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>play_arrow</span> Watch Live
                    </Link>
                    <button className="btn-ghost" style={{ padding: '13px 26px' }}>Details</button>
                  </div>
                </div>
              </motion.div>
            ) : <div style={{ color: 'gray', padding: 40, textAlign: 'center' }}>No content available.</div>
          }
        </div>

        {/* Leagues */}
        <div style={{ padding: '0 var(--margin-safe) 28px' }}>
          <h2 className="headline-md" style={{ color: '#fff', marginBottom: 18 }}>Trending Leagues</h2>
          <div className="leagues-scroll no-scrollbar">
            {leagues.map((l, i) => (
              <motion.div key={l.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                <Link to="/streams" className="league-card">
                  <img src={l.img} alt={l.name} className="league-img" />
                  <div className="league-grad" />
                  <span className="league-name">{l.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Videos */}
        <div style={{ padding: '0 var(--margin-safe) 72px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 className="headline-md" style={{ color: '#fff' }}>Recommended for You</h2>
            <Link to="/streams" style={{ color: 'var(--primary-dim)', fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              View All <span className="material-symbols-outlined" style={{ fontSize: 15, verticalAlign: 'middle' }}>arrow_forward</span>
            </Link>
          </div>
          <div className="video-grid">
            {loading
              ? Array(4).fill(0).map((_, i) => (
                <div key={i}>
                  <SkeletonRect style={{ aspectRatio: '16/9', borderRadius: 12 }} />
                  <SkeletonRect style={{ height: 16, borderRadius: 6, marginTop: 10, width: '80%' }} />
                  <SkeletonRect style={{ height: 12, borderRadius: 6, marginTop: 7, width: '50%' }} />
                </div>
              ))
              : videos.map((v, i) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to="/watch" style={{ textDecoration: 'none', display: 'block' }}>
                    <div className="vcard">
                      <div className="vcard-thumb">
                        <img src={v.thumbnail || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80'} alt={v.title} className="vcard-img" />
                        {v.isLive
                          ? <div className="badge-live" style={{ position: 'absolute', top: 8, left: 8, fontSize: 9 }}><span className="live-dot" style={{ width: 6, height: 6 }} /> LIVE</div>
                          : <div style={{ position: 'absolute', bottom: 7, right: 7, background: 'rgba(0,0,0,0.82)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4 }}>{v.quality || 'HD'}</div>
                        }
                        <div className="vcard-overlay">
                          <span className="material-symbols-outlined" style={{ fontSize: 44 }}>play_circle</span>
                        </div>
                      </div>
                      <h3 className="vcard-title">{v.title}</h3>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginTop: 3 }}>{v.category || 'General'} • {v.views} views</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            }
          </div>
        </div>
        <Footer />
      </main>

      <style>{`
        .db-hero { position: relative; height: 480px; border-radius: 24px; overflow: hidden; cursor: pointer; }
        .db-hero-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
        .db-hero:hover .db-hero-img { transform: scale(1.04); }
        .db-hero-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(9,9,11,0.96) 25%, rgba(9,9,11,0.1) 65%, transparent); }
        .db-hero-body { position: absolute; bottom: 0; left: 0; padding: 44px; max-width: 65%; }
        .nowrap { white-space: nowrap; }
        .leagues-scroll { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px; }
        .league-card { display: block; flex-shrink: 0; width: 180px; aspect-ratio: 3/4; border-radius: 14px; overflow: hidden; position: relative; text-decoration: none; transition: transform 0.3s; border: 1px solid rgba(255,255,255,0.04); }
        .league-card:hover { transform: scale(1.04); }
        .league-card:hover .league-img { transform: scale(1.1); }
        .league-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .league-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(9,9,11,0.88) 25%, transparent); }
        .league-name { position: absolute; bottom: 12px; left: 12px; color: #fff; font-family: var(--font-lexend); font-size: 13px; font-weight: 700; }
        .video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 22px; }
        .vcard { cursor: pointer; }
        .vcard-thumb { position: relative; aspect-ratio: 16/9; border-radius: 11px; overflow: hidden; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 10px; }
        .vcard:hover .vcard-thumb { box-shadow: 0 0 20px rgba(0,219,233,0.2); }
        .vcard-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .vcard:hover .vcard-img { transform: scale(1.06); }
        .vcard-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.38); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.22s; color: #fff; }
        .vcard:hover .vcard-overlay { opacity: 1; }
        .vcard-title { color: #fff; font-size: 13px; font-weight: 700; line-height: 1.4; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; transition: color 0.2s; }
        .vcard:hover .vcard-title { color: var(--primary-dim); }
        @media (max-width: 767px) { .db-hero { height: 300px; } .db-hero-body { padding: 22px; max-width: 100%; } }
      `}</style>
    </div>
  )
}
