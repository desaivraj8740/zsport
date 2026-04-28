import { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './index.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [status, setStatus] = useState('Scraping SportShield Content...');
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const backendIp = window.location.hostname;

  // Fetch all videos from SportShield
  useEffect(() => {
    fetch(`/api/videos`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setVideos(data.data || []);
          setStatus('Catalogue Synchronized.');
        } else {
          setErrorMsg('Failed to fetch catalogue.');
        }
      })
      .catch(err => setErrorMsg(`Scrape Failed: ${err.message}`));
  }, []);

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setErrorMsg('');
    const fullUrl = video.url;
    setVideoUrl(fullUrl);
    setStatus(`Loading Stream: ${video.title}`);
    
    // Scroll to player
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Attach HLS
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({ debug: false });
      hlsRef.current = hls;
      hls.loadSource(videoUrl);
      hls.attachMedia(v);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
         v.play().catch(e => console.log('Autoplay blocked'));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
           setErrorMsg(`DECRYPTION FAILURE: ${data.type}`);
           setStatus("DRM Lockdown Detected.");
           hls.destroy();
        }
      });
    } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = videoUrl;
    }
  }, [videoUrl]);

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(search.toLowerCase()) || 
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pirate-app">
      {/* Navbar */}
      <nav className="pirate-nav glass-nav">
        <div className="brand">
          <span className="logo-icon material-symbols-outlined">movie_filter</span>
          <span className="brand-text">PirateFlix <span className="premium-badge">PREMIUM</span></span>
        </div>
        <div className="nav-links">
          <span>Movies</span>
          <span className="active">Sports</span>
          <span>TV Shows</span>
        </div>
        <div className="nav-profile">
           <img src="https://i.pravatar.cc/100?img=11" alt="User" className="avatar"/>
        </div>
      </nav>

      {/* Hero / Player Section */}
      <div className="hero-section" style={{ paddingBottom: selectedVideo ? 20 : 80 }}>
        <div className="hero-content">
          <h1>{selectedVideo ? selectedVideo.title : 'EXCLUSIVE LIVE FEEDS'}</h1>
          <p>{selectedVideo ? selectedVideo.description : 'Select a stream from the catalogue below to begin intercepting the SportShield broadcast.'}</p>
          <div className="status-badge" style={{ borderColor: errorMsg ? '#ff4444' : '#0bd1ff', color: errorMsg ? '#ff4444' : '#0bd1ff' }}>
             {errorMsg ? '⚠️ SECURITY ALERT' : (videoUrl ? '⚡ INTERCEPTING STREAM' : '📡 READY TO SCRAPE')}
          </div>
        </div>
      </div>

      {videoUrl && (
        <div className="player-container">
          <div style={{ marginBottom: '15px' }}>
            <button 
              className="btn-ghost" 
              style={{
                padding: '10px 20px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer', 
                background: 'rgba(255, 255, 255, 0.1)', 
                color: '#fff', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                borderRadius: '8px', 
                fontWeight: 'bold',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.transform = 'translateY(0)' }}
              onClick={() => {
                setSelectedVideo(null);
                setVideoUrl(null);
                setErrorMsg('');
                setStatus('Catalogue Synchronized.');
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Catalogue
            </button>
          </div>
          {errorMsg ? (
            <div className="error-glass">
              <span className="material-symbols-outlined error-icon">lock_clock</span>
              <h3>DRM PROTECTION TRIGGERED</h3>
              <p>The host server has dynamically rotated the AES encryption keys or restricted your origin.</p>
              <div className="error-meta">{errorMsg}</div>
            </div>
          ) : (
            <div className="video-wrapper">
              <video ref={videoRef} controls className="premium-video" autoPlay />
              <div className="live-badge">DECRYPTING</div>
            </div>
          )}
        </div>
      )}

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-glass">
          <span className="material-symbols-outlined">search</span>
          <input 
            type="text" 
            placeholder="Search intercepted streams (e.g. Football, Documentary)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <h2 className="section-title">Intercepted Catalogue ({filteredVideos.length})</h2>
      <div className="content-grid">
        {filteredVideos.map(v => (
          <div 
            key={v.id} 
            className={`content-card ${selectedVideo?.id === v.id ? 'active-card' : ''}`}
            onClick={() => selectVideo(v)}
          >
            <div className="card-thumb">
              <img src={v.thumbnail_url} alt={v.title} />
              <div className="card-badge">{v.quality}</div>
            </div>
            <div className="card-info">
              <h3>{v.title}</h3>
              <div className="meta">{v.category} • {v.uploader_name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
