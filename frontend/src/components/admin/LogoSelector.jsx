import React from "react";

const logos = [
  { name: "Classic", src: "/animeLogoClassic.png" },
  { name: "DBZ", src: "/animeLogoZ.png" },
  { name: "Super", src: "/animeLogoSuper.png" },
  { name: "GT", src: "/animeLogoGT.png"},
  { name: "Daima", src: "/animeLogoDaima.png"}
];

function LogoSelector({ selectedLogo, setSelectedLogo }) {
  return (
    <div>
      <p className="text-white mb-3">Select Anime Logo</p>

      <div className="flex gap-4">
        {logos.map((logo) => (
          <div
            key={logo.name}
            onClick={() => setSelectedLogo(logo.src)}
            className={`cursor-pointer border rounded-lg p-3 transition flex items-center justify-center w-44 h-24
            ${
              selectedLogo === logo.src
                ? "border-primary bg-primary/20"
                : "border-gray-600"
            }`}
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogoSelector;