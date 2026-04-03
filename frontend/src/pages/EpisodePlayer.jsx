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

// Group episodes by saga
function groupBySaga(episodes) {
  const groups = [];
  let current  = null;
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

  const playerContainerRef = useRef(null);
  const activeRef          = useRef(null);

  const decodedSeries = decodeURIComponent(series);
  const meta          = SERIES_META[decodedSeries] || { accent: "#e8662a" };
  const baseURL       = import.meta.env.VITE_BASE_URL;

  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allEpisodes, setAllEpisodes] = useState([]);

  const [playerLoading, setPlayerLoading] = useState(false);
  const [showSkip, setShowSkip] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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

  // Auto-scroll active episode
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [id, allEpisodes]);

  // Skip intro timer
  useEffect(() => {
    setShowSkip(true);

    const timer = setTimeout(() => {
      setShowSkip(false);
    }, 90000); // 1:30

    return () => clearTimeout(timer);
  }, [id]);

  const handleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  if (loading) return <Loading />;

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Episode not found.</p>
      </div>
    );
  }

  const currentIdx = allEpisodes.findIndex((e) => e._id === id);
  const prevEp     = allEpisodes[currentIdx - 1];
  const nextEp     = allEpisodes[currentIdx + 1];
  const sagaGroups = groupBySaga(allEpisodes);

  return (
    <div className="relative min-h-screen pt-24 pb-24 overflow-hidden">
      <BlurCircle top="80px" left="-80px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Top Bar */}
      <div className="px-6 md:px-10 mb-5 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => navigate(`/shows/${series}`)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm group"
        >
          ← Back
        </button>

        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: `${meta.accent}25`,
              color: meta.accent,
              border: `1px solid ${meta.accent}50`
            }}
          >
            EP {episode.episode_number}
          </span>

          {episode.saga && <span className="text-xs text-gray-500">{episode.saga}</span>}
          {episode.duration && <span className="text-xs text-gray-500">· {episode.duration}</span>}
        </div>

        <h1 className="text-base md:text-lg font-bold truncate flex-1">
          {episode.title}
        </h1>
      </div>

      <div className="flex gap-4 px-4 md:px-10 items-start">

        {/* Sidebar */}
        {allEpisodes.length > 0 && (
          <aside className="hidden md:flex flex-col w-48 shrink-0">
            <div className="overflow-y-auto flex flex-col gap-5 pr-1" style={{ maxHeight: "calc(100vh - 180px)" }}>
              {sagaGroups.map((group) => (
                <div key={group.saga}>
                  <p className="text-[10px] font-bold uppercase mb-2" style={{ color: meta.accent }}>
                    {group.saga}
                  </p>

                  <div className="grid grid-cols-4 gap-1.5">
                    {group.episodes.map((ep) => {
                      const isActive = ep._id === id;

                      return (
                        <button
                          key={ep._id}
                          ref={isActive ? activeRef : null}
                          onClick={() => {
                            setPlayerLoading(true);
                            navigate(`/shows/${series}/episode/${ep._id}`);
                          }}
                          className="aspect-square rounded-lg text-xs font-bold"
                          style={{
                            background: isActive ? meta.accent : "rgba(255,255,255,0.07)",
                            color: isActive ? "#fff" : "#9ca3af"
                          }}
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

        {/* Player */}
        <div className="flex-1 flex flex-col gap-4">

          <div
            ref={playerContainerRef}
            className="relative rounded-2xl overflow-hidden border border-gray-800 bg-black w-full"
            style={{ maxWidth: "820px", aspectRatio: "16/9" }}
          >
            {/* Loading Overlay */}
            {playerLoading && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                <Loading />
              </div>
            )}

            {/* Skip Intro */}
            {showSkip && (
              <button
                onClick={() => {
                  setShowSkip(false);
                }}
                className="absolute bottom-4 right-4 z-20 px-4 py-2 rounded-lg text-sm font-semibold bg-black/70"
                style={{ color: meta.accent, border: `1px solid ${meta.accent}` }}
              >
                Skip Intro
              </button>
            )}

            <iframe
              key={episode._id}
              src={episode.episode_link}
              className="absolute inset-0 w-full h-full"
              onLoad={() => setPlayerLoading(false)}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3" style={{ maxWidth: "820px" }}>
            {prevEp && (
              <button
                onClick={() => {
                  setPlayerLoading(true);
                  navigate(`/shows/${series}/episode/${prevEp._id}`);
                }}
              >
                ← Prev
              </button>
            )}

            <button onClick={handleFullscreen}>Fullscreen</button>

            {nextEp && (
              <button
                onClick={() => {
                  setPlayerLoading(true);
                  navigate(`/shows/${series}/episode/${nextEp._id}`);
                }}
                style={{ marginLeft: "auto", color: meta.accent }}
              >
                Next →
              </button>
            )}
          </div>

          {/* Overview */}
          {episode.overview && (
            <p className="text-gray-400 text-sm" style={{ maxWidth: "820px" }}>
              {episode.overview}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EpisodePlayer;