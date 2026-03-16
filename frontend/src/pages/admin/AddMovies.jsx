import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import Title from "../../components/admin/Title";
import LogoSelector from "../../components/admin/LogoSelector";
import CastSelector from "../../components/admin/CastSelector";

function AddMovies() {

  const { getToken } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    backdrop_path: "",
    background_path: "",
    movie_link: "",
    genres: "",
    release_date: "",
    original_language: "",
    tagline: "",
    vote_average: "",
    runtime: ""
  });

  const [logo, setLogo] = useState("");
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      const token = await getToken();

      const payload = {
        ...formData,
        logo,

        // ✅ send only ids
        casts: casts.map(c => c._id),

        genres: formData.genres.split(",").map(g => g.trim()),
        vote_average: Number(formData.vote_average)
      };

      const res = await axios.post(
        "http://localhost:3000/api/show/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {

        alert("Movie Added Successfully ✅");

        setFormData({
          title: "",
          overview: "",
          backdrop_path: "",
          background_path: "",
          movie_link: "",
          genres: "",
          release_date: "",
          original_language: "",
          tagline: "",
          vote_average: "",
          runtime: ""
        });

        setLogo("");
        setCasts([]);

      } else {
        alert(res.data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <>
      <Title text1="Add" text2="Movie" />

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-6 max-w-4xl"
      >

        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="overview"
          placeholder="Overview"
          value={formData.overview}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <LogoSelector
          selectedLogo={logo}
          setSelectedLogo={setLogo}
        />

        <input
          type="text"
          name="backdrop_path"
          placeholder="Poster Image URL"
          value={formData.backdrop_path}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="background_path"
          placeholder="Background Image URL"
          value={formData.background_path}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="movie_link"
          placeholder="Streaming Link"
          value={formData.movie_link}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        {/* CAST SELECTOR */}
        <CastSelector
          selectedCast={casts}
          setSelectedCast={setCasts}
          limit={10}
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="genres"
            placeholder="Genres (Action, Adventure)"
            value={formData.genres}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="date"
            name="release_date"
            value={formData.release_date}
            onChange={handleChange}
            className="border p-2 rounded w-full text-white"
            required
          />

          <input
            type="text"
            name="runtime"
            placeholder="Runtime (24m)"
            value={formData.runtime}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            step="0.1"
            name="vote_average"
            placeholder="Rating"
            value={formData.vote_average}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="original_language"
            placeholder="Language (ja)"
            value={formData.original_language}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="tagline"
            placeholder="Tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white px-6 py-3 rounded"
        >
          {loading ? "Adding..." : "Add Movie"}
        </button>

      </form>
    </>
  );
}

export default AddMovies;