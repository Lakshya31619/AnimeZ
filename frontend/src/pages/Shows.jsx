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
    id: "Dragon Ball Super",
    label: "Dragon Ball Super",
    logo: "/animeLogoSuper.png",
    year: "2015",
    episodes: "131 Episodes",
    description:
      "Goku and his friends push beyond their limits as gods, universes, and powerful new rivals emerge.",
    gradient: "from-green-900/40 to-green-900/20",
    accent: "#0e840c",
    border: "border-green-600/30"
  },
  {
    id: "Dragon Ball Daima",
    label: "Dragon Ball Daima",
    logo: "/animeLogoDaima.png",
    year: "2024",
    episodes: "20 Episodes",
    description:
      "A new chapter begins as Goku and his friends are mysteriously turned small and must uncover the truth behind the transformation.",
    gradient: "from-purple-900/40 to-fuchsia-900/20",
    accent: "#a855f7",
    border: "border-purple-600/30"
  }
];

function Shows() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen px-6 md:px-16 lg:px-24 xl:px-32 pt-36 pb-24 overflow-hidden">
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {SERIES.map((series) => (
          <div
            key={series.id}
            onClick={() =>
              navigate(`/shows/${encodeURIComponent(series.id)}`)
            }
            className={`group relative h-[480px] cursor-pointer rounded-3xl overflow-hidden border ${series.border}
            bg-gradient-to-b ${series.gradient}
            hover:-translate-y-2 transition-all duration-300`}
          >
            {/* Hover Glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ background: series.accent }}
            />

            {/* Logo */}
            <div className="relative h-36 flex items-center justify-center px-6">
              <div
                className="absolute w-36 h-36 rounded-full blur-3xl opacity-20"
                style={{ background: series.accent }}
              />

              <img
                src={series.logo}
                alt={series.label}
                className="relative max-h-20 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col h-[calc(100%-144px)] p-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-5">
                <span
                  className="text-xs px-3 py-1 rounded-full font-medium"
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

              <h2 className="text-2xl font-semibold mb-4">
                {series.label}
              </h2>

              <p className="text-gray-400 text-sm leading-8 line-clamp-4">
                {series.description}
              </p>

              <button
                className="mt-auto w-full py-3 rounded-xl font-semibold transition-all duration-300"
                style={{
                  background: `${series.accent}22`,
                  color: series.accent,
                  border: `1px solid ${series.accent}55`
                }}
              >
                Watch Series
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Shows;