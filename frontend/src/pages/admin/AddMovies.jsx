import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/admin/Title";
import { CheckIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";

function AddMovies(){

    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const fetchNowPlayingMovies = async () => {
        setNowPlayingMovies(dummyShowsData);
    }

    useEffect(()=> {
        fetchNowPlayingMovies();
    })

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Movies"/>
            <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
            <div className="overflow-x-auto pb-4 no-scrollbar">
                <div className="group flex flex-wrap gap-4 mt-4 w-max">
                    {nowPlayingMovies.map((movie)=>(
                        <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
                        onClick={()=>setSelectedMovie(movie.id)}>
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={movie.backdrop_path} alt="" className="w-full object-cover brightness-90 h-60" />
                                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                    <p className="flex items-center gap-1 text-gray-400">
                                        <StarIcon className="w-4 h-4 text-primary fill-primary" />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className="text-gray-300">{kConverter(movie.vote_count)}Votes</p>
                                </div>
                            </div>
                            {selectedMovie === movie.id && (
                                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                            )}
                            <p className="font-medium truncate">{movie.title}</p>
                            <p className="text-gray-400 text-sm">{movie.release_date}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer">Add Movie</button>
        </>
    ) : (
        <Loading/>
    )
}

export default AddMovies;