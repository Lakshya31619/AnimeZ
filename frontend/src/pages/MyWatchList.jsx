import React, { useEffect, useState } from "react";
import BlurCircle from "../components/BlurCircle";
import { dummyWatchList } from "../assets/assets";
import Loading from "../components/Loading";
import { StarIcon } from "lucide-react";

function MyWatchList(){

  const [watchList, setWatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyWatchList = async () => {
    setWatchList(dummyWatchList);
    setIsLoading(false);
  }

  useEffect(()=>{
    getMyWatchList()
  },[])

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px"/>
      <div>
        <BlurCircle top="0px" left="600px"/>
      </div>
      <h1 className="text-lg font-semibold mb-4">My Watch List</h1>
      {watchList.map((item, index)=>(
        <div key={index} className="flex flex-col md:flex-row justify-between bg-primary/8 border border-primary/20 rounded-lg mt-4 p-2 max-w-3xl">
          <div className="flex flex-col md:flex-row">
            <img src={item.show.movie.backdrop_path} alt=""
            className="w-[350px] h-[200px] object-cover rounded"/>
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">{item.show.movie.runtime}</p>
              <p className="flex items-center gap-1 text-sm text-gray-400 mt-auto">
                <StarIcon className="w-4 h-4 text-primary fill-primary"/>
                {item.show.movie.vote_average.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading/>
  )
};

export default MyWatchList;