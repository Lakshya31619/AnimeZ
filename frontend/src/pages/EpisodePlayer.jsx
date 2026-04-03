import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";

const SERIES_META = {
  "Dragon Ball": { accent: "#f59e0b", logo: "/animeLogoClassic.png" },
  "Dragon Ball Z": { accent: "#e8662a", logo: "/animeLogoZ.png" },
  "Dragon Ball GT": { accent: "#6366f1", logo: "/animeLogoGT.png" },
  "Dragon Ball Daima": { accent: "#a855f7", logo: "/animeLogoDaima.png" }
};

function EpisodePlayer() {
  const { series, id } = useParams();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const decodedSeries = decodeURIComponent(series);
  const meta = SERIES_META[decodedSeries] || { accent: "#e8662a" };
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allEpisodes, setAllEpisodes] = useState([]);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const [epRes, allRes] = await Promise.all([
          fetch(`${baseURL}/api/episodes/${id}`),
          fetch(`${baseURL}/api/episodes/series/${encodeURIComponent(decodedSeries)}`)
        ]);
        const epData = await epRes.json();
        const allData = await allRes.json();

        if (epData.success) setEpisode(epData.episode);
        if (allData.success) setAllEpisodes(allData.episodes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisode();
  }, [id, decodedSeries]);

  useEffect(() => {
    if (episode) {
      setTimeout(() => {
        playerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [episode]);

  if (loading) return <Loading />;
  if (!episode)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-lg">Episode not found.</p>
      </div>
    );

  const currentIdx = allEpisodes.findIndex((e) => e._id === id);
  const prevEp = allEpisodes[currentIdx - 1];
  const nextEp = allEpisodes[currentIdx + 1];

  return (
    <div className="relative min-h-screen px-6 md:px-16 lg:px-40 xl:px-44 pt-32 pb-24 overflow-hidden">
      <BlurCircle top="80px" left="-80px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Back */}
      <button
        onClick={() => navigate(`/shows/${series}`)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-8 group"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Episodes
      </button>

      {/* Episode Info */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: `${meta.accent}22`,
              color: meta.accent,
              border: `1px solid ${meta.accent}44`
            }}
          >
            Episode {episode.episode_number}
          </span>
          {episode.saga && (
            <span className="text-xs text-gray-500">{episode.saga}</span>
          )}
          {episode.duration && (
            <span className="text-xs text-gray-500">· {episode.duration}</span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">{episode.title}</h1>

        {episode.overview && (
          <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
            {episode.overview}
          </p>
        )}
      </div>

      {/* Player */}
      <div ref={playerRef} className="max-w-5xl mx-auto">
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <iframe
            width="100%"
            height="520"
            src={episode.episode_link}
            frameBorder="0"
            allowFullScreen
            className="w-full"
            allow="autoplay; fullscreen"
          />
        </div>
      </div>

      {/* Prev / Next Navigation */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mt-8 gap-4">
        {prevEp ? (
          <button
            onClick={() => navigate(`/shows/${series}/episode/${prevEp._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-gray-800 hover:border-gray-600 hover:bg-white/10 transition group text-sm"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline text-gray-300">
              EP {prevEp.episode_number}: {prevEp.title}
            </span>
            <span className="sm:hidden text-gray-300">Previous</span>
          </button>
        ) : (
          <div />
        )}

        {nextEp && (
          <button
            onClick={() => navigate(`/shows/${series}/episode/${nextEp._id}`)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm transition group"
            style={{ background: meta.accent }}
          >
            <span className="hidden sm:inline">
              EP {nextEp.episode_number}: {nextEp.title}
            </span>
            <span className="sm:hidden">Next</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Episode List Sidebar */}
      {allEpisodes.length > 0 && (
        <div className="max-w-5xl mx-auto mt-12">
          <h2 className="text-lg font-semibold mb-4">More Episodes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-2">
            {allEpisodes.map((ep) => (
              <button
                key={ep._id}
                onClick={() => navigate(`/shows/${series}/episode/${ep._id}`)}
                className={`text-left flex items-center gap-3 p-3 rounded-xl border transition ${
                  ep._id === id
                    ? "border-transparent text-white"
                    : "border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white bg-white/3 hover:bg-white/7"
                }`}
                style={ep._id === id ? { background: `${meta.accent}22`, borderColor: meta.accent } : {}}
              >
                <span
                  className="text-xs font-bold shrink-0 w-8 text-center"
                  style={{ color: ep._id === id ? meta.accent : "#6b7280" }}
                >
                  {ep.episode_number}
                </span>
                <span className="text-sm line-clamp-2 leading-snug">{ep.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EpisodePlayer;
