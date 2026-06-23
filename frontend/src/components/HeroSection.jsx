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
  // Track direction to know which way to slide ('next' or 'prev')
  const [direction, setDirection] = useState("next"); 

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
    setDirection("next");
    setIndex((prev) => (prev === length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection("prev");
    setIndex((prev) => (prev === 0 ? length - 1 : prev - 1));
  };

  /* ================= AUTO SLIDE ================= */

  const [autoKey, setAutoKey] = useState(0);

  const handlePrev = () => {
    prevSlide();
    setAutoKey((k) => k + 1);
  };

  const handleNext = () => {
    nextSlide();
    setAutoKey((k) => k + 1);
  };

  useEffect(() => {
    if (!length) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [length, autoKey]);

  /* ================= DERIVED INDICES ================= */

  const prevIndex = length ? (index === 0 ? length - 1 : index - 1) : 0;
  const nextIndex = length ? (index === length - 1 ? 0 : index + 1) : 0;

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

  const prevMovie  = movies[prevIndex];
  const nextMovie  = movies[nextIndex];

  return (
    <div className="relative h-screen overflow-hidden bg-black text-white">
      
      {/* INJECTING PURE CSS KEYFRAMES FOR THE ANIMATION */}
      <style>{`
        @keyframes slideInNext {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInPrev {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slide-next {
          animation: slideInNext 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-prev {
          animation: slideInPrev 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
      `}</style>

      {/* BACKGROUND */}
      <div
        key={`bg-${movie._id}`}
        className="absolute inset-0 bg-cover bg-center animate-fade-in"
        style={{ backgroundImage: `url(${movie.background_path || movie.backdrop_path})` }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* BOTTOM-RIGHT POSTER CAROUSEL + ARROWS */}
      <div className="absolute bottom-8 right-6 md:right-12 z-30 flex items-end gap-3">

        {/* PREV ARROW */}
        <button
          onClick={handlePrev}
          className="mb-2 p-2 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 backdrop-blur-sm transition flex-shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* 3-POSTER FAN */}
        <div className="flex items-end gap-2" style={{ perspective: "600px" }}>

          {/* PREV POSTER — receding left */}
          <div
            onClick={handlePrev}
            className="cursor-pointer flex-shrink-0 rounded-lg overflow-hidden"
            style={{
              width: "60px",
              height: "88px",
              transform: "rotateY(18deg) scale(0.82) translateX(10px)",
              opacity: 0.55,
              transformOrigin: "right center",
              transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "-4px 6px 20px rgba(0,0,0,0.6)",
              filter: "brightness(0.7)",
            }}
          >
            <img
              key={`prev-${prevMovie?._id}`}
              src={prevMovie?.poster_path || prevMovie?.backdrop_path}
              alt={prevMovie?.title}
              className={`w-full h-full object-cover ${direction === "next" ? "animate-slide-next" : "animate-slide-prev"}`}
            />
          </div>

          {/* ACTIVE POSTER — popping out toward viewer */}
          <div
            className="flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-orange-500"
            style={{
              width: "80px",
              height: "116px",
              transform: "scale(1.18) translateY(-8px)",
              transformOrigin: "bottom center",
              transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.9), 0 0 0 2px #f97316",
              zIndex: 10,
            }}
          >
            <img
              key={`active-${movie._id}`}
              src={movie?.poster_path || movie?.backdrop_path}
              alt={movie?.title}
              className={`w-full h-full object-cover ${direction === "next" ? "animate-slide-next" : "animate-slide-prev"}`}
            />
          </div>

          {/* NEXT POSTER — receding right */}
          <div
            onClick={handleNext}
            className="cursor-pointer flex-shrink-0 rounded-lg overflow-hidden"
            style={{
              width: "60px",
              height: "88px",
              transform: "rotateY(-18deg) scale(0.82) translateX(-10px)",
              opacity: 0.55,
              transformOrigin: "left center",
              transition: "all 0.45s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "4px 6px 20px rgba(0,0,0,0.6)",
              filter: "brightness(0.7)",
            }}
          >
            <img
              key={`next-${nextMovie?._id}`}
              src={nextMovie?.poster_path || nextMovie?.backdrop_path}
              alt={nextMovie?.title}
              className={`w-full h-full object-cover ${direction === "next" ? "animate-slide-next" : "animate-slide-prev"}`}
            />
          </div>

        </div>

        {/* NEXT ARROW */}
        <button
          onClick={handleNext}
          className="mb-2 p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

      </div>

      {/* CONTENT WITH SLIDE ANIMATION */}
      <div
        key={`content-${movie._id}`}
        className={`relative z-20 flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 h-full ${
          direction === "next" ? "animate-slide-next" : "animate-slide-prev"
        }`}
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
        <h1 className="text-5xl md:text-[70px] font-semibold tracking-tight">
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
        <p className="mt-4 text-gray-300 max-w-xl line-clamp-4 leading-relaxed">
          {movie.overview}
        </p>

        {/* BUTTONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-1 px-6 py-3 text-sm bg-orange-500 rounded-full font-medium hover:bg-orange-600 transition"
          >
            Explore Movies
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate(`/movies/${movie._id}`)}
            className="px-6 py-3 text-sm border border-white/30 rounded-full hover:bg-white/10 transition"
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;