"use client";
//* imports
import AnimeServices from "@/app/api/anime_services";
import React, { useEffect, useState } from "react";
import { Anime } from "../types/anime_type";
import AnimeScrollWidget from "../components/anime_items_scroll";
import CarouselDisplay from "../components/corassol_today";
import TitleBarWidget from "../standards/title_bars";
import ScheduleDisplay from "../components/schedual_display";
import DateTimeService from "../services/date_service";
import  LoadingWidget  from "../loading/loading_widgets";
import LoadingSkeleton from "../loading/loading_schedual";

export default function ThisSeasonAnimeAndMore() {
    // State for storing anime data, today's anime, and pagination
    const [animeData, setAnimeData] = useState<Anime[]>([]);
    const [todayAnime, setTodayAnime] = useState<Anime[]>([]);
    const [schedule, setSchedule] = useState<any>([]);
    const [topAnime, setTopAnime] = useState<Anime[]>([]);
    const [paginationData, setPaginationData] = useState<any>(null);
    const [seasonLoading, setSeasonLoading] = useState<boolean>(true);
    const [schedularLoading, setSchedulerLoading] = useState<boolean>(true);
    const [topLoading, setTopLoading] = useState<boolean>(true);
    const [todayLoading, setLoadingState] = useState<boolean>(true);
    
    // Instance of AnimeServices
    const anime_services = new AnimeServices();
    const date_services = new DateTimeService()

    // Get data on component mount
    useEffect(() => {
        const fetchAnimeData = async () => {
            try {
                const result = await anime_services.getThisSeasonAnime();
                const todayAnimeResult = await anime_services.getAnimeSchedular();
                const topAnimeList = await anime_services.getTopAnimeList();
                const scheduleProgram = await anime_services.getAnimeSchedulerForTheDay(date_services.getTheCurrentDay())
                
                if (result) {
                    setAnimeData(result.data);
                    setPaginationData(result.pagination);
                    setSeasonLoading(false)
                }
                if (todayAnimeResult) {
                    setTodayAnime(todayAnimeResult.data);
                    setSchedulerLoading(false)
                }
                if (topAnimeList) {
                    setTopAnime(topAnimeList.data)
                    setTopLoading(false)
                }
                if (scheduleProgram) {
                    setSchedule(scheduleProgram)
                    setLoadingState(false)
                }
            } catch (error) {
                console.error("Failed to fetch anime data:", error);
            } 
        };

        fetchAnimeData();
    }, []); // Empty dependency array to run only on mount
    return (
        <section className="h-auto" id="Home">
            {/* carousel widget  */}
            {<CarouselDisplay todayAnimeList={todayAnime} />}
            {/* this season anime section */}
            {<TitleBarWidget title="This Season" />}
            {seasonLoading? <LoadingWidget /> : <AnimeScrollWidget animeList={animeData} isRanked={false} />}
            {/* this season anime section */}
            <TitleBarWidget title="Today Anime" />
            {schedularLoading? <LoadingWidget /> :<AnimeScrollWidget animeList={todayAnime} isRanked={false} />}
            {/* top season anime section */}
            <TitleBarWidget title="Top Anime" />
            {topLoading? <LoadingWidget /> : <AnimeScrollWidget animeList={topAnime} isRanked={true} />}
            {/* top season anime section */}
            <div>
                {todayLoading ? (
                    <div className="px-6 py-8 flex flex-col">
                        <h1 className="text-2xl p-4">Getting Schedule</h1>
                        <LoadingSkeleton />
            </div>
            ) : <ScheduleDisplay schedule={schedule} anime_services={anime_services} />}
</div>

        </section>
    );
}


