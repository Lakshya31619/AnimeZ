import React from "react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";

const SERIES = [
  {
    id: "Dragon Ball",
    label: "Dragon Ball",
    logo: "/animeLogoClassic.png",
    year: "1986",
    episodes: "153 Episodes",
    description:
      "Follow young Goku's journey as he searches for the seven Dragon Balls and encounters friends and foes across the world.",
    gradient: "from-yellow-900/40 to-orange-900/20",
    accent: "#f59e0b",
    border: "border-yellow-600/30"
  },
  {
    id: "Dragon Ball Z",
    label: "Dragon Ball Z",
    logo: "/animeLogoZ.png",
    year: "1989",
    episodes: "291 Episodes",
    description:
      "Goku and his friends defend Earth from increasingly powerful extraterrestrial villains and discover his Saiyan heritage.",
    gradient: "from-orange-900/40 to-red-900/20",
    accent: "#e8662a",
    border: "border-orange-600/30"
  },
  {
    id: "Dragon Ball GT",
    label: "Dragon Ball GT",
    logo: "/animeLogoGT.png",
    year: "1996",
    episodes: "64 Episodes",
    description:
      "Goku is turned back into a child by a wish on the Black Star Dragon Balls and must travel the universe to recover them.",
    gradient: "from-blue-900/40 to-indigo-900/20",
    accent: "#6366f1",
    border: "border-blue-600/30"
  },
  {
    id: "Dragon Ball Daima",
    label: "Dragon Ball Daima",
    logo: "/animeLogoDaima.png",
    year: "2024",
    episodes: "20 Episodes",
    description:
      "A new chapter begins as Goku and his friends are mysteriously turned small and must unravel the secrets behind the transformation.",
    gradient: "from-purple-900/40 to-fuchsia-900/20",
    accent: "#a855f7",
    border: "border-purple-600/30"
  }
];

function Shows() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen px-6 md:px-16 lg:px-40 xl:px-44 pt-36 pb-24 overflow-hidden">
      <BlurCircle top="100px" left="-100px" />
      <BlurCircle bottom="100px" right="-50px" />

      {/* Header */}
      <div className="mb-14">
        <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">
          Full Series
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Watch All Episodes
        </h1>
        <p className="text-gray-400 mt-3 max-w-xl text-sm leading-relaxed">
          Stream every episode from every Dragon Ball series — in one place.
          Pick a series to begin watching.
        </p>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERIES.map((series) => (
          <div
            key={series.id}
            onClick={() =>
              navigate(`/shows/${encodeURIComponent(series.id)}`)
            }
            className={`group relative cursor-pointer rounded-2xl border ${series.border} bg-gradient-to-br ${series.gradient} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
          >
            {/* Glow on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl"
              style={{ background: series.accent }}
            />

            <div className="relative p-6 flex flex-col gap-4">
              {/* Logo */}
              <img
                src={series.logo}
                alt={series.label}
                className="h-12 object-contain object-left"
              />

              {/* Info */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${series.accent}22`,
                      color: series.accent,
                      border: `1px solid ${series.accent}55`
                    }}
                  >
                    {series.year}
                  </span>
                  <span className="text-xs text-gray-400">
                    {series.episodes}
                  </span>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {series.description}
                </p>
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 mt-2 group-hover:gap-3 transition-all">
                <span
                  className="text-sm font-semibold"
                  style={{ color: series.accent }}
                >
                  Watch Now
                </span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  style={{ color: series.accent }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shows;
