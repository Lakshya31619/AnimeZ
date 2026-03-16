import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Moments() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/character/all");

        if (!res.ok) {
          throw new Error("Failed to fetch characters");
        }

        const data = await res.json();

        console.log("Characters:", data); // debug log

        setCharacters(data.characters);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching characters:", error);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="pt-32 text-center text-xl font-semibold">
        Loading characters...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-28 pb-16 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Character Moments</h1>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {characters.map((char) => (
          <div
            key={char._id}
            onClick={() => navigate(`/moments/${char._id}`)}
            className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-2 transition duration-300"
          >
            
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={char.profileLink}
                alt={char.name}
                className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* Name */}
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold group-hover:text-orange-400 transition">
                {char.name}
              </h2>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Moments;