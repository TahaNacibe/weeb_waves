import { FC, useState } from 'react'
import { Star, Play, Hash, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import LoadingRelatedWidget from '@/app/loading/loading_related'
import ErrorWidget from '@/app/error/error_widget'

type RelatedAnimeProps = {
    relatedList: {
        mal_id: number
        title: string
        type: string
        episodes: number
        rank: number
        images: {
            jpg: {
                large_image_url: string
            }
        }
    }[],
    isLoading: boolean
}

const InfoItem: FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({
    icon,
    label,
    value
}) => (
    <div className="flex items-center gap-1 text-xs text-gray-400">
        {icon}
        <span className="font-medium">{value}</span>
    </div>
)

const ITEMS_PER_PAGE = 10;

const RelatedAnimeSection: FC<RelatedAnimeProps> = ({ relatedList, isLoading }) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const totalPages = Math.ceil(relatedList.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = relatedList.slice(startIndex, endIndex);
    const getTheDisplayWidget = () => {
        if (isLoading) {
            return (<LoadingRelatedWidget />)
        } else {
            if (relatedList.length == 0) {
                return (<ErrorWidget type={1} title='Nothing' message='Try refreshing the Page?' />)
            }

            //* ui
            return (
                <div>
                    <div className="flex flex-col">
        {currentItems.map((anime) => (
            <Link
                href={`/details/${anime.mal_id}?animeName=${anime.title}&animeId=${anime.mal_id}`}
                key={anime.mal_id}
                className="group hover:bg-white/10 rounded-lg transition-all duration-200 p-2 mx-1"
            >
                <div className="grid grid-cols-2">
                    {/* Image with overlay on hover */}
                    <div className="relative w-24 h-32 flex-shrink-0 ">
                        <img
                            src={anime.images.jpg.large_image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    
                    {/* Info section */}
                    <div className="flex flex-col justify-between flex-grow pr-4 md:pr-0">
                        {/* Title */}
                        <h2 className="text-sm font-medium text-white line-clamp-2 leading-snug mb-2 group-hover:text-blue-400 transition-colors duration-200">
                            {anime.title}
                        </h2>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap gap-3">
                            <InfoItem
                                icon={<Star className="w-3 h-3" />}
                                label="Type"
                                value={anime.type}
                            />
                            <InfoItem
                                icon={<Play className="w-3 h-3" />}
                                label="Episodes"
                                value={anime.episodes || 'N/A'}
                            />
                            <InfoItem
                                icon={<Hash className="w-3 h-3" />}
                                label="Rank"
                                value={`${anime.rank}`}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        ))}
    </div>

    {/* Pagination Controls */}
    {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2 text-gray-400">
            <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-xs">
                {currentPage}/{totalPages}
            </span>
            
            <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 hover:text-white disabled:opacity-50 disabled:hover:text-gray-400 transition-colors"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    )}
                </div>
            )
        }
    }
    return (
        <div className="w-full md:max-w-72 md:m-0 mx-4 bg-white/5 rounded-lg p-4 h-fit">
            <h1 className="text-xl font-semibold text-white mb-3">Related</h1>
            {getTheDisplayWidget()}
        </div>
    )
}

export default RelatedAnimeSection
