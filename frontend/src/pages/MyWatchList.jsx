import React from "react";
import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";
import { StarIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";

function MyWatchList() {

  const { watchList, removeFromWatchList } = useAppContext();

  return watchList ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <BlurCircle top="0px" left="600px" />

      <h1 className="text-lg font-semibold mb-4">My Watch List</h1>

      {watchList.length === 0 ? (
        <p className="text-gray-400">Your watchlist is empty.</p>
      ) : (
        watchList.map((movie) => (
          <div
            key={movie._id}
            className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl"
          >
            <div className="flex flex-col md:flex-row">
              <img
                src={movie.backdrop_path}
                alt=""
                className="w-[350px] h-[200px] object-cover rounded"
              />
              <div className="flex flex-col p-4">
                <p className="text-lg font-semibold">{movie.title}</p>
                <p className="text-gray-400 text-sm">{movie.runtime}</p>
                <p className="flex items-center gap-1 text-sm text-gray-400 mt-auto">
                  <StarIcon className="w-4 h-4 text-primary fill-primary" />
                  {movie.vote_average?.toFixed(1)}
                </p>
              </div>
            </div>

            <button
              onClick={() => removeFromWatchList(movie._id)}
              className="text-red-500 text-sm mt-4 md:mt-0"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  ) : <Loading />;
}

export default MyWatchList;