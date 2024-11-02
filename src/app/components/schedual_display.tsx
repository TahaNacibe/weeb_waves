import React, { useState, useEffect } from 'react';
import { Anime } from '../types/anime_type';
import DateTimeService from '../services/date_service';
import { ArrowRight } from 'lucide-react';
import AnimeServices from '../api/anime_services';
import LoadingSkeleton from '../loading/loading_schedual';
import Link from 'next/link';

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const date_service = new DateTimeService();

export default function ScheduleDisplay({ schedule, anime_services }: { schedule: Array<Anime[]>, anime_services: AnimeServices }) {
    const getCurrentDay = () => {
        const dayIndex = new Date().getDay();
        return days[dayIndex];
    };

    const [selectedDay, setSelectedDay] = useState<string>(getCurrentDay());
    const [isLoading, setLoading] = useState<boolean>(true);
    const [currentSchedule, setCurrentSchedule] = useState<Array<any>>(schedule); // State for current day's schedule

    useEffect(() => {
        const getData = async () => {
            setLoading(true); // Start loading state
            const scheduleProgram: Array<Anime> | null = await anime_services.getAnimeSchedulerForTheDay(selectedDay);
            if (scheduleProgram) {
                setCurrentSchedule(scheduleProgram); // Update the current schedule state
            } else {
                setCurrentSchedule([]); // Reset schedule if no data
            }
            setLoading(false); // End loading state
        };

        getData(); // Fetch data on initial load or when selectedDay changes
    }, [selectedDay, anime_services]); // Dependency array includes selectedDay

    return (
        <div className="w-full p-6">
            {/* Day selector tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)} // Update selected day on button click
                        className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${selectedDay === day ? 'bg-[#181D2B] text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                ))}
            </div>

            {/* Schedule display */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-6">
                    {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}'s Schedule
                </h2>
                
                {isLoading ? (
                    <LoadingSkeleton />
                ) : currentSchedule.length > 0 ? (
                    <div className="space-y-3">
                        {currentSchedule.map((anime: Anime, index) => (
                            <div
                                key={anime.title}
                                className="group relative overflow-hidden rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <Link href={`/details/${anime.mal_id}?animeName=${anime.title}&animeId=${anime.mal_id}`}>
                                {/* Background Image Layers */}
                                {anime.images?.jpg?.large_image_url && (
                                    <div className="absolute inset-0">
                                        {/* Blurred background layer */}
                                        <div 
                                            className="absolute inset-0 opacity-30 blur-md"
                                            style={{
                                                backgroundImage: `url(${anime.images.jpg.large_image_url})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        />
                                        {/* Focused side image with gradient fade */}
                                        <div 
                                            className="absolute left-0 top-0 bottom-0 opacity-40 w-1/2"
                                            style={{
                                                background: `linear-gradient(to right, 
                                                    rgba(0,0,0,0) 0%,
                                                    rgba(0,0,0,0) 10%,
                                                    rgba(0,0,0,0.6) 90%,
                                                    rgba(0,0,0,0.8) 100%
                                                ), url(${anime.images.jpg.large_image_url})`,
                                                backgroundSize: 'cover',
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'center',
                                                maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                                                WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Content Container */}
                                <div className="relative flex items-center min-h-24">
                                     {/* Number indicator with teardrop effect */}
                                     <div className="absolute -top-1 left-6">
                                        <div className="relative">
                                            <div className="w-12 h-20 bg-black rounded-b-full flex items-start justify-center pt-2 shadow-lg">
                                                <span className="text-lg text-white font-bold">{index + 1}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main content area */}
                                    <div className="flex flex-grow items-center justify-between pl-20 pr-4 py-4">
                                        {/* Anime info */}
                                        <div className="flex-grow max-w-xl">
                                            <h3 className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                                                {anime.title}
                                            </h3>
                                            
                                            {anime.genres && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {anime.genres.slice(0, 3).map((genre, idx) => (
                                                        <span 
                                                            key={idx}
                                                            className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300"
                                                        >
                                                            {genre.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right side: Watch Button */}
                                        {anime.aired && (
                                            <div className="flex items-center gap-4">
                                                <button 
                                                    className="flex items-center justify-evenly w-32 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group-hover:scale-105"
                                                >
                                                <div className="text-sm text-gray-400">
                                                    {date_service.getCurrentEpisode(anime.aired.from, anime.airing, anime.episodes)}
                                                </div>
                                                    <ArrowRight className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    </div>
                                    </Link>

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-800/30 rounded-lg">
                        <p className="text-gray-400">No shows scheduled for {selectedDay}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
