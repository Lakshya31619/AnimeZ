import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import { HeartIcon, PlayCircleIcon, StarIcon } from "lucide-react";
import MovieCard from '../components/MovieCard';
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";

function MovieDetails() {

  const { id } = useParams();
  const [show, setShow] = useState(null);
  const navigate = useNavigate();
  const playerRef = useRef(null);

  const { addToFavorites, removeFromFavorites, isFavorite } = useAppContext();

  const getShow = async () => {
    const movie = dummyShowsData.find(show => show._id === id);
    if (movie) {
      setShow({ movie });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);

  const scrollToPlayer = () => {
    if (playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFavorite = () => {
    if (!show) return;

    if (isFavorite(show.movie._id)) {
      removeFromFavorites(show.movie._id);
    } else {
      addToFavorites(show.movie._id);
    }
  };

  return show ? (
    <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={show.movie.backdrop_path}
          alt=""
          className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <p className="text-primary">ENGLISH</p>

          <h1 className="text-4xl font-semibold max-w-96 text-balance">
            {show.movie.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-300">
            <StarIcon className="w-5 h-5 text-primary fill-primary" />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
            {show.movie.overview}
          </p>

          <p>
            {show.movie.runtime} ●{" "}
            {show.movie.genres.map(g => g.name).join(", ")} ●{" "}
            {show.movie.release_date.split("-")[0]}
          </p>

          <div className="flex items-center flex-wrap gap-4 mt-4">

            <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <button
              onClick={scrollToPlayer}
              className="flex items-center gap-2 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
            >
              <PlayCircleIcon className="w-5 h-5" />
              Watch Movie
            </button>

            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer hover:scale-110"
            >
              <HeartIcon
                className={`w-5 h-5 transition ${
                  isFavorite(show.movie._id)
                    ? "text-red-500 fill-red-500"
                    : "text-white"
                }`}
              />
            </button>

          </div>
        </div>
      </div>

      <div ref={playerRef} className="flex justify-center mt-12">
        <iframe
          width="100%"
          height="500"
          src={show.movie.movie_link}
          frameBorder="0"
          allowFullScreen
          className="rounded-xl max-w-6xl w-full"
        ></iframe>
      </div>

      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {dummyShowsData.slice(0, 4).map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies');
            window.scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  ) : <Loading />;
}

export default MovieDetails;