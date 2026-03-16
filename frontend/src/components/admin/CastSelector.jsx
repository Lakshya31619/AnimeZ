import React, { useEffect, useState } from "react";
import axios from "axios";

function CastSelector({ selectedCast, setSelectedCast, limit = 10 }) {

  const [characters, setCharacters] = useState([]);
  const [search, setSearch] = useState("");

  const API = "http://localhost:3000/api/character/all";

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {

      const res = await axios.get(API);

      // adjust depending on backend response
      if (res.data.characters) {
        setCharacters(res.data.characters);
      } else {
        setCharacters(res.data);
      }

    } catch (error) {
      console.error("Error fetching characters", error);
    }
  };

  const toggleCast = (character) => {

    const exists = selectedCast.find((c) => c._id === character._id);

    if (exists) {
      setSelectedCast(selectedCast.filter((c) => c._id !== character._id));
    } else {

      if (selectedCast.length >= limit) {
        alert(`You can select only ${limit} cast members`);
        return;
      }

      setSelectedCast([...selectedCast, character]);
    }
  };

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedCharacters =
    search.length > 0 ? filteredCharacters : characters.slice(0, limit);

  return (
    <div>

      <p className="text-white mb-3">Select Cast</p>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search characters..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-black border border-gray-600 text-white"
      />

      {/* CAST GRID */}
      <div className="grid grid-cols-4 gap-4">

        {displayedCharacters.map((character) => {

          const selected = selectedCast.find(
            (c) => c._id === character._id
          );

          return (
            <div
              key={character._id}
              onClick={() => toggleCast(character)}
              className={`cursor-pointer text-center p-2 rounded-lg border transition
              ${
                selected
                  ? "border-primary bg-primary/20"
                  : "border-gray-700"
              }`}
            >

              <img
                src={character.profileLink || character.image}
                alt={character.name}
                className="h-20 w-20 mx-auto object-cover rounded"
              />

              <p className="text-sm mt-1 text-white">
                {character.name}
              </p>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default CastSelector;