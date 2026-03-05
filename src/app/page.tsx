"use client"

import { useState } from "react"
import axios from "axios"

export default function Home() {
  const [movieId, setMovieId] = useState("")
  const [data, setData] = useState<any>(null)
  const [insight, setInsight] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [focused, setFocused] = useState(false)

  const handleSearch = async () => {
    if (!movieId.trim()) return
    setLoading(true)
    setError("")
    setData(null)
    setInsight(null)
    try {
      const res = await axios.post("/api/movie", { imdbId: movieId })
      setData(res.data.movie)
      setInsight(res.data.aiInsight)
    } catch (err) {
      setError("Could not find that movie. Check the IMDb ID and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const sentimentColor = (s: string) => {
    if (!s) return "#a0a0a0"
    const lower = s.toLowerCase()
    if (lower.includes("positive")) return "#4ade80"
    if (lower.includes("negative")) return "#f87171"
    return "#fbbf24"
  }

  const sentimentBg = (s: string) => {
    if (!s) return "rgba(160,160,160,0.1)"
    const lower = s.toLowerCase()
    if (lower.includes("positive")) return "rgba(74,222,128,0.08)"
    if (lower.includes("negative")) return "rgba(248,113,113,0.08)"
    return "rgba(251,191,36,0.08)"
  }

  const sentimentIcon = (s: string) => {
    if (!s) return "◐"
    const lower = s.toLowerCase()
    if (lower.includes("positive")) return "▲"
    if (lower.includes("negative")) return "▼"
    return "◆"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Courier+Prime:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #080a0f;
          --surface: #0f1219;
          --border: rgba(255,255,255,0.07);
          --border-active: rgba(255,255,255,0.18);
          --text: #e8e6e0;
          --muted: #6b6b72;
          --accent: #d4a843;
          --accent-dim: rgba(212,168,67,0.15);
          --red: #c0392b;
        }

        html, body { height: 100%; background: var(--bg); color: var(--text); }

        .grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .scanlines {
          position: fixed; inset: 0; pointer-events: none; z-index: 9998;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
        }

        .app {
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* HERO SECTION */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,168,67,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(192,57,43,0.06) 0%, transparent 50%),
            linear-gradient(180deg, #080a0f 0%, #0a0c14 100%);
        }

        .corner-deco {
          position: absolute;
          width: 120px; height: 120px;
          border-color: var(--accent);
          border-style: solid;
          opacity: 0.3;
        }
        .corner-deco.tl { top: 32px; left: 32px; border-width: 1px 0 0 1px; }
        .corner-deco.tr { top: 32px; right: 32px; border-width: 1px 1px 0 0; }
        .corner-deco.bl { bottom: 32px; left: 32px; border-width: 0 0 1px 1px; }
        .corner-deco.br { bottom: 32px; right: 32px; border-width: 0 1px 1px 0; }

        .film-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 6px;
          background: repeating-linear-gradient(
            90deg,
            var(--accent) 0px,
            var(--accent) 12px,
            transparent 12px,
            transparent 20px
          );
          opacity: 0.4;
        }
        .film-strip.bottom { top: auto; bottom: 0; }

        .eyebrow {
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--accent);
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        .eyebrow::before, .eyebrow::after {
          content: '—';
          margin: 0 0.75rem;
          opacity: 0.5;
        }

        .title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(4rem, 12vw, 9rem);
          line-height: 0.9;
          letter-spacing: 0.02em;
          text-align: center;
          color: var(--text);
          position: relative;
          z-index: 1;
          margin-bottom: 1.5rem;
        }
        .title span {
          color: var(--accent);
          display: block;
        }

        .subtitle {
          font-size: 0.95rem;
          color: var(--muted);
          font-weight: 300;
          letter-spacing: 0.05em;
          margin-bottom: 3rem;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        /* SEARCH */
        .search-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 520px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-box.focused {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(212,168,67,0.08), 0 0 30px rgba(212,168,67,0.06);
        }

        .id-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--accent);
          padding: 0 1rem;
          border-right: 1px solid var(--border);
          white-space: nowrap;
          user-select: none;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          padding: 1rem 1.2rem;
          color: var(--text);
          font-family: 'Courier Prime', monospace;
          font-size: 1rem;
          letter-spacing: 0.08em;
        }
        .search-input::placeholder { color: var(--muted); opacity: 0.6; }

        .search-btn {
          background: var(--accent);
          border: none;
          color: #080a0f;
          padding: 0 1.5rem;
          cursor: pointer;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          height: 100%;
          min-height: 52px;
          transition: background 0.15s, transform 0.1s;
          white-space: nowrap;
        }
        .search-btn:hover { background: #e8b84e; }
        .search-btn:active { transform: scale(0.97); }
        .search-btn:disabled { background: var(--muted); cursor: not-allowed; }

        .hint {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.75rem;
          color: var(--muted);
          font-family: 'Courier Prime', monospace;
          letter-spacing: 0.05em;
        }
        .hint span { color: rgba(212,168,67,0.6); }

        .error-msg {
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #f87171;
          font-family: 'Courier Prime', monospace;
          text-align: center;
          letter-spacing: 0.05em;
        }

        /* LOADER */
        .loader-wrap {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        .loader-frames {
          display: flex;
          gap: 6px;
          align-items: flex-end;
        }
        .loader-frame {
          width: 3px;
          background: var(--accent);
          border-radius: 1px;
          animation: frameAnim 0.8s ease-in-out infinite alternate;
        }
        .loader-frame:nth-child(1) { height: 16px; animation-delay: 0s; }
        .loader-frame:nth-child(2) { height: 28px; animation-delay: 0.1s; }
        .loader-frame:nth-child(3) { height: 20px; animation-delay: 0.2s; }
        .loader-frame:nth-child(4) { height: 32px; animation-delay: 0.3s; }
        .loader-frame:nth-child(5) { height: 24px; animation-delay: 0.4s; }
        .loader-frame:nth-child(6) { height: 28px; animation-delay: 0.5s; }
        .loader-frame:nth-child(7) { height: 16px; animation-delay: 0.6s; }
        @keyframes frameAnim {
          from { opacity: 0.2; transform: scaleY(0.6); }
          to { opacity: 1; transform: scaleY(1); }
        }
        .loader-text {
          font-family: 'Courier Prime', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          text-transform: uppercase;
          animation: blink 1.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        /* RESULTS */
        .results {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
          animation: fadeUp 0.5s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .divider-line { flex: 1; height: 1px; background: var(--border); }
        .divider-text {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* MOVIE CARD */
        .movie-card {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 2px;
        }

        .poster-wrap {
          position: relative;
          overflow: hidden;
          aspect-ratio: 2/3;
          min-height: 360px;
        }
        .poster-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          filter: contrast(1.05) saturate(0.9);
          transition: transform 0.4s ease;
        }
        .movie-card:hover .poster-wrap img { transform: scale(1.03); }

        .poster-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 70%, var(--surface) 100%);
        }

        .rating-badge {
          position: absolute;
          top: 12px; left: 12px;
          background: rgba(8,10,15,0.85);
          border: 1px solid var(--accent);
          padding: 4px 10px;
          font-family: 'Courier Prime', monospace;
          font-size: 0.75rem;
          color: var(--accent);
          letter-spacing: 0.1em;
          backdrop-filter: blur(4px);
        }

        .movie-info {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .movie-title-area { margin-bottom: 1.5rem; }

        .movie-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          line-height: 0.95;
          letter-spacing: 0.02em;
          margin-bottom: 0.5rem;
        }

        .movie-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .meta-pill {
          font-family: 'Courier Prime', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 3px 10px;
          border-radius: 1px;
        }
        .meta-pill.gold { color: var(--accent); border-color: rgba(212,168,67,0.3); }

        .section-label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          color: var(--muted);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
          max-width: 40px;
        }

        .plot-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: rgba(232,230,224,0.75);
          font-weight: 300;
          font-style: italic;
          margin-bottom: 2rem;
          border-left: 2px solid var(--accent);
          padding-left: 1rem;
        }

        .cast-section { margin-top: auto; }

        .cast-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 0.5rem;
        }
        .cast-tag {
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          padding: 4px 12px;
          font-size: 0.8rem;
          color: var(--text);
          border-radius: 1px;
          transition: border-color 0.15s, color 0.15s;
        }
        .cast-tag:hover { border-color: var(--accent); color: var(--accent); }

        /* INSIGHT CARD */
        .insight-grid {
          display: grid;
          grid-template-columns: 1fr 280px;
          gap: 2px;
          margin-bottom: 2px;
        }

        .insight-card, .sentiment-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 2rem;
        }

        .insight-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.6rem;
          letter-spacing: 0.06em;
          color: var(--text);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .insight-title::before {
          content: '';
          display: block;
          width: 4px;
          height: 1.4em;
          background: var(--accent);
          flex-shrink: 0;
        }

        .summary-text {
          font-size: 0.9rem;
          line-height: 1.75;
          color: rgba(232,230,224,0.8);
          font-weight: 300;
        }

        /* THEMES */
        .themes-wrap {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 1.75rem 2rem;
        }

        .themes-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 0.75rem;
        }

        .theme-chip {
          font-size: 0.8rem;
          font-family: 'Courier Prime', monospace;
          letter-spacing: 0.05em;
          padding: 6px 14px;
          background: var(--accent-dim);
          border: 1px solid rgba(212,168,67,0.25);
          color: var(--accent);
          border-radius: 1px;
          transition: background 0.15s;
        }
        .theme-chip:hover { background: rgba(212,168,67,0.2); }
        .theme-chip::before { content: '# '; opacity: 0.5; }

        /* SENTIMENT CARD */
        .sentiment-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          min-height: 160px;
        }

        .sentiment-icon-wrap {
          font-size: 2rem;
          margin-bottom: 0.75rem;
          transition: transform 0.2s;
        }

        .sentiment-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem;
          letter-spacing: 0.08em;
          margin-bottom: 0.5rem;
        }

        .sentiment-sublabel {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .sentiment-bar-wrap {
          width: 100%;
          margin-top: 1.5rem;
        }
        .sentiment-bar-track {
          height: 3px;
          background: rgba(255,255,255,0.07);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .sentiment-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 1s ease;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .corner-deco { display: none; }
          .movie-card { grid-template-columns: 1fr; }
          .poster-wrap { min-height: 240px; aspect-ratio: 16/9; }
          .poster-overlay { background: linear-gradient(180deg, transparent 60%, var(--surface) 100%); }
          .insight-grid { grid-template-columns: 1fr; }
          .title { font-size: clamp(3.5rem, 15vw, 5rem); }
          .movie-info { padding: 1.5rem; }
        }
      `}</style>

      <div className="grain" />
      <div className="scanlines" />

      <div className="app">
        <section className="hero">
          <div className="hero-bg" />
          <div className="film-strip" />
          <div className="film-strip bottom" />
          <div className="corner-deco tl" />
          <div className="corner-deco tr" />
          <div className="corner-deco bl" />
          <div className="corner-deco br" />

          <div className="eyebrow">Powered by AI</div>

          <h1 className="title">
            Cinema<span>Lens</span>
          </h1>

          <p className="subtitle">
            Enter any IMDb ID — receive deep audience intelligence, instantly.
          </p>

          <div className="search-wrap">
            <div className={`search-box ${focused ? "focused" : ""}`}>
              <div className="id-label">IMDb ID</div>
              <input
                className="search-input"
                value={movieId}
                onChange={(e) => setMovieId(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="tt0133093"
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={loading || !movieId.trim()}
              >
                {loading ? "..." : "Analyze"}
              </button>
            </div>
            <div className="hint">
              Try <span>tt0111161</span> · <span>tt0468569</span> · <span>tt1375666</span>
            </div>
            {error && <div className="error-msg">⚠ {error}</div>}
          </div>

          {loading && (
            <div className="loader-wrap">
              <div className="loader-frames">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="loader-frame" />
                ))}
              </div>
              <div className="loader-text">Pulling cinematic data</div>
            </div>
          )}
        </section>

        {data && (
          <section className="results">
            <div className="divider">
              <div className="divider-line" />
              <div className="divider-text">Movie Intelligence Report</div>
              <div className="divider-line" />
            </div>

            {/* MOVIE CARD */}
            <div className="movie-card">
              <div className="poster-wrap">
                {data.Poster && data.Poster !== "N/A" ? (
                  <img src={data.Poster} alt={data.Title} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, #0f1219 0%, #1a1c24 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "3rem", color: "var(--border)"
                  }}>
                    🎬
                  </div>
                )}
                <div className="poster-overlay" />
                {data.imdbRating && data.imdbRating !== "N/A" && (
                  <div className="rating-badge">★ {data.imdbRating}</div>
                )}
              </div>

              <div className="movie-info">
                <div className="movie-title-area">
                  <h2 className="movie-title">{data.Title}</h2>
                  <div className="movie-meta">
                    {data.Year && <span className="meta-pill gold">{data.Year}</span>}
                    {data.Rated && data.Rated !== "N/A" && <span className="meta-pill">{data.Rated}</span>}
                    {data.Runtime && data.Runtime !== "N/A" && <span className="meta-pill">{data.Runtime}</span>}
                    {data.Genre && data.Genre !== "N/A" && data.Genre.split(",").slice(0, 2).map((g: string) => (
                      <span key={g} className="meta-pill">{g.trim()}</span>
                    ))}
                  </div>
                </div>

                {data.Plot && data.Plot !== "N/A" && (
                  <div>
                    <div className="section-label">Plot</div>
                    <p className="plot-text">{data.Plot}</p>
                  </div>
                )}

                {data.Actors && data.Actors !== "N/A" && (
                  <div className="cast-section">
                    <div className="section-label">Cast</div>
                    <div className="cast-list">
                      {data.Actors.split(",").map((a: string) => (
                        <span key={a} className="cast-tag">{a.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {data.Director && data.Director !== "N/A" && (
                  <div style={{ marginTop: "1rem" }}>
                    <div className="section-label">Director</div>
                    <span style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 300 }}>
                      {data.Director}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* AI INSIGHT */}
            {insight && (
              <>
                <div className="insight-grid" style={{ marginTop: "2px" }}>
                  <div className="insight-card">
                    <div className="insight-title">Audience Intelligence</div>
                    {insight.summary && (
                      <p className="summary-text">{insight.summary}</p>
                    )}
                  </div>

                  <div className="sentiment-card">
                    <div className="section-label" style={{ marginBottom: "1rem" }}>Audience Sentiment</div>
                    <div className="sentiment-display">
                      <div className="sentiment-icon-wrap" style={{ color: sentimentColor(insight.sentiment) }}>
                        {sentimentIcon(insight.sentiment)}
                      </div>
                      <div
                        className="sentiment-label"
                        style={{ color: sentimentColor(insight.sentiment) }}
                      >
                        {insight.sentiment || "Mixed"}
                      </div>
                      <div className="sentiment-sublabel">Overall Classification</div>

                      <div className="sentiment-bar-wrap">
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: "0.65rem", fontFamily: "Courier Prime, monospace", color: "var(--muted)", letterSpacing: "0.1em" }}>Signal</span>
                          <span style={{ fontSize: "0.65rem", fontFamily: "Courier Prime, monospace", color: sentimentColor(insight.sentiment) }}>
                            {insight.sentiment?.toLowerCase().includes("positive") ? "HIGH" :
                              insight.sentiment?.toLowerCase().includes("negative") ? "LOW" : "MID"}
                          </span>
                        </div>
                        <div className="sentiment-bar-track">
                          <div
                            className="sentiment-bar-fill"
                            style={{
                              background: sentimentColor(insight.sentiment),
                              width: insight.sentiment?.toLowerCase().includes("positive") ? "82%" :
                                insight.sentiment?.toLowerCase().includes("negative") ? "28%" : "55%"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {insight.themes && insight.themes.length > 0 && (
                  <div className="themes-wrap" style={{ marginTop: "2px" }}>
                    <div className="section-label">Key Themes</div>
                    <div className="themes-grid">
                      {insight.themes.map((theme: string, i: number) => (
                        <span key={i} className="theme-chip">{theme}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </>
  )
}