// CharacterMoments.jsx
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
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL; // Render backend

  useEffect(() => {
    const fetchTokens = async () => {
      if (videos.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch all tokens in parallel
        const tokenEntries = await Promise.all(
          videos.map(async (moment) => {
            if (!moment.video) return null;

            const res = await fetch(`${BACKEND_URL}/api/mux/${moment.video}`);
            if (!res.ok) throw new Error(`Failed to fetch token for ${moment.video}`);

            const data = await res.json();
            if (data.token) return [moment.video, data.token];
            return null;
          })
        );

        // Convert array of [video, token] to object
        const newTokens = Object.fromEntries(tokenEntries.filter(Boolean));
        setTokens(newTokens);
      } catch (err) {
        console.error("Token fetch error:", err);
        setError("Failed to load videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [videos, BACKEND_URL]);

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 capitalize">{character} Moments</h1>

      {loading && <p className="text-gray-400 mb-6">Loading videos...</p>}
      {error && <p className="text-red-500 mb-6">{error}</p>}

      <div className="grid md:grid-cols-2 gap-10">
        {videos.length === 0 && !loading && <p>No moments available.</p>}

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

            {moment.video && !tokens[moment.video] && !loading && (
              <p className="text-gray-500 text-sm">Video unavailable.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CharacterMoments;