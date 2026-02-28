import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

function MovieCard({ movie }) {

  const navigate = useNavigate();
  const { addToWatchList, removeFromWatchList, isInWatchList } = useAppContext();

  const handleWatchList = (e) => {
    e.stopPropagation();

    if (isInWatchList(movie._id)) {
      removeFromWatchList(movie._id);
    } else {
      addToWatchList(movie._id);
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          window.scrollTo(0, 0);
        }}
        src={movie.backdrop_path}
        alt=""
        className="rounded-lg h-75 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-xs text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} ●{" "}
        {movie.genres.slice(0, 2).map(g => g.name).join(" | ")} ●{" "}
        {movie.runtime}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">

        <button
          onClick={handleWatchList}
          className={`px-4 py-2 text-xs transition rounded-full font-medium cursor-pointer ${
            isInWatchList(movie._id)
              ? "bg-red-500 hover:bg-red-600"
              : "bg-primary hover:bg-primary-dull"
          }`}
        >
          {isInWatchList(movie._id) ? "Remove" : "Add to WatchList"}
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>

      </div>
    </div>
  );
}

export default MovieCard;