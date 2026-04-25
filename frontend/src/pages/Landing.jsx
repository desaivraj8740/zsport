import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const features = [
  { icon: 'shield', title: 'Asset Guard', desc: 'Hardware-level protection for your team NFTs and fan tokens using biometric authentication.' },
  { icon: 'bolt', title: 'Ultra-Stream', desc: 'Zero-lag 4K streaming technology optimized for high-motion sports and real-time betting.' },
  { icon: 'token', title: 'Fan Economy', desc: 'Unlock exclusive rewards and governance rights within your favorite sports organizations.' },
  { icon: 'query_stats', title: 'Predict Analytics', desc: 'AI-driven insights and historical data to power your marketplace decisions and predictions.' },
]

const liveEvents = [
  { id: 1, title: 'Monaco Night Finals', cat: 'Grand Prix Series', viewers: '1.2M', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', live: true, time: '02:45:12' },
  { id: 2, title: 'East vs West Semi-Finals', cat: 'World Championship', viewers: '850K', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', live: true, time: 'Q4 - 05:22' },
  { id: 3, title: 'Ultimate Masters Final', cat: 'Global Invitational', viewers: '45k', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80', live: false, time: 'Scheduled' },
]

export default function Landing() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1000); return () => clearTimeout(t) }, [])

  return (
    <div className="page-root">
      <Navbar transparent />

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-bg">
          <img src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80&auto=format" alt="" className="lp-hero-img" />
          <div className="lp-hero-overlay" />
        </div>
        <div className="lp-hero-content">
          <motion.div className="live-pill" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
            <span className="live-dot" />
            Live Coverage Active
          </motion.div>
          <motion.h1 className="headline-xl lp-h1" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
            Secure Sports Streaming<br />& Digital Asset Protection
          </motion.h1>
          <motion.p className="lp-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            Experience the next generation of sports entertainment. Ultra-low latency streaming meets enterprise-grade blockchain security for your digital collectibles and fan tokens.
          </motion.p>
          <motion.div className="lp-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
            <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>Get Started</Link>
            <Link to="/streams" className="btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }}>View Schedule</Link>
          </motion.div>
          <motion.div className="lp-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            {[['4K+', 'Live Streams'], ['0.1s', 'Latency'], ['98.4%', 'Uptime']].map(([v, l]) => (
              <div key={l} className="lp-stat">
                <div className="lp-stat-val">{v}</div>
                <div className="lp-stat-label">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="section-pad" style={{ background: 'var(--surface-dim)' }}>
        <div className="container">
          <div className="lp-section-hdr">
            <div>
              <h2 className="headline-lg">The SportShield Ecosystem</h2>
              <p className="lp-sect-sub">Protecting your passion with military-grade security and cinematic delivery.</p>
            </div>
            <Link to="/streams" className="lp-explore-link">
              Explore Features <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>arrow_forward</span>
            </Link>
          </div>
          <div className="lp-features">
            {features.map((f, i) => (
              <motion.div key={f.title} className="lp-feat-card glass glow"
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}>
                <div className="lp-feat-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>{f.icon}</span>
                </div>
                <h3 className="headline-md" style={{ margin: '14px 0 8px', fontSize: 20 }}>{f.title}</h3>
                <p style={{ color: 'var(--on-surface-var)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE EVENTS */}
      <section className="section-pad">
        <div className="container">
          <motion.h2 className="headline-lg" style={{ marginBottom: 32 }}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Live Events Now
          </motion.h2>
          <div className="lp-events">
            {liveEvents.map((e, i) => (
              <motion.div key={e.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {!loaded
                  ? <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 14 }} />
                  : (
                    <Link to="/watch" className="lp-event-card">
                      <div className="lp-event-thumb">
                        <img src={e.img} alt={e.title} className="lp-event-img" />
                        <div className="lp-event-grad" />
                        {e.live
                          ? <div className="badge-live" style={{ position: 'absolute', top: 12, left: 12 }}><span className="live-dot" style={{ width: 7, height: 7 }} /> LIVE</div>
                          : <div className="lp-soon-badge">Starts in 15m</div>
                        }
                        <div className="lp-event-info">
                          <p className="metadata" style={{ color: 'var(--primary)', marginBottom: 5 }}>{e.cat}</p>
                          <h4 className="headline-md" style={{ color: '#fff', fontSize: 18 }}>{e.title}</h4>
                          <div style={{ display: 'flex', gap: 16, marginTop: 6, color: 'rgba(255,255,255,0.55)', fontSize: 12 }}>
                            <span><span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>group</span> {e.viewers} Watching</span>
                            <span><span className="material-symbols-outlined" style={{ fontSize: 14, verticalAlign: 'middle' }}>schedule</span> {e.time}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                }
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETPLACE CTA */}
      <section className="section-pad">
        <div className="container">
          <motion.div className="lp-cta glass"
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="lp-cta-orb" />
            <div className="lp-cta-left">
              <h2 className="headline-xl">Marketplace &amp; Asset Protection</h2>
              <p style={{ color: 'var(--on-surface-var)', fontSize: 17, lineHeight: 1.65, margin: '16px 0 24px' }}>
                Securely trade verified sports memorabilia and digital assets protected by multi-signature cold storage and real-time fraud detection.
              </p>
              <ul className="lp-checklist">
                {['Instant settlement on all trades', 'Verified authenticity by leagues', 'Low-fee cross-chain transfers'].map(item => (
                  <li key={item}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary-dim)', fontSize: 20 }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/dashboard" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15, background: '#fff', color: '#000', borderRadius: 10 }}>
                Go to Marketplace
              </Link>
            </div>
            <div className="lp-cta-right">
              <div className="lp-asset-card glass glow">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span className="metadata" style={{ color: 'var(--primary-dim)' }}>Verified Asset</span>
                  <span className="material-symbols-outlined" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>more_horiz</span>
                </div>
                <img src="https://images.unsplash.com/photo-1551958219-acbc9748cf3d?w=400&q=80" alt="Card" style={{ width: '100%', borderRadius: 10, aspectRatio: '1', objectFit: 'cover' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-lexend)' }}>Elite Legend Card #42</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 2 }}>Current Bid: 12.4 ETH</div>
                  </div>
                  <div style={{ width: 38, height: 38, background: 'var(--primary-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#000' }}>shopping_cart</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style>{`
        .page-root { background: var(--bg); min-height: 100vh; }
        .lp-hero { position: relative; min-height: 100vh; display: flex; align-items: center; overflow: hidden; }
        .lp-hero-bg { position: absolute; inset: 0; }
        .lp-hero-img { width: 100%; height: 100%; object-fit: cover; opacity: 0.3; }
        .lp-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, var(--bg) 35%, rgba(13,13,14,0.75) 60%, transparent); }
        .lp-hero-content { position: relative; z-index: 1; padding: 120px var(--margin-safe) 80px; max-width: 720px; }
        .lp-h1 { color: var(--on-surface); margin: 16px 0 20px; }
        .lp-sub { color: var(--on-surface-var); font-size: 18px; line-height: 1.65; max-width: 560px; }
        .lp-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 32px; }
        .lp-stats { display: flex; gap: 32px; margin-top: 40px; padding-top: 28px; border-top: 1px solid rgba(255,255,255,0.08); }
        .lp-stat-val { font-family: var(--font-lexend); font-size: 26px; font-weight: 800; color: #fff; }
        .lp-stat-label { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }
        .live-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(47,248,1,0.08); border: 1px solid rgba(47,248,1,0.25); padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--secondary-container); }
        .lp-section-hdr { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px; flex-wrap: wrap; gap: 12px; }
        .lp-sect-sub { color: var(--on-surface-var); margin-top: 6px; font-size: 15px; }
        .lp-explore-link { color: var(--primary-dim); font-size: 14px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
        .lp-explore-link:hover { text-decoration: underline; }
        .lp-features { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px; }
        .lp-feat-card { padding: 24px; border-radius: 16px; }
        .lp-feat-icon { width: 48px; height: 48px; border-radius: 12px; background: rgba(0,240,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--primary-dim); }
        .lp-events { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .lp-event-card { display: block; text-decoration: none; border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 16px 48px rgba(0,0,0,0.4); transition: transform 0.3s; }
        .lp-event-card:hover { transform: translateY(-4px); }
        .lp-event-card:hover .lp-event-img { transform: scale(1.07); }
        .lp-event-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; }
        .lp-event-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .lp-event-grad { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 40%, transparent); }
        .lp-soon-badge { position: absolute; top: 12px; left: 12px; background: rgba(55,55,60,0.9); color: #fff; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; }
        .lp-event-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 18px 14px; }
        .lp-cta { border-radius: 24px; padding: 60px; display: flex; flex-wrap: wrap; gap: 48px; border: 1px solid rgba(255,255,255,0.08); position: relative; overflow: hidden; }
        .lp-cta-orb { position: absolute; top: -80px; right: -80px; width: 360px; height: 360px; background: rgba(0,219,233,0.07); border-radius: 50%; filter: blur(90px); pointer-events: none; }
        .lp-cta-left { flex: 1; min-width: 260px; }
        .lp-cta-right { flex: 1; min-width: 240px; max-width: 380px; }
        .lp-checklist { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
        .lp-checklist li { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px; }
        .lp-asset-card { border-radius: 16px; padding: 16px; }
        @media (max-width: 767px) {
          .lp-hero-content { padding: 100px 20px 60px; }
          .lp-hero-overlay { background: linear-gradient(to bottom, var(--bg) 0%, rgba(13,13,14,0.9) 100%); }
          .lp-cta { padding: 32px 20px; }
          .lp-cta-right { display: none; }
        }
      `}</style>
    </div>
  )
}
