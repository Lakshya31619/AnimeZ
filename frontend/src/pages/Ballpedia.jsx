import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";

const ANIM_CSS = `
  @keyframes formFlash {
    0%   { opacity: 0; }
    15%  { opacity: 0.85; }
    100% { opacity: 0; }
  }
  @keyframes formSlideLeft {
    from { opacity: 0; transform: translateX(50px) scale(0.85); }
    to   { opacity: 1; transform: translateX(0)    scale(1); }
  }
  @keyframes formSlideRight {
    from { opacity: 0; transform: translateX(-50px) scale(0.85); }
    to   { opacity: 1; transform: translateX(0)     scale(1); }
  }
  @keyframes ringPulse {
    0%   { opacity: 0;   transform: scale(0.92); }
    40%  { opacity: 1;   transform: scale(1.04); }
    100% { opacity: 0;   transform: scale(1.12); }
  }
  @keyframes particleFly {
    0%   { opacity: 0.9; transform: scale(1)   translate(0, 0); }
    100% { opacity: 0;   transform: scale(0)   translate(var(--tx), var(--ty)); }
  }
`;

function MagnifierImage({ src, alt, animKey, slideDir, onError }) {
  const [lens, setLens] = useState(null); // { x, y } relative to image
  const imgRef = React.useRef(null);
  const ZOOM = 2.5;
  const LENS_SIZE = 120;

  const handleMouseMove = (e) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setLens(null);
      return;
    }
    setLens({ x, y, w: rect.width, h: rect.height });
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLens(null)}
      style={{ cursor: lens ? "crosshair" : "default" }}
    >
      <img
        ref={imgRef}
        key={animKey}
        src={src}
        alt={alt}
        className="max-w-full max-h-72 object-contain drop-shadow-2xl select-none"
        style={{
          animation: `${slideDir === "left" ? "formSlideLeft" : "formSlideRight"} 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards`,
        }}
        onError={onError}
        draggable={false}
      />
      {lens && (
        <div
          style={{
            position: "absolute",
            left: lens.x - LENS_SIZE / 2,
            top: lens.y - LENS_SIZE / 2,
            width: LENS_SIZE,
            height: LENS_SIZE,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.5)",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 50,
            backdropFilter: "none",
          }}
        >
          <img
            src={src}
            alt=""
            draggable={false}
            style={{
              width: lens.w * ZOOM,
              height: lens.h * ZOOM,
              maxWidth: "none",
              objectFit: "contain",
              position: "absolute",
              left: -(lens.x * ZOOM - LENS_SIZE / 2),
              top: -(lens.y * ZOOM - LENS_SIZE / 2),
              pointerEvents: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

function AuraParticles({ color }) {
  const particles = Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 10;
    const dist = 55 + Math.random() * 60;
    const size = 5 + Math.random() * 8;
    const delay = Math.random() * 80;
    return { angle, dist, size, delay };
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl" style={{ zIndex: 9 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: color,
            left: `calc(50% - ${p.size / 2}px)`,
            top: `calc(42% - ${p.size / 2}px)`,
            "--tx": `${Math.cos(p.angle) * p.dist}px`,
            "--ty": `${Math.sin(p.angle) * p.dist}px`,
            animation: `particleFly 0.55s ease-out ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}

function Ballpedia() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forms");

  // Animation states
  const [slideDir, setSlideDir] = useState("left");
  const [animKey, setAnimKey] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particleColor, setParticleColor] = useState("#ffe040");

  // Inject CSS animations dynamically
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.textContent = ANIM_CSS;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  // Fetch character data
  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/character/all`);
        const data = await res.json();
        const chars = (data.characters || []).filter(
          (c) => c.profileLink || (c.forms && c.forms.length > 0)
        );
        setCharacters(chars);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, []);

  const filtered = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = filtered[selectedIndex] || null;
  const selectedColor = "#ffe040"; // Fallback aura color

  const allForms = selected
    ? [
        {
          _id: "",
          name: "Base Form",
          image: selected.profileLink,
          renderLink: selected.renderLink,
        },
        ...(selected.forms || []),
      ]
    : [];

  const currentForm = allForms[currentFormIndex] || null;

  const filteredHistory =
    selected && currentForm
      ? (selected.history || []).filter((entry) => {
          const targetId = currentForm._id?.$oid || currentForm._id || "";
          const entryId = entry.formId?.$oid || entry.formId || "";
          return entryId === targetId;
        })
      : [];

  // Animated form navigation handlers
  const goToForm = (idx, dir = "left") => {
    if (idx === currentFormIndex) return;
    setSlideDir(dir);
    setFlashing(true);
    setShowParticles(true);
    setParticleColor(selectedColor);

    setTimeout(() => {
      setCurrentFormIndex(idx);
      setAnimKey((k) => k + 1);
    }, 110); // Swap form layout at flash peak

    setTimeout(() => setFlashing(false), 420);
    setTimeout(() => setShowParticles(false), 650);
  };

  const prevForm = () => {
    const prev = (currentFormIndex - 1 + allForms.length) % allForms.length;
    goToForm(prev, "right");
  };

  const nextForm = () => {
    const next = (currentFormIndex + 1) % allForms.length;
    goToForm(next, "left");
  };

  const handleSelectCharacter = (i) => {
    setSelectedIndex(i);
    setCurrentFormIndex(0);
    setAnimKey((k) => k + 1);
    setActiveTab("forms");
  };

  if (loading) {
    return (
      <div className="pt-32 text-center text-xl font-semibold text-white">
        Loading Ballpedia...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-10 lg:px-16 text-white relative overflow-x-hidden">
      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold">
          Ball<span className="text-primary">pedia</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Explore every character, form, and moment from the Dragon Ball universe.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 relative z-10">
        {/* LEFT Side: Character List Panel */}
        <aside className="lg:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
              setCurrentFormIndex(0);
              setActiveTab("forms");
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary mb-4"
          />
          <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar">
            {filtered.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No characters found.</p>
            )}
            {filtered.map((char, i) => {
              const formCount = (char.forms?.length || 0) + 1;
              const historyCount = char.history?.length || 0;
              return (
                <button
                  key={char._id}
                  onClick={() => handleSelectCharacter(i)}
                  className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 transition-all text-left ${
                    i === selectedIndex
                      ? "bg-primary/20 border border-primary/50 text-white"
                      : "bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300"
                  }`}
                >
                  <img
                    src={char.profileLink}
                    alt={char.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10"
                  />
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate">{char.name}</p>
                    <p className="text-xs text-gray-500">
                      {formCount} form{formCount !== 1 ? "s" : ""}
                      {" · "}
                      {historyCount} {historyCount !== 1 ? "entries" : "entry"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* RIGHT Side: Detail Viewer Panel */}
        {selected ? (
          <main className="flex-1 min-w-0">
            {/* Header Title & Navigation Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold">{selected.name}</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActiveTab("forms")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "forms"
                      ? "bg-primary text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" /> Forms
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeTab === "history"
                      ? "bg-primary text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" /> Form History
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Core Render Showcase Box */}
              <div className="flex-1 border border-white/10 rounded-2xl p-6 flex flex-col items-center [perspective:1000px] relative overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                {/* Animated character background */}
                {currentForm && (
                  <div
                    key={`panel-${selected._id}-${animKey}`}
                    className="absolute inset-0 pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    {/* The big blurred GIF */}
                    <img
                      src={currentForm.image}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                      style={{
                        filter: "blur(8px) saturate(1.6)",
                        transform: "scale(1.1)",
                        opacity: 0.55,
                        transition: "opacity 0.6s ease",
                        objectPosition: "center top",
                      }}
                    />
                    {/* Subtle dark overlay — just enough for readability, not a blackout */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)",
                      }}
                    />
                  </div>
                )}
                {/* Pagination Arrow Keys */}
                {allForms.length > 1 && (
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400 z-10 relative">
                    <button
                      onClick={prevForm}
                      className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition"
                      aria-label="Previous form"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>
                      {currentFormIndex + 1} / {allForms.length}
                    </span>
                    <button
                      onClick={nextForm}
                      className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition"
                      aria-label="Next form"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* 3D Flip Canvas */}
                <div
                  className={`w-full h-96 relative transition-transform duration-700 [transform-style:preserve-3d] z-10 ${
                    activeTab === "history" ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  {/* FRONT CANVAS: Identity Render Face */}
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden [backface-visibility:hidden]">
                    {/* Visual energy triggers */}
                    {flashing && (
                      <div
                        className="absolute inset-0 bg-white rounded-xl pointer-events-none"
                        style={{ animation: "formFlash 0.42s ease-out forwards", zIndex: 10 }}
                      />
                    )}
                    {flashing && (
                      <div
                        className="absolute inset-0 rounded-xl border-2 border-yellow-300 pointer-events-none"
                        style={{ animation: "ringPulse 0.48s ease-out forwards", zIndex: 10 }}
                      />
                    )}
                    {showParticles && <AuraParticles color={particleColor} />}

                    {/* Character Dynamic Visual Image with Magnifier */}
                    <MagnifierImage
                      src={currentForm?.renderLink || currentForm?.image}
                      alt={currentForm?.name}
                      animKey={animKey}
                      slideDir={slideDir}
                      onError={(e) => {
                        if (e.target.src !== currentForm?.image) {
                          e.target.src = currentForm?.image;
                        }
                      }}
                    />
                    <p className="text-xl font-bold text-center mt-4">{currentForm?.name}</p>
                    {currentFormIndex === 0 && (
                      <span className="mt-1 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                        Base Profile
                      </span>
                    )}
                  </div>

                  {/* BACK CANVAS: Chronicle Metadata Log */}
                  <div className="absolute inset-0 w-full h-full bg-zinc-900 border border-white/10 p-5 rounded-xl flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto no-scrollbar">
                    <div className="border-b border-white/10 pb-2 mb-3">
                      <p className="text-xs text-primary font-bold uppercase tracking-widest">Chronology Log</p>
                      <p className="text-lg font-bold truncate text-gray-100">{currentForm?.name}</p>
                    </div>

                    {filteredHistory.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2 text-center py-4">
                        <Clock className="w-8 h-8 opacity-30" />
                        <p className="text-xs">No specific history recorded for this form.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {filteredHistory.map((entry, hi) => (
                          <div
                            key={entry._id?.$oid || hi}
                            className="bg-white/5 border border-white/5 rounded-lg p-3.5"
                          >
                            <h4 className="font-bold text-sm text-white mb-1.5">
                              {entry.title || "Untitled Entry"}
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-wrap">
                              {entry.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Thumbnails Track */}
              {allForms.length > 1 && (
                <div className="md:w-52 shrink-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
                    Available States
                  </p>
                  <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar">
                    {allForms.map((form, fi) => (
                      <button
                        key={fi}
                        onClick={() => goToForm(fi, fi > currentFormIndex ? "left" : "right")}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all shrink-0 text-left ${
                          fi === currentFormIndex
                            ? "bg-primary/20 border border-primary/50"
                            : "bg-white/5 border border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <img
                          src={form.image || form.renderLink}
                          alt={form.name}
                          className="w-9 h-9 object-cover rounded-lg shrink-0"
                        />
                        <span className="text-sm text-gray-200 truncate max-w-[120px]">
                          {form.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        ) : (
          <main className="flex-1 flex items-center justify-center text-gray-600">
            <p className="text-lg">Select a character to explore.</p>
          </main>
        )}
      </div>
    </div>
  );
}

export default Ballpedia;