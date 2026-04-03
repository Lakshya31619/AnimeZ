import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";

const SERIES_META = {
  "Dragon Ball": {
    logo: "/animeLogoClassic.png",
    accent: "#f59e0b",
    bg: "from-yellow-900/20 to-transparent"
  },
  "Dragon Ball Z": {
    logo: "/animeLogoZ.png",
    accent: "#e8662a",
    bg: "from-orange-900/20 to-transparent"
  },
  "Dragon Ball GT": {
    logo: "/animeLogoGT.png",
    accent: "#6366f1",
    bg: "from-blue-900/20 to-transparent"
  },
  "Dragon Ball Daima": {
    logo: "/animeLogoDaima.png",
    accent: "#a855f7",
    bg: "from-purple-900/20 to-transparent"
  }
};

function SeriesEpisodes() {
  const { series } = useParams();
  const navigate = useNavigate();
  const decodedSeries = decodeURIComponent(series);
  const meta = SERIES_META[decodedSeries] || {};
  const baseURL = import.meta.env.VITE_BASE_URL;

  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSaga, setActiveSaga] = useState("All");
  const [sagas, setSagas] = useState([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const res = await fetch(
          `${baseURL}/api/episodes/series/${encodeURIComponent(decodedSeries)}`
        );
        const data = await res.json();
        if (data.success) {
          setEpisodes(data.episodes);
          const sagaSet = [
            "All",
            ...new Set(
              data.episodes
                .map((e) => e.saga)
                .filter(Boolean)
            )
          ];
          setSagas(sagaSet);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [decodedSeries]);

  const filtered =
    activeSaga === "All"
      ? episodes
      : episodes.filter((e) => e.saga === activeSaga);

  if (loading) return <Loading />;

  return (
    <div className="relative min-h-screen px-6 md:px-16 lg:px-40 xl:px-44 pt-32 pb-24 overflow-hidden">
      <BlurCircle top="80px" left="-80px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Back */}
      <button
        onClick={() => navigate("/shows")}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm mb-8 group"
      >
        <svg
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        All Series
      </button>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-10">
        {meta.logo && (
          <img src={meta.logo} alt={decodedSeries} className="h-12 object-contain object-left" />
        )}
        <p className="text-gray-400 text-sm">
          {episodes.length} episode{episodes.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Saga Filter */}
      {sagas.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {sagas.map((saga) => (
            <button
              key={saga}
              onClick={() => setActiveSaga(saga)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
                activeSaga === saga
                  ? "text-white border-transparent"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
              }`}
              style={
                activeSaga === saga
                  ? { background: meta.accent, borderColor: meta.accent }
                  : {}
              }
            >
              {saga}
            </button>
          ))}
        </div>
      )}

      {/* Episode Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-gray-400 text-lg">No episodes found.</p>
          <p className="text-gray-600 text-sm mt-2">
            Episodes will appear here once added by the admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((episode) => (
            <EpisodeCard
              key={episode._id}
              episode={episode}
              accent={meta.accent}
              onClick={() =>
                navigate(`/shows/${series}/episode/${episode._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EpisodeCard({ episode, accent, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 bg-white/5 hover:bg-white/8 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        {episode.thumbnail ? (
          <img
            src={episode.thumbnail}
            alt={episode.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: accent }}
          >
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Ep number badge */}
        <span
          className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: accent + "dd", color: "#fff" }}
        >
          EP {episode.episode_number}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold line-clamp-2 leading-snug mb-1">
          {episode.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {episode.saga && <span>{episode.saga}</span>}
          {episode.saga && episode.duration && <span>·</span>}
          {episode.duration && <span>{episode.duration}</span>}
        </div>
      </div>
    </div>
  );
}

export default SeriesEpisodes;
