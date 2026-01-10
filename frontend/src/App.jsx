import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SignIn } from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import MyWatchList from "./pages/MyWatchList";
import Favorite from "./pages/Favorite";

import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddMovies from "./pages/admin/AddMovies";

import { useAppContext } from "./context/AppContext";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const { user } = useAppContext();

  return (
    <>
      <Toaster />

      {/* Public Layout */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <Sidebar />
        </>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/my-watchlist" element={<MyWatchList />} />
        <Route path="/favorite" element={<Favorite />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl="/admin" />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-movies" element={<AddMovies />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
