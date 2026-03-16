import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HeroSection() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH MOVIES ================= */

  const fetchMovies = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/show/all`
      );

      if (data.success) {
        setMovies(data.movies);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const length = movies.length;

  const movie = useMemo(() => movies[index], [movies, index]);

  /* ================= SLIDER ================= */

  const nextSlide = () => {
    setIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  /* ================= AUTO SLIDE ================= */

  useEffect(() => {
    if (!length) return;

    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, [length]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading movies...
      </div>
    );
  }

  /* ================= NO MOVIES ================= */

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        No movies found
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden">

      {/* BACKGROUND */}
      <div
        key={movie._id}
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${movie.background_path})` }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30
        p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30
        p-2 rounded-full bg-black/50 hover:bg-black/80 transition"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* CONTENT */}
      <div
        className="relative z-20 flex flex-col items-start justify-center
        gap-4 px-6 md:px-16 lg:px-36 h-full"
      >

        {/* LOGO */}
        {movie.logo && (
          <img
            src={movie.logo}
            alt="logo"
            className="h-24 md:h-32 mb-4"
          />
        )}

        {/* TITLE */}
        <h1 className="text-5xl md:text-[70px] font-semibold">
          {movie.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-4 text-gray-300 mt-3">

          <span>{movie.genres?.join(" | ")}</span>

          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {new Date(movie.release_date).getFullYear()}
          </div>

          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            {movie.runtime}
          </div>

        </div>

        {/* DESCRIPTION */}
        <p className="mt-4 text-gray-300 max-w-xl line-clamp-4">
          {movie.overview}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">

          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-1 px-6 py-3 text-sm
            bg-orange-500 rounded-full font-medium"
          >
            Explore Movies
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate(`/movies/${movie._id}`)}
            className="px-6 py-3 text-sm border border-white/30
            rounded-full hover:bg-white/10"
          >
            Watch Now
          </button>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;