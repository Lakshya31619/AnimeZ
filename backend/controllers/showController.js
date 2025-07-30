import data from '../data.json' assert { type: 'json' };
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

export const getNowPlayingMovies = (req, res) => {
    try {
        const movies = data;
        res.json({success: true, movies: movies});
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
};

//API to add a new show to the database
export const addShow = async(req, res)=>{
    try{
        const {movieId, showsInput} = movie;
        let movie = await Movie.findById(movieId);
        if(!movie){
            //Fetch movie details
            const movieApiData = data;
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
                runtime: movieApiData.runtime,
            }

            // Add movie to the database
            movie = await Movie.create(movieDetails);
        }
        const showsToCreate = [];
        showsInput.forEach(show=>{
            showsToCreate.push({
                movie: movieId,
            })
        });
        if(showsToCreate.length>0){
            await Show.insertMany(showsToCreate);
        }
        res.join({success: true, message: 'Show Added successfully.'})
    } catch(error){
        console.log(error);
        res.join({success: false, message: error.message})
    }
}