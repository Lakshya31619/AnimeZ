import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CharacterDetails() {
  const { character } = useParams();
  const navigate = useNavigate();
  const data = charactersDatabase[character];

  const [currentForm, setCurrentForm] = useState(0);

  if (!data) {
    return (
      <div className="pt-32 text-center text-xl">
        Character not found.
      </div>
    );
  }

  const nextForm = () => {
    setCurrentForm((prev) =>
      prev === data.forms.length - 1 ? 0 : prev + 1
    );
  };

  const prevForm = () => {
    setCurrentForm((prev) =>
      prev === 0 ? data.forms.length - 1 : prev - 1
    );
  };

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">{data.name}</h1>

      <p className="text-gray-400 mb-10 max-w-2xl">
        {data.description}
      </p>

      {/* Forms Slider */}
      <div className="relative flex items-center justify-center mb-12">
        <button
          onClick={prevForm}
          className="absolute left-0 bg-gray-800 p-3 rounded-full hover:scale-110 transition"
        >
          <ChevronLeft />
        </button>

        <div className="text-center">
          <img
            src={data.forms[currentForm].image}
            alt={data.forms[currentForm].name}
            className="h-80 object-contain mx-auto"
          />
          <p className="mt-4 text-lg font-semibold">
            {data.forms[currentForm].name}
          </p>
        </div>

        <button
          onClick={nextForm}
          className="absolute right-0 bg-gray-800 p-3 rounded-full hover:scale-110 transition"
        >
          <ChevronRight />
        </button>
      </div>

      {/* Watch Moments Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate(`/moments/${character}`)}
          className="px-8 py-3 bg-primary rounded-md hover:bg-primary-dull transition"
        >
          Watch Moments
        </button>
      </div>
    </div>
  );
}

export default CharacterDetails;