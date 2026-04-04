import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";

const SERIES_META = {
  "Dragon Ball":       { accent: "#f59e0b", logo: "/animeLogoClassic.png" },
  "Dragon Ball Z":     { accent: "#e8662a", logo: "/animeLogoZ.png" },
  "Dragon Ball GT":    { accent: "#6366f1", logo: "/animeLogoGT.png" },
  "Dragon Ball Daima": { accent: "#a855f7", logo: "/animeLogoDaima.png" }
};

function groupBySaga(episodes) {
  const groups = [];
  let current = null;
  for (const ep of episodes) {
    const sagaName = ep.saga || "Other";
    if (!current || current.saga !== sagaName) {
      current = { saga: sagaName, episodes: [] };
      groups.push(current);
    }
    current.episodes.push(ep);
  }
  return groups;
}

function EpisodePlayer() {
  const { series, id } = useParams();
  const navigate       = useNavigate();
  const iframeRef      = useRef(null);
  const activeRef      = useRef(null);

  const decodedSeries = decodeURIComponent(series);
  const meta          = SERIES_META[decodedSeries] || { accent: "#e8662a" };
  const baseURL       = import.meta.env.VITE_BASE_URL;

  const [episode,     setEpisode]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [showSkip,    setShowSkip]    = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(90);

  // Fetch episode data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [epRes, allRes] = await Promise.all([
          fetch(`${baseURL}/api/episodes/${id}`),
          fetch(`${baseURL}/api/episodes/series/${encodeURIComponent(decodedSeries)}`)
        ]);
        const epData  = await epRes.json();
        const allData = await allRes.json();
        if (epData.success)  setEpisode(epData.episode);
        if (allData.success) setAllEpisodes(allData.episodes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, decodedSeries]);

  // Auto-scroll active ep into sidebar view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [id, allEpisodes]);

  // Skip intro: show button after 5s, countdown from 90s
  useEffect(() => {
    setShowSkip(false);
    setSkipCountdown(90);

    // Show skip button after 5s
    const showTimer = setTimeout(() => setShowSkip(true), 5000);

    // Countdown tick every second
    let count = 90;
    const tick = setInterval(() => {
      count -= 1;
      setSkipCountdown(count);
      if (count <= 0) {
        clearInterval(tick);
        setShowSkip(false);
      }
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(tick);
    };
  }, [id]);

  // Skip intro: reload iframe with t=90 param to seek past intro
  const handleSkipIntro = () => {
    setShowSkip(false);
    if (!iframeRef.current || !episode) return;
    // Append #t=90 or ?t=90 — works with most embed players
    const base = episode.episode_link.split("#")[0].split("?t=")[0];
    iframeRef.current.src = base + (base.includes("?") ? "&t=90" : "?t=90");
  };

  // Fullscreen the iframe element itself
  const handleFullscreen = () => {
    const el = iframeRef.current;
    if (!el) return;
    if      (el.requestFullscreen)       el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.mozRequestFullScreen)    el.mozRequestFullScreen();
    else if (el.msRequestFullscreen)     el.msRequestFullscreen();
  };

  if (loading)  return <Loading />;
  if (!episode) return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-lg">Episode not found.</p>
    </div>
  );

  const currentIdx = allEpisodes.findIndex((e) => e._id === id);
  const prevEp     = allEpisodes[currentIdx - 1];
  const nextEp     = allEpisodes[currentIdx + 1];
  const sagaGroups = groupBySaga(allEpisodes);

  return (
    <div className="relative min-h-screen pt-24 pb-24 overflow-hidden">
      <BlurCircle top="80px"     left="-80px"  />
      <BlurCircle bottom="100px" right="-50px" />

      {/* ── Top bar ── */}
      <div className="px-6 md:px-10 mb-5 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate(`/shows/${series}`)}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition text-sm group shrink-0"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${meta.accent}25`, color: meta.accent, border: `1px solid ${meta.accent}50` }}>
            EP {episode.episode_number}
          </span>
          {episode.saga     && <span className="text-xs text-gray-500">{episode.saga}</span>}
          {episode.duration && <span className="text-xs text-gray-500">· {episode.duration}</span>}
        </div>

        <h1 className="text-base md:text-lg font-bold truncate flex-1">{episode.title}</h1>
      </div>

      {/* ── Main layout ── */}
      <div className="flex gap-4 px-4 md:px-10 items-start">

        {/* ══ LEFT SIDEBAR ══ */}
        {allEpisodes.length > 0 && (
          <aside className="hidden md:flex flex-col w-48 shrink-0">
            <div className="overflow-y-auto scrollbar-thin flex flex-col gap-5 pr-1"
              style={{ maxHeight: "calc(100vh - 180px)" }}>
              {sagaGroups.map((group) => (
                <div key={group.saga}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2 truncate"
                    style={{ color: meta.accent }} title={group.saga}>
                    {group.saga}
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {group.episodes.map((ep) => {
                      const isActive = ep._id === id;
                      return (
                        <button
                          key={ep._id}
                          ref={isActive ? activeRef : null}
                          onClick={() => navigate(`/shows/${series}/episode/${ep._id}`)}
                          title={`EP ${ep.episode_number}: ${ep.title}`}
                          className="aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105"
                          style={isActive
                            ? { background: meta.accent, color: "#fff", boxShadow: `0 0 10px ${meta.accent}88` }
                            : { background: "rgba(255,255,255,0.07)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.06)" }
                          }
                        >
                          {ep.episode_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ══ PLAYER COLUMN ══ */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">

          {/* Player box */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-black w-full"
            style={{ maxWidth: "820px", aspectRatio: "16/9" }}>

            <iframe
              ref={iframeRef}
              key={id}
              src={episode.episode_link}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              scrolling="no"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              webkitallowfullscreen="true"
              mozallowfullscreen="true"
            />

            {/* Skip Intro button — inside player, bottom-right */}
            {showSkip && (
              <button
                onClick={handleSkipIntro}
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: "rgba(0,0,0,0.75)",
                  color: meta.accent,
                  border: `1.5px solid ${meta.accent}`,
                  backdropFilter: "blur(6px)"
                }}
              >
                Skip Intro
                {/* Countdown ring */}
                <span className="text-xs opacity-60">({skipCountdown}s)</span>
              </button>
            )}

            {/* Fullscreen button — inside player, top-right */}
            <button
              onClick={handleFullscreen}
              title="Fullscreen"
              className="absolute top-3 right-3 z-20 p-2 rounded-lg transition-all hover:scale-110"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* ── Prev / Next ── */}
          <div className="flex items-center justify-between gap-3" style={{ maxWidth: "820px" }}>

            {/* Prev */}
            {prevEp ? (
              <button
                onClick={() => navigate(`/shows/${series}/episode/${prevEp._id}`)}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl border border-gray-700 bg-white/5 hover:bg-white/10 hover:border-gray-500 transition-all text-sm font-medium text-gray-300 hover:text-white"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                <span className="hidden sm:block truncate max-w-[160px]">
                  EP {prevEp.episode_number}: {prevEp.title}
                </span>
                <span className="sm:hidden">Previous</span>
              </button>
            ) : <div />}

            {/* Next */}
            {nextEp ? (
              <button
                onClick={() => navigate(`/shows/${series}/episode/${nextEp._id}`)}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:brightness-110 hover:scale-[1.02] ml-auto"
                style={{ background: `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`, boxShadow: `0 4px 18px ${meta.accent}55` }}
              >
                <span className="hidden sm:block truncate max-w-[160px]">
                  EP {nextEp.episode_number}: {nextEp.title}
                </span>
                <span className="sm:hidden">Next</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            ) : <div />}
          </div>

          {/* Overview */}
          {episode.overview && (
            <p className="text-gray-400 text-sm leading-relaxed" style={{ maxWidth: "820px" }}>
              {episode.overview}
            </p>
          )}

          {/* ── Mobile saga-grouped grid ── */}
          {allEpisodes.length > 0 && (
            <div className="md:hidden mt-3 flex flex-col gap-5">
              {sagaGroups.map((group) => (
                <div key={group.saga}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: meta.accent }}>
                    {group.saga}
                  </p>
                  <div className="grid grid-cols-8 gap-1.5">
                    {group.episodes.map((ep) => {
                      const isActive = ep._id === id;
                      return (
                        <button
                          key={ep._id}
                          onClick={() => navigate(`/shows/${series}/episode/${ep._id}`)}
                          title={ep.title}
                          className="aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all"
                          style={isActive
                            ? { background: meta.accent, color: "#fff" }
                            : { background: "rgba(255,255,255,0.07)", color: "#9ca3af" }
                          }
                        >
                          {ep.episode_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EpisodePlayer;