import mongoose from "mongoose";
const movieSchema = new mongoose.Schema(
{
  title: { type: String, required: true },
  overview: { type: String, required: true },
  logo: { type: String },
  backdrop_path: { type: String, required: true },
  background_path: { type: String },
  movie_link: { type: String, required: true },
  release_date: { type: String, required: true },
  original_language: { type: String, required: true },
  tagline: { type: String },
  genres: { type: Array, required: true },
  casts: { type: Array, required: true },
  vote_average: { type: Number, required: true },
  runtime: { type: String, required: true }
},
{ timestamps: true }
);
const Movie = mongoose.model("Movie", movieSchema);
export default Movie;