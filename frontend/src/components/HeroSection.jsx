import React from 'react';
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";

function HeroSection(){

    const navigate = useNavigate();

    return(
        <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 
        bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
            <img src='/animeLogo.png' alt='' className='max-h-30 lg:h-30 mt-20'/>
            <h1 className='text-5xl md:text-[70px] md:leading-18 font-semibold max-w-150'>
                Dragon Ball Super <br/> Broly
            </h1>
            <div className='flex items-center gap-4 text-gray-300'>
                <span>Action | Science Fiction | Martial Arts</span>
                <div className='flex items-center gap-1'>
                    <CalendarIcon className='w-4.5 h-4.5'/> 2018
                </div>
                <div className='flex items-center gap-1'>
                    <ClockIcon className='w-4.5 h-4.5'/> 1h 40m
                </div>
            </div>
            <p className='max-w-md text-gray-300'>Dragon Ball Super: Broly" follows Goku and Vegeta as they encounter Broly, a Saiyan exiled from Planet Vegeta, now seeking revenge. The film explores the Saiyan history and Broly's origin story, culminating in a powerful clash between Broly and the Z fighters. Expect intense battles and a deeper look into Saiyan lore. </p>
            <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary-dull transition rounded-full font-medium cursor-pointer'>
                Explore Movies
                <ArrowRight className='w-5 h-5'/>
            </button>
        </div>
    )
}

export default HeroSection;