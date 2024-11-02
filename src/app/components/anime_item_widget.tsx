"use client"
import { Play } from 'lucide-react'
import { Anime } from "../types/anime_type";
import { FC } from "react";
import TagLabel from "./tag_label";
import Link from 'next/link';

//* parameters type
type AnimeWidgetType = {
    anime: Anime;
    isRanked: boolean
}

type AnimeTitleBar = {
    title: string;
}

//* widget body
const AnimeWidget: FC<AnimeWidgetType> = ({ anime, isRanked }) => {
    return (
        <Link href={`/details/${anime.mal_id}?animeName=${anime.title}&animeId=${anime.mal_id}`}>
        <div className="group relative">
            {/* Main widget container */}
            <div className="relative flex flex-col shadow-xl transition-all duration-300 group-hover:bg-opacity-20">
                {/* Status tag at top */}
                <div className="absolute top-0 left-0 z-30">
                    <TagLabel color="colorTab" content={anime.status} />
                </div>
                {/* rank tag */}
                {isRanked? (
                    <div className="absolute bottom-14 left-0 z-30 rounded-r-3xl bg-gray-900 pr-4">
                       {/* rank tag */}
                 <h1 className="p-1 font-extralight text-base text-center items-center self-center">
                                {`# ${anime.rank ?? "N/A"}`}
                            </h1>
                </div>) : null}

                {/* Image container with relative positioning */}
                <div className="relative w-full h-72">
                    {/* Cover image */}
                    <img 
                        src={`${anime.images.jpg.large_image_url}`}
                        alt={anime.title}
                        draggable="false"
                        className="w-full h-full object-cover group-hover:opacity-20"
                    />
                    
                    {/* Type tag with absolute positioning relative to image container */}
                    <div className="absolute -bottom-5 right-4 z-30">
                        <TagLabel color="bg-indigo-800" content={anime.type} />
                    </div>
                </div>

                {/* Title bar */}
                <AnimeWidgetInfoBar title={anime.title} />
            </div>

            {/* Hover details overlay - appears on hover, stays clear*/}
            <div className="absolute inset-0 z-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-1">
                <div className=" rounded-lg bg-gray-950 bg-opacity-50 flex flex-col justify-between moreSize -mx-2 p-2 ">
                    <h3 className="text-lg font-semibold text-white mb-2">{anime.title}</h3>
                    <div className="space-y-2 text-sm text-gray-200">
                        {anime.synopsis && (
                            <p className="line-clamp-2">{anime.synopsis}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {anime.genres?.map((genre, index) => (
                                <span 
                                    key={index}
                                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-white">
                        <span 
                                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs"
                                >Score: {anime.score || 'N/A'}</span>
                             <span 
                                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs"
                                >Episodes: {anime.episodes || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Hover details overlay - appears on hover, stays clear */}
            <div className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 justify-center flex justify-self-center bottom-20 items-center transition-opacity duration-300">
                <Play></Play>
            </div>
        </div></Link>
        
    );
}

export default AnimeWidget;

const AnimeWidgetInfoBar: FC<AnimeTitleBar> = ({ title }) => {
    return (
        <div className="px-1 py-4 shadow-xl bg-gray-950">
            <h2 className="line-clamp-1 text-center text-sm font-semibold">
                {title}
            </h2>
        </div>
    );
}

