import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { dummyShowsData } from "../assets/assets";

function HeroSection() {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const movie = dummyShowsData[index];

  // LOGO CONDITION
  const logoSrc =
    movie.id === 1 || movie.id === 2
      ? "/animeLogoSuper.png"
      : "/animeLogoZ.png";

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prev) =>
      prev === 0 ? dummyShowsData.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setDirection(1);
    setIndex((prev) =>
      prev === dummyShowsData.length - 1 ? 0 : prev + 1
    );
  };

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) =>
        prev === dummyShowsData.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* SLIDING BACKGROUND */}
      <div
        key={index}
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${movie.background_path})`,
          transform: `translateX(${direction * 0}px)`,
        }}
      />

      {/* Overlay */}
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
        key={movie.id}
        className="relative z-20 flex flex-col items-start justify-center
        gap-4 px-6 md:px-16 lg:px-36 h-full
        transition-all duration-700 ease-in-out
        animate-fadeSlide"
      >
        {/* LOGO */}
        <img
          src={logoSrc}
          alt="Anime Logo"
          className="h-24 md:h-32 mb-4 select-none"
        />

        {/* TITLE */}
        <h1 className="text-5xl md:text-[70px] md:leading-tight font-semibold">
          {movie.title}
        </h1>

        {/* META */}
        <div className="flex flex-wrap items-center gap-4 text-gray-300 mt-3">
          <span>{movie.genres.map((g) => g.name).join(" | ")}</span>

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

        {/* ACTIONS */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/movies")}
            className="flex items-center gap-1 px-6 py-3 text-sm
            bg-primary-dull rounded-full font-medium hover:opacity-90 transition"
          >
            Explore Movies
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate(`/movies/${movie.id}`)}
            className="px-6 py-3 text-sm border border-white/30
            rounded-full hover:bg-white/10 transition"
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;