import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import BlurCircle from "../components/BlurCircle";
import Loading from "../components/Loading";

import {
HeartIcon,
PlayCircleIcon,
StarIcon,
X,
ChevronLeft,
ChevronRight
} from "lucide-react";

import { useAppContext } from "../context/AppContext";

function MovieDetails() {

const { id } = useParams();
const navigate = useNavigate();
const playerRef = useRef(null);

const [show, setShow] = useState(null);
const [characters, setCharacters] = useState([]);
const [selectedCharacter, setSelectedCharacter] = useState(null);
const [currentFormIndex, setCurrentFormIndex] = useState(0);

const { addToFavorites, removeFromFavorites, isFavorite } = useAppContext();

const baseURL = import.meta.env.VITE_BASE_URL;

/* FETCH MOVIE */

const getShow = async () => {

try {

  const { data } = await axios.get(`${baseURL}/api/show/all`);

  if (data.success) {

    const movie = data.movies.find((m) => m._id === id);

    setShow(movie);

  }

} catch (error) {
  console.error(error);
}

};

/* FETCH CHARACTERS */

const getCharacters = async () => {

try {

  const { data } = await axios.get(`${baseURL}/api/character/all`);

  if (data.success) {
    setCharacters(data.characters);
  }

} catch (error) {
  console.error(error);
}

};

useEffect(() => {

getShow();
getCharacters();

}, [id]);

/* PLAYER SCROLL */

const scrollToPlayer = () => {

playerRef.current?.scrollIntoView({
  behavior: "smooth"
});

};

/* FAVORITES */

const handleFavorite = () => {

if (!show) return;

if (isFavorite(show._id)) {
  removeFromFavorites(show._id);
} else {
  addToFavorites(show._id);
}

};

/* CHARACTER MATCHING */

const movieCharacters = characters.filter((character) => {

  if (!show?.casts || !Array.isArray(show.casts)) return false;

  return show.casts.includes(character._id);

});

/* MODAL */

const openCharacterModal = (character) => {
setSelectedCharacter(character);
setCurrentFormIndex(0);
};

const closeModal = () => {
setSelectedCharacter(null);
};

/* COMBINE BASE + FORMS */

const allForms = selectedCharacter
? [
{
name: "Base",
renderLink: selectedCharacter.renderLink
},
...(selectedCharacter.forms || [])
]
: [];

const currentForm = allForms[currentFormIndex];

if (!show) return ;

return (

<div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">

  {/* MOVIE INFO */}

  <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">

    <img
      src={show.backdrop_path}
      alt={show.title}
      className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
    />

    <div className="relative flex flex-col gap-3">

      <BlurCircle top="-100px" left="-100px" />

      <p className="text-primary">
        {show.original_language?.toUpperCase()}
      </p>

      <h1 className="text-4xl font-semibold max-w-96">
        {show.title}
      </h1>

      <div className="flex items-center gap-2 text-gray-300">

        <StarIcon className="w-5 h-5 text-primary fill-primary" />

        {show.vote_average?.toFixed(1)} User Rating

      </div>

      <p className="text-gray-400 mt-2 text-sm max-w-xl">
        {show.overview}
      </p>

      <p>
        {show.runtime} ● {show.genres?.join(", ")} ●{" "}
        {show.release_date?.split("-")[0]}
      </p>

      <div className="flex items-center gap-4 mt-4">

        <button
          onClick={scrollToPlayer}
          className="flex items-center gap-2 px-10 py-3 text-sm bg-primary hover:bg-primary-dull rounded-md"
        >

          <PlayCircleIcon className="w-5 h-5" />

          Watch Movie

        </button>

        <button
          onClick={handleFavorite}
          className="bg-gray-700 p-2.5 rounded-full hover:scale-110 transition"
        >

          <HeartIcon
            className={`w-5 h-5 ${
              isFavorite(show._id)
                ? "text-red-500 fill-red-500"
                : "text-white"
            }`}
          />

        </button>

      </div>

    </div>

  </div>

  {/* CAST */}

  <p className="text-lg font-medium mt-20">
    Your Favorite Characters
  </p>

  <div className="overflow-x-auto mt-8 pb-4 mb-20">

    <div className="flex items-center gap-6 w-max px-4">

      {movieCharacters.map((character) => (

        <div
          key={character._id}
          onClick={() => openCharacterModal(character)}
          className="flex flex-col items-center text-center min-w-[80px] cursor-pointer hover:scale-110 transition"
        >

          <img
            src={character.profileLink}
            alt={character.name}
            className="rounded-full h-20 w-20 object-cover border border-gray-600"
          />

          <p className="text-sm mt-2">
            {character.name}
          </p>

        </div>

      ))}

    </div>

  </div>

  {/* PLAYER */}

  <div ref={playerRef} className="flex justify-center mt-12">

    <iframe
      width="100%"
      height="500"
      src={show.movie_link}
      frameBorder="0"
      allowFullScreen
      className="rounded-xl max-w-6xl w-full"
    ></iframe>

  </div>

  {/* CHARACTER MODAL */}

  {selectedCharacter && (

    <div
      onClick={closeModal}
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-[#0f172a] to-[#020617] border border-gray-700 w-[650px] max-w-[95%] rounded-2xl p-10"
      >

        <button
          onClick={closeModal}
          className="absolute top-6 right-6"
        >
          <X size={26} />
        </button>

        <h2 className="text-3xl font-bold text-center">
          {selectedCharacter.name}
        </h2>

        {/* AURA + IMAGE */}

        <div className="relative flex justify-center items-center mt-8 h-[320px]">

          <div className="absolute w-72 h-72 bg-primary opacity-20 blur-3xl rounded-full animate-pulse"></div>

          <img
            src={currentForm?.renderLink}
            className="relative max-h-[300px] object-contain transition-all duration-500 hover:scale-105"
          />

        </div>

        {/* FORM SLIDER */}

        {allForms.length > 1 && (

          <div className="flex justify-center items-center gap-6 mt-8">

            <button
              onClick={() =>
                setCurrentFormIndex(
                  (prev) =>
                    (prev - 1 + allForms.length) %
                    allForms.length
                )
              }
              className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>

            <p className="text-sm tracking-wide w-28 text-center">
              {currentForm?.name}
            </p>

            <button
              onClick={() =>
                setCurrentFormIndex(
                  (prev) =>
                    (prev + 1) % allForms.length
                )
              }
              className="bg-gray-800 hover:bg-gray-700 p-3 rounded-full"
            >
              <ChevronRight size={20} />
            </button>

          </div>

        )}

        <div className="flex justify-center mt-10">

          <button
            onClick={() =>
              navigate(`/moments/${selectedCharacter._id}`)
            }
            className="px-10 py-3 bg-primary hover:bg-primary-dull rounded-lg transition"
          >
            Watch Moments
          </button>

        </div>

      </div>

    </div>

  )}

</div>

);

}

export default MovieDetails;