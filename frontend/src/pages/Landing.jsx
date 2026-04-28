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

      {/* BENTO GRID FEATURE SECTION */}
      <section className="bento-section">
        <div className="container">
          <div className="lp-section-hdr" style={{ marginBottom: 40 }}>
            <div>
              <h2 className="headline-lg">The ZSport Ecosystem</h2>
              <p className="lp-sect-sub">Protecting your passion with military-grade security and cinematic delivery.</p>
            </div>
            <Link to="/streams" className="lp-explore-link">
              Explore Features <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>arrow_forward</span>
            </Link>
          </div>

          <div className="bento-grid">
            {/* Card 1 — Large 2-col: Product preview */}
            <motion.div className="bento-card bento-large"
              initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="bento-tag">Live Platform Preview</div>
              <h3 className="bento-title">Stream anything. Secured by default.</h3>
              <p className="bento-sub">Ultra-low latency 4K feeds with AES-256 DRM encryption active on every stream.</p>
              <div className="bento-screenshot">
                <div className="bento-screen-bar"><span /><span /><span /></div>
                <div className="bento-screen-body">
                  <div className="bento-player-mock">
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'rgba(37,99,235,0.7)' }}>play_circle</span>
                    <div className="bento-live-tag"><span className="live-dot" style={{ width: 6, height: 6 }} />LIVE • 1.2M Watching</div>
                  </div>
                  <div className="bento-screen-row">
                    {['Champions League', 'NBA Finals', 'F1 Monaco', 'Grand Slam'].map(t => (
                      <div key={t} className="bento-screen-chip">{t}</div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card 2 — Tall 2-row: Bold stat */}
            <motion.div className="bento-card bento-tall bento-accent"
              initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="material-symbols-outlined bento-icon-lg">bolt</span>
              <div className="bento-stat">10x</div>
              <div className="bento-stat-label">Faster than traditional CDN delivery</div>
              <p className="bento-sub" style={{ marginTop: 16 }}>Our edge-optimised infrastructure ensures sub-second delivery globally, with zero buffering on premium events.</p>
              <div className="bento-stat-chips">
                <span className="bento-chip-green">0.1s Latency</span>
                <span className="bento-chip-green">98.4% Uptime</span>
              </div>
            </motion.div>

            {/* Card 3 — Small: Asset Guard */}
            <motion.div className="bento-card bento-small"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.15 }}>
              <div className="bento-icon-wrap" style={{ background: 'rgba(37,99,235,0.1)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary-dim)', fontSize: 26 }}>shield</span>
              </div>
              <h4 className="bento-feat-title">Asset Guard</h4>
              <p className="bento-sub">Hardware-level protection for team NFTs and fan tokens via biometric auth.</p>
            </motion.div>

            {/* Card 4 — Small: Ultra-Stream */}
            <motion.div className="bento-card bento-small bento-accent"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.2 }}>
              <div className="bento-icon-wrap" style={{ background: 'rgba(47,248,1,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary-container)', fontSize: 26 }}>stream</span>
              </div>
              <h4 className="bento-feat-title">Ultra-Stream</h4>
              <p className="bento-sub">Zero-lag 4K technology optimised for high-motion sports and live betting.</p>
            </motion.div>

            {/* Card 5 — Small: Fan Economy */}
            <motion.div className="bento-card bento-small"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.25 }}>
              <div className="bento-icon-wrap" style={{ background: 'rgba(255,184,0,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: '#ffb800', fontSize: 26 }}>token</span>
              </div>
              <h4 className="bento-feat-title">Fan Economy</h4>
              <p className="bento-sub">Unlock exclusive rewards and governance rights within your favourite sports orgs.</p>
            </motion.div>

            {/* Card 6 — Small: Predict Analytics */}
            <motion.div className="bento-card bento-small bento-accent"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.3 }}>
              <div className="bento-icon-wrap" style={{ background: 'rgba(255,107,107,0.08)' }}>
                <span className="material-symbols-outlined" style={{ color: '#ff6b6b', fontSize: 26 }}>query_stats</span>
              </div>
              <h4 className="bento-feat-title">Predict Analytics</h4>
              <p className="bento-sub">AI-driven insights and historical data to power your marketplace decisions.</p>
            </motion.div>
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

        /* ── BENTO GRID ── */
        .bento-section { background: #0A0A0A; padding: 80px 0; }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-auto-rows: auto;
          gap: 16px;
        }
        .bento-card {
          background: #111111;
          border-radius: 16px;
          padding: 28px;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s;
          overflow: hidden;
          position: relative;
        }
        .bento-card:hover { transform: scale(1.02); box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .bento-accent { background: #1A1A2E; border-color: rgba(0,219,233,0.1); }

        /* Sizes */
        .bento-large { grid-column: span 2; }
        .bento-tall  { grid-row: span 2; }
        .bento-small { grid-column: span 1; }

        /* Typography */
        .bento-tag { display: inline-block; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: rgba(37,99,235,0.25); border: 1px solid rgba(37,99,235,0.4); padding: 3px 10px; border-radius: 999px; margin-bottom: 14px; }
        .bento-title { font-family: var(--font-lexend); font-size: 22px; font-weight: 800; color: #fff; margin: 0 0 10px; line-height: 1.3; }
        .bento-sub { color: rgba(255,255,255,0.65); font-size: 13px; line-height: 1.65; margin: 0; }
        .bento-feat-title { font-family: var(--font-lexend); font-size: 16px; font-weight: 700; color: #fff; margin: 12px 0 6px; }
        .bento-icon-wrap { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        /* Stat card */
        .bento-icon-lg { font-size: 36px; color: var(--primary-dim); margin-bottom: 12px; display: block; }
        .bento-stat { font-family: var(--font-lexend); font-size: 72px; font-weight: 900; color: #fff; line-height: 1; letter-spacing: -3px; margin-bottom: 6px; }
        .bento-stat-label { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.75); }
        .bento-stat-chips { display: flex; gap: 8px; margin-top: auto; padding-top: 20px; flex-wrap: wrap; }
        .bento-chip-green { background: rgba(47,248,1,0.1); border: 1px solid rgba(47,248,1,0.2); color: var(--secondary-container); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; }

        /* Screenshot mock (Card 1) */
        .bento-screenshot { margin-top: 20px; background: #0a0a14; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
        .bento-screen-bar { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); }
        .bento-screen-bar span { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); }
        .bento-screen-bar span:first-child { background: #ff5f57; }
        .bento-screen-bar span:nth-child(2) { background: #ffbd2e; }
        .bento-screen-bar span:nth-child(3) { background: #28c840; }
        .bento-screen-body { padding: 16px; }
        .bento-player-mock { aspect-ratio: 16/6; background: rgba(37,99,235,0.04); border: 1px solid rgba(37,99,235,0.12); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 10px; }
        .bento-live-tag { position: absolute; bottom: 8px; left: 8px; background: rgba(229,9,20,0.85); color: #fff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 5px; letter-spacing: 0.05em; }
        .bento-screen-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .bento-screen-chip { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 600; }

        /* Responsive */
        @media (max-width: 900px) { .bento-grid { grid-template-columns: repeat(2, 1fr); } .bento-large { grid-column: span 2; } .bento-tall { grid-row: span 1; } }
        @media (max-width: 600px) { .bento-grid { grid-template-columns: 1fr; } .bento-large, .bento-tall, .bento-small { grid-column: span 1; grid-row: span 1; } .bento-stat { font-size: 56px; } }
      `}</style>
    </div>
  )
}
