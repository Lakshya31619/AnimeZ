import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CharacterMoments() {
  const { character } = useParams();
  const [charData, setCharData] = useState(null);
  const [playingIds, setPlayingIds] = useState([]);

  const baseURL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`${baseURL}/api/character/all`);
        const data = await res.json();

        if (data.success) {
          const found = data.characters.find((c) => c._id === character);
          setCharData(found);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCharacter();
  }, [character]);

  const playVideo = (id) => {
    setPlayingIds((prev) => [...prev, id]);
  };

  if (!charData) {
    return (
      <div className="pt-32 text-center text-gray-400">
        Loading character...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-32 pt-28 pb-16 min-h-screen">

      <h1 className="text-4xl font-bold mb-12">
        {charData.name} Moments
      </h1>

      <div className="grid md:grid-cols-2 gap-10">

        {charData.moments.map((moment) => (

          <div
            key={moment._id}
            className="bg-gray-900/70 backdrop-blur border border-gray-800 rounded-xl p-6 hover:scale-[1.02] transition"
          >

            <h2 className="text-lg font-semibold">
              {moment.title}
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              {moment.show}
            </p>

            {moment.video && (

              <div className="relative aspect-video mt-4 rounded-lg overflow-hidden">

                {playingIds.includes(moment._id) ? (

                  <iframe
                    src={`${moment.video}${moment.video.includes("?") ? "&" : "?"}autoplay=1`}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />

                ) : (

                  <div
                    onClick={() => playVideo(moment._id)}
                    className="relative w-full h-full bg-black flex items-center justify-center cursor-pointer group"
                  >

                    {/* background placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black group-hover:from-gray-700 group-hover:to-black transition"></div>

                    {/* play button */}
                    <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-black text-2xl shadow-lg group-hover:scale-110 transition">
                      ▶
                    </div>

                  </div>

                )}

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default CharacterMoments;