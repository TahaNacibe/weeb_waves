"use client"
import AnimeDetailsPage from "../components/main_details";
import AnimeEpisodesList from "../components/episodes_list";
import React, { useState, useEffect, Suspense } from 'react';
import { Play, Share2, Loader2 } from 'lucide-react';
import AnimeServices from '@/app/api/anime_services';
import { Anime } from '@/app/types/anime_type';
import { useSearchParams } from 'next/navigation';
import RecommendationSection from "../components/recomondation_widget";

export default function Home() {
  return (
    <Suspense>
    <HomePageContent />
  </Suspense>
  )
}


const HomePageContent = () => {
  const searchParams = useSearchParams();
  const animeId = searchParams.get("animeId")
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const anime_services = new AnimeServices();

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        if (animeId) {
          let data = await anime_services.getAnimeDetails(animeId);
          if (data) {
            setAnime(data.data);
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!anime) return null;

  const formatDuration = (duration: string) => {
    if (!duration) return '?m';
    const match = duration.match(/(\d+)/);
    return match ? `${match[1]}m` : '?m';
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = start ? new Date(start).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : '?';
    const endDate = end ? new Date(end).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }) : 'Present';
    return `${startDate} to ${endDate}`;
  };
  //* ui tree
	return (
        <section className="bg-black">
      <AnimeDetailsPage anime={anime} formatDateRange={formatDateRange(anime.aired?.from, anime.aired?.to)} formatDuration={formatDuration(anime.duration)} />
      <AnimeEpisodesList animeCover={anime.images.jpg.large_image_url} animeTitle={anime.title} />
      <RecommendationSection animeId={animeId} />
  </section>
	);
}