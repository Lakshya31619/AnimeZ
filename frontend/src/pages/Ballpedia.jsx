import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Ballpedia() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("forms"); // "forms" | "history"

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

  // All displayable forms: base form (profileLink) + additional forms
  const allForms = selected
    ? [
        { name: selected.name, image: selected.profileLink, renderLink: selected.renderLink },
        ...(selected.forms || []),
      ]
    : [];

  const currentForm = allForms[currentFormIndex] || null;

  const handleSelectCharacter = (i) => {
    setSelectedIndex(i);
    setCurrentFormIndex(0);
    setActiveTab("forms");
  };

  const prevForm = () =>
    setCurrentFormIndex((p) => (p === 0 ? allForms.length - 1 : p - 1));
  const nextForm = () =>
    setCurrentFormIndex((p) => (p === allForms.length - 1 ? 0 : p + 1));

  if (loading) {
    return (
      <div className="pt-32 text-center text-xl font-semibold text-white">
        Loading Ballpedia...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-10 lg:px-16 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold">
          Ball<span className="text-primary">pedia</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-base">
          Explore every character, form, and moment from the Dragon Ball universe.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ─── LEFT: Character List ─── */}
        <aside className="lg:w-72 shrink-0">
          <input
            type="text"
            placeholder="Search characters..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
              setCurrentFormIndex(0);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary mb-4"
          />

          <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar">
            {filtered.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">No characters found.</p>
            )}
            {filtered.map((char, i) => (
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
                    {(char.forms?.length || 0) + 1} form{(char.forms?.length || 0) !== 0 ? "s" : ""}
                    {" · "}
                    {char.history?.length || 0} histor{(char.history?.length || 0) !== 1 ? "ies" : "y"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* ─── RIGHT: Detail Panel ─── */}
        {selected ? (
          <main className="flex-1 min-w-0">

            {/* Character name + tabs */}
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
                  <Clock className="w-3.5 h-3.5" /> History
                </button>
              </div>
            </div>

            {/* ── FORMS TAB ── */}
            {activeTab === "forms" && (
              <div className="flex flex-col md:flex-row gap-6">

                {/* Render Viewer */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
                  {allForms.length > 1 && (
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <button
                        onClick={prevForm}
                        className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span>
                        {currentFormIndex + 1} / {allForms.length}
                      </span>
                      <button
                        onClick={nextForm}
                        className="p-2 rounded-full bg-white/10 hover:bg-primary/30 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Main render or profile image - Fixed size container */}
                  <div className="w-full h-80 flex items-center justify-center mb-4 bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden">
                    <img
                      key={currentFormIndex}
                      src={currentForm?.renderLink || currentForm?.image}
                      alt={currentForm?.name}
                      className="max-w-full max-h-full object-contain animate-fadeSlide drop-shadow-2xl"
                      onError={(e) => {
                        if (e.target.src !== currentForm?.image) {
                          e.target.src = currentForm?.image;
                        }
                      }}
                    />
                  </div>

                  <p className="text-xl font-bold text-center">{currentForm?.name}</p>
                  {currentFormIndex === 0 && (
                    <span className="mt-1 text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                      Base Form
                    </span>
                  )}
                </div>

                {/* Form List Thumbnails */}
                {allForms.length > 1 && (
                  <div className="md:w-52 shrink-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
                      All Forms
                    </p>
                    <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible no-scrollbar">
                      {allForms.map((form, fi) => (
                        <button
                          key={fi}
                          onClick={() => setCurrentFormIndex(fi)}
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
            )}

            {/* ── HISTORY TAB ── */}
            {activeTab === "history" && (
              <div>
                {(!selected.history || selected.history.length === 0) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-3">
                    <Clock className="w-10 h-10 opacity-40" />
                    <p className="text-sm">No history recorded for {selected.name} yet.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-primary/30 flex flex-col gap-8">
                    {selected.history.map((entry, hi) => (
                      <div key={entry._id || hi} className="relative">
                        {/* Dot */}
                        <span className="absolute -left-[1.45rem] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-[#09090B]" />

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-primary/30 transition-all">
                          <p className="font-bold text-base mb-1">{entry.title || "Untitled"}</p>
                          {entry.content && (
                            <p className="text-gray-400 text-sm mb-3 leading-relaxed">{entry.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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