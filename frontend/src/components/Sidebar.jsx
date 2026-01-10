import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-2 rounded-lg bg-black/70 backdrop-blur text-white"
      >
        {isOpen ? <XIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-black/80 backdrop-blur text-white
        transition-all duration-300 ease-in-out z-40
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <div className="mt-24 flex flex-col gap-6 px-6 text-lg font-medium">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/movies" onClick={() => setIsOpen(false)}>Movies</Link>
          <Link to="/my-watchlist" onClick={() => setIsOpen(false)}>Watch List</Link>
          <Link to="/favorite" onClick={() => setIsOpen(false)}>Favorites</Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;