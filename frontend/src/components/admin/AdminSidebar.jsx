import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  UserIcon,
  FilmIcon,
  TvIcon,
  MessageSquareIcon
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

function AdminSidebar() {
  const { user } = useAppContext();

  const adminNavlinks = [
    { name: "Dashboard",       path: "/admin",                icon: LayoutDashboardIcon },
    { name: "Add Movies",      path: "/admin/add-movies",     icon: PlusSquareIcon },
    { name: "Characters",      path: "/admin/characters",     icon: UserIcon },
    { name: "Add Moments",     path: "/admin/add-moments",    icon: FilmIcon },
    { name: "Add Episodes",    path: "/admin/add-episodes",   icon: TvIcon },
    { name: "Comments",        path: "/admin/comments",       icon: MessageSquareIcon }
  ];

  return (
    <div className="h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-16 md:max-w-60 w-full border-r border-gray-300/20 text-sm bg-black">

      {/* Profile Section */}
      <img
        className="h-10 md:h-16 w-10 md:w-16 rounded-full mx-auto object-cover"
        src={user?.image}
        alt="admin"
      />

      <p className="mt-2 text-base max-md:hidden text-white">
        {user?.name}
      </p>

      {/* Navigation Links */}
      <div className="w-full mt-6">
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === "/admin"}
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-3 w-full py-3 md:pl-10 text-gray-400 transition-all ${
                isActive
                  ? "bg-primary/15 text-primary"
                  : "hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className="w-5 h-5" />
                <p className="max-md:hidden">{link.name}</p>

                {isActive && (
                  <span className="w-1.5 h-10 rounded-l absolute right-0 bg-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default AdminSidebar;