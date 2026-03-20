import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterFilter from "../components/CharacterFilter";

function Moments() {
  const navigate = useNavigate();

  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);

  const [loading, setLoading] = useState(true);

  // ✅ New states
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/character/all`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch characters");
        }

        const data = await res.json();

        // ✅ Only characters with moments
        const validCharacters = data.characters.filter(
          (char) => Array.isArray(char.moments) && char.moments.length > 0
        );

        setCharacters(validCharacters);
        setFilteredCharacters(validCharacters);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // ✅ Apply search + sort
  useEffect(() => {
    let updated = [...characters];

    // 🔍 Search filter
    if (search.trim() !== "") {
      updated = updated.filter((char) =>
        char.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 🔽 Sorting
    if (sort === "latest") {
      updated.reverse(); // assumes latest last
    } else if (sort === "oldest") {
      // default order
    } else if (sort === "name-asc") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredCharacters(updated);
  }, [search, sort, characters]);

  if (loading) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        Loading characters...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-28 pb-16 min-h-screen">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Character Moments</h1>
      </div>

      {/* ✅ Filter Component */}
      <CharacterFilter
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {/* Empty State */}
      {filteredCharacters.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          No matching characters found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {filteredCharacters.map((char) => (
            <div
              key={char._id}
              onClick={() => navigate(`/moments/${char._id}`)}
              className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-2 transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={char.profileLink}
                  alt={char.name}
                  className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold group-hover:text-orange-400 transition">
                  {char.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Moments;