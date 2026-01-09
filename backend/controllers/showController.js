import Movie from '../models/Movie.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

export const getNowPlayingMovies = (req, res) => {
    try {
        const movies = data;
        res.json({ success: true, movies });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
    try {
        const { movieId } = req.body;

        let movie = await Movie.findById(movieId);

        if (!movie) {
            const movieApiData = data.find((m) => m._id === movieId);
            if (!movieApiData) {
                return res.status(404).json({ success: false, message: 'Movie not found in local data.' });
            }

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                backdrop_path: movieApiData.backdrop_path,
                movie_link: movieApiData.movie_link,
                genres: movieApiData.genres,
                casts: movieApiData.cast,
                release_date: movieApiData.release_date,
                original_language: movieApiData.original_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
            };

            await Movie.create(movieDetails);
        }

        res.json({ success: true, message: 'Movie added successfully.' });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

