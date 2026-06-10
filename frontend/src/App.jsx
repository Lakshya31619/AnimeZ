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
import Search from "./pages/Search";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddMovies from "./pages/admin/AddMovies";
import Characters from "./pages/admin/Characters";
import AddMoments from "./pages/admin/AddMoments";

import Moments from "./pages/Moments";
import CharacterMoments from "./pages/CharacterMoments";
import CharacterDetails from "./pages/CharacterDetails";
import Shows from "./pages/Shows";
import SeriesEpisodes from "./pages/SeriesEpisodes";
import EpisodePlayer from "./pages/EpisodePlayer";
import AddEpisodes from "./pages/admin/AddEpisodes";
import ManageComments from "./pages/admin/ManageComments";
import Ballpedia from "./pages/Ballpedia";

import { useAppContext } from "./context/AppContext";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const { user, loading } = useAppContext();

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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/my-watchlist" element={<MyWatchList />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/search" element={<Search />} />
        <Route path="/moments" element={<Moments />} />
        <Route path="/moments/:character" element={<CharacterMoments />} />
        <Route path="/character/:character" element={<CharacterDetails />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/shows/:series" element={<SeriesEpisodes />} />
        <Route path="/shows/:series/episode/:id" element={<EpisodePlayer />} />
        <Route path="/ballpedia" element={<Ballpedia />} />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/*"
          element={
            loading ? (
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-xl font-semibold">Loading...</h1>
              </div>
            ) : !user ? (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl="/admin" />
              </div>
            ) : user.role === "admin" ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-red-600">
                  Access Denied
                </h1>
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-movies" element={<AddMovies />} />
          <Route path="characters" element={<Characters />} />
          <Route path="add-moments" element={<AddMoments />} />
          <Route path="add-episodes" element={<AddEpisodes />} />
          <Route path="comments" element={<ManageComments />} />

        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;