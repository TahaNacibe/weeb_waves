"use client"
import { FC } from "react"
import EpisodeItem from "./episode_item"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import AnimeServices from "@/app/api/anime_services"
import Episode from "@/app/types/episode_type"
import EpisodePagination from "@/app/types/epidsodes_pagenation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Anime } from "@/app/types/anime_type"
import AnimeWidget from "@/app/components/anime_item_widget"
import InfoItem from "@/app/components/information_label"
import RelatedAnimeSection from "./related_col"
import LoadingRelatedWidget from "@/app/loading/loading_related"
import ErrorWidget from "@/app/error/error_widget"
import LoadingWidget from "@/app/loading/loading_widgets"
import LoadingEpisode from "@/app/loading/loading_episode"

type AnimeEpisodeListType = {
    animeTitle: string
    animeCover: string
}

const PaginationWidget: FC<{
    pagination: EpisodePagination
    currentPage: number
    onPageChange: (page: number) => void
}> = ({ pagination, currentPage, onPageChange }) => {
    const generatePageNumbers = () => {
        const pages: number[] = []
        const maxPagesToShow = 5

        if (pagination.lastVisiblePage <= maxPagesToShow) {
            return Array.from({length: pagination.lastVisiblePage}, (_, i) => i + 1)
        }

        pages.push(1)
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(pagination.lastVisiblePage - 1, currentPage + 1)

        if (start > 2) {
            pages.push(-1)
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (end < pagination.lastVisiblePage - 1) {
            pages.push(-1)
        }

        if (pagination.lastVisiblePage > 1) {
            pages.push(pagination.lastVisiblePage)
        }

        return pages
    }

    if (!pagination || pagination.lastVisiblePage <= 1) {
        return null
    }

    return (
        <div className="flex items-center justify-center space-x-2 py-6 bg-black">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center bg-black">
                {generatePageNumbers().map((page, index) => {
                    if (page === -1) {
                        return (
                            <div key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                                ...
                            </div>
                        )
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`
                                px-4 py-2 mx-1 rounded-md transition-colors duration-200
                                ${currentPage === page 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                            `}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pagination.lastVisiblePage}
                className="p-2 rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )
}

const AnimeEpisodesList: FC<AnimeEpisodeListType> = ({ animeTitle, animeCover }) => {
    const anime_services = new AnimeServices()
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentAnimeId: string | null = searchParams.get("animeId") || null
    const currentPage: number = Number(searchParams.get("pageId")) || 1
    const [episodesList, setEpisodesList] = useState<Episode[]>([])
    const [pagination, setPagination] = useState<EpisodePagination>()
    const [isLoading, setIsLoading] = useState(true)
    const [isRelatedLoading, setIsRelatedLoading] = useState(true)
    const [relatedList, setRelatedList] = useState<Anime[]>([])

    useEffect(() => {
        const getEpisodesList = async () => {
            setIsLoading(true)
            try {
               const result = await anime_services.getAnimeEpisodesWithPage(currentPage, currentAnimeId)
                    if (!result || !result.data) {
                        getEpisodesList()
                    }
                    setEpisodesList(result!.data)
                    setPagination(result!.pagination)

            } catch (error) {
                console.error("Failed to fetch episodes:", error)
            } finally {
                setIsLoading(false)
            }
        }
    
        const getRelatedAnime = async () => {
            setIsRelatedLoading(true)
            try {
                anime_services.getRelatedAnime(currentAnimeId).then((data) => {

                    if (data) {
                        setRelatedList(data)
                        setIsRelatedLoading(false)
                    }
                })
            } catch (error) {
                setIsRelatedLoading(false)
                console.error("Failed to fetch related anime:", error)
            }
        }
    
        getEpisodesList()
        getRelatedAnime()
    }, [currentPage, currentAnimeId, searchParams]) // Add `searchParams` here
    

    const handlePageChange = (newPage: number) => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set("pageId", newPage.toString())
        if (currentAnimeId) {
            newParams.set("animeId", currentAnimeId)
        }
        router.push(`?${newParams.toString()}`)
    }


     const episodesWidget = () => {
        if (isLoading) {
            return (
                <div className="w-full">
                  <LoadingEpisode />  
                </div>
                )
        } else {
            return (
                <div>
                {/* pagination */}
            {pagination && (
                <PaginationWidget 
                    pagination={pagination}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
                )}
                {/* episodes */}
            
                <div className="flex flex-row bg-black px-2 py-4">
                {/* load in case exist */}
                    {episodesList.length > 0 ?
                    <div className="grid grid-cols-5 shrink-0 h-full gap-4 px-6 w-full">
                    {episodesList.map((ep) => (
                        <div key={ep.number}>
                            <EpisodeItem item={ep} url={animeCover} />
                        </div>
                    ))}
                        </div>
                        : (
                            //*  error widget in case it's empty
                                <div className="flex flex-row flex-grow w-full">
                                    <ErrorWidget type={1} isEpisode={true} title="No Episode Available" message="Seems like there's no episodes For That Anime" />
                            </div>)}
            </div>
            </div>
            )
        }
    }


    return (
        <div className="flex flex-col overflow-x-hidden">
            <h1 className="px-4 py-2 text-2xl">
                Episodes 
            </h1>
            {/* episodes section and related */}
            <div className="flex flex-row w-[100%] pr-2">

           {episodesWidget()}
        <RelatedAnimeSection relatedList={relatedList} isLoading = {isRelatedLoading} />
            </div>
        </div>
    )
}

export default AnimeEpisodesList