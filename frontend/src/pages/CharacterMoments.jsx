import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MuxPlayer from "@mux/mux-player-react";

const momentsData = {
  goku: [
    {
      title: "I'll make you suffer (SSJ Transformation)",
      show: "Dragon Ball Z",
      saga: "Frieza Saga",
      episode: 95,
      video: ""
    },
    {
      title: "Let's just skip the warm-up (SSJ2 Transformation)",
      show: "Dragon Ball Z",
      saga: "Majin Buu Saga",
      episode: 229,
      video: ""
    },
    {
      title: "And this is to go even further beyond (SSJ3 Transformation)",
      show: "Dragon Ball Z",
      saga: "Majin Buu Saga",
      episode: 245,
      video: "sDDIlnKJxiT7w2HGalcEaqxJPZkx1b4jwGixO3lmj6I"
    },
    {
      title: "Ahehehe (SSJ4 Transformation)",
      show: "Dragon Ball GT",
      saga: "Baby Saga",
      episode: 35,
      video: ""
    },
    {
      title: "Super Saiyan God",
      show: "Dragon Ball Super",
      saga: "God of Destruction Saga",
      episode: "10",
      video: "HQ4C8zTP3BpkB2CBp02hfLmPRTjqgWaJBXBhkDKSny02I"
    },
  ],
  vegeta: [],
  piccolo: [
    {
      title: "Sacrifice for Gohan",
      saga: "Saiyan Saga",
      episode: 8,
      video: "sDDIlnKJxiT7w2HGalcEaqxJPZkx1b4jwGixO3lmj6I"
    }
  ],
  gohan: [
    {
      title: "SSJ2 vs Cell",
      saga: "Cell Saga",
      episode: 184,
      video: "sDDIlnKJxiT7w2HGalcEaqxJPZkx1b4jwGixO3lmj6I"
    }
  ],
  broly: [
    {
      title: "Kakarot, I choose you to be the first of my victims (LSSJ Transformation)",
      show: "Dragon Ball Z",
      saga: "Broly: The Legendary Super Saiyan",
      episode: "Movie",
      video: "k3s01CoHDCEGvFTFRJcP6u6zCJzPQ02pgmbBYKMJ7PQ02Y"
    },
  ],
};

function CharacterMoments() {
  const { character } = useParams();
  const videos = momentsData[character] || [];

  const [tokens, setTokens] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const newTokens = {};

        for (const moment of videos) {
          if (!moment.video) continue;

          const res = await fetch(
            `http://localhost:3000/api/mux/${moment.video}`
          );

          if (!res.ok) {
            throw new Error("Failed to fetch token");
          }

          const data = await res.json();

          if (data.token) {
            newTokens[moment.video] = data.token;
          }
        }

        setTokens(newTokens);
      } catch (err) {
        console.error("Token fetch error:", err);
        setError("Failed to load videos.");
      }
    };

    if (videos.length > 0) {
      fetchTokens();
    }
  }, [videos]);

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 capitalize">
        {character} Moments
      </h1>

      {error && (
        <p className="text-red-500 mb-6">{error}</p>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        {videos.map((moment, index) => (
          <div key={index} className="bg-gray-900 rounded-xl p-4">
            <h2 className="text-lg font-semibold">{moment.title}</h2>

            <p className="text-sm text-gray-400 mt-1 mb-4">
              {moment.show}
              {moment.saga && ` • ${moment.saga}`}
              {moment.episode && ` • Episode ${moment.episode}`}
            </p>

            {moment.video && tokens[moment.video] && (
              <div className="aspect-video">
                <MuxPlayer
                  playbackId={moment.video}
                  tokens={{ playback: tokens[moment.video] }}
                  className="w-full h-full rounded-lg"
                  streamType="on-demand"
                />
              </div>
            )}
          </div>
        ))}

        {videos.length === 0 && (
          <p>No moments available.</p>
        )}
      </div>
    </div>
  );
}

export default CharacterMoments;