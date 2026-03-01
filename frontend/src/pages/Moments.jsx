import React from "react";
import { useNavigate } from "react-router-dom";

const characters = [
  { name: "Goku", image: "https://ovicio.com.br/wp-content/uploads/dragon-ball-super-broly-trailer-1.jpg" },
  { name: "Vegeta", image: "https://i.pinimg.com/736x/3a/64/44/3a6444c88e18e8bdab8547bbe96e45ae.jpg" },
  { name: "Piccolo", image: "https://comicbook.com/wp-content/uploads/sites/4/2022/02/78c40cab-a006-4d7f-beea-79154e83bccb.jpg" },
  { name: "Gohan", image: "https://i0.wp.com/codigoespagueti.com/wp-content/uploads/2024/02/gohan-dragon-ball-bocetos-diseno.jpg" },
  { name: "Broly", image: "https://comicvine.gamespot.com/a/uploads/scale_super/11137/111374740/6795687-awovu6e.jpg"},
  { name: "Vegito", image: "https://m.media-amazon.com/images/M/MV5BNmY4MDJhOWEtNzMxNi00ZmMwLTg2NDItYzE0NDU3MmY0MmMwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg"},
  { name: "Gogeta", image: "https://imagenes.hobbyconsolas.com/files/image_1920_1080/uploads/imagenes/2024/04/04/6903ada1868bd.jpeg"},
  { name: "Trunks", image: "https://static0.srcdn.com/wordpress/wp-content/uploads/2016/09/Future-Trunks-meets-Goku.jpg"},
];

function Moments() {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32 min-h-screen">
      <h1 className="text-3xl font-bold mb-10">Character Moments</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
        {characters.map((char) => (
          <div
            key={char.name}
            onClick={() => navigate(`/moments/${char.name.toLowerCase()}`)}
            className="cursor-pointer bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition"
          >
            <img
              src={char.image}
              alt={char.name}
              className="h-60 w-full object-cover"
            />
            <div className="p-4 text-center text-lg font-semibold">
              {char.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Moments;