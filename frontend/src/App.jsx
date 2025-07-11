import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import MyWatchList from "./pages/MyWatchList";
import Favorite from "./pages/Favorite";
import {Toaster} from 'react-hot-toast';
import Footer from "./components/Footer";
import Layout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import AddMovies from "./pages/admin/AddMovies";
import ListMovies from "./pages/admin/ListMovies";


function App(){

  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  return (
    <>
      <Toaster/>
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/my-watchlist' element={<MyWatchList/>} />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path="/admin/*" element={<Layout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-movies" element={<AddMovies/>}/>
          <Route path="list-movies" element={<ListMovies/>}/>
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  );
};

export default App;