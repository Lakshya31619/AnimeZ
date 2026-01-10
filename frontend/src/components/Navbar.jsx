import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, Eye } from "lucide-react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-20 flex items-center px-6 md:px-16 lg:px-36 bg-black/70 backdrop-blur">
      
      {/* Logo */}
      <Link to="/" className="flex-1">
        <img className="w-36" src="/siteLogo.png" alt="Logo" />
      </Link>

      {/* Search Bar (Center) */}
      <div className="hidden md:flex flex-1 justify-center">
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-full w-96">
          <SearchIcon className="w-5 h-5 mr-2 text-gray-300" />
          <input
            type="text"
            placeholder="Search movies..."
            className="bg-transparent outline-none w-full text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* User / Login */}
      <div className="flex-1 flex justify-end items-center gap-6">
        {!user ? (
          <button
            onClick={openSignIn}
            className="px-6 py-2 bg-primary rounded-full font-medium hover:bg-primary-dull transition"
          >
            Login
          </button>
        ) : (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="My Watch List"
                labelIcon={<Eye width={15} />}
                onClick={() => navigate("/my-watchlist")}
              />
            </UserButton.MenuItems>
          </UserButton>
        )}
      </div>
    </div>
  );
}

export default Navbar;
