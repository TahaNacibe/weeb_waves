"use client";
import { useParams, useRouter, useSearchParams,  } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import AnimeServices from '@/app/api/anime_services';
import Pagination from '@/app/types/pagenation_type';
import { Anime } from '@/app/types/anime_type';
import AnimeWidget from '@/app/components/anime_item_widget';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import ErrorWidget from '@/app/error/error_widget';
import LoadingWidget from '@/app/loading/loading_widgets';

const AnimeListDisplay = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = params;
    const typesOfLists: string[] = ["This Season", "Today Anime", "Top Anime", "Filter"];
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : '';
    
    // Get page from URL using useSearchParams
    const currentPageFromUrl = Number(searchParams.get('page')) || 1;

    // State management
    const [pagination, setPagination] = useState<Pagination>();
    const [animeList, setAnimeList] = useState<Anime[]>();
    const [currentPage, setCurrentPage] = useState<number>(currentPageFromUrl);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFiltered, setFilteredState] = useState(false)

    // Get Current Filter name
    const currentFilterName = String(searchParams.get("genre")) || "N/A";
    const currentFilterId = Number(searchParams.get("genreId")) || null;
    const currentTypeOfItems = String(searchParams.get("type")) || null;
    const currentStateOfItems = String(searchParams.get("status")) || null;
    const anime_service = new AnimeServices()

    // Fetch data with pagination
    const fetchData = async (page: number = 1) => {
        setIsLoading(true);
        try {
            let response;
            switch (decodedId) {
                case typesOfLists[0]:
                    response = await anime_service.getThisSeasonAnimeWithPage(page);
                    break;
                case typesOfLists[1]:
                    response = await anime_service.getAnimeSchedularWithPage(page);
                    break;
                case typesOfLists[2]:
                    response = await anime_service.getTopAnimeListWithPage(page);
                    break;
                case typesOfLists[3]:
                    setFilteredState(true)
                    response = await anime_service.getFilteredAnimeList(currentFilterId,currentTypeOfItems,currentStateOfItems,page);
                    break;
                default:
                    return;
            }

            if (response) {
                setAnimeList(response.data);
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error fetching anime:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Update currentPage when URL changes
    useEffect(() => {
        setCurrentPage(currentPageFromUrl);
    }, [currentPageFromUrl]);

    // Fetch data when currentPage or decodedId changes
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, decodedId,searchParams]);

    // Handle page change
    const handlePageChange = (page: number) => {
         // Get the current URL
    const currentUrl = window.location.href;

    // Create a URL object to easily manipulate the URL
    const url = new URL(currentUrl);

    // Update or add the page parameter
        url.searchParams.set('page', page.toString()); // Ensure it's a string
        router.push(url.toString())
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Page numbers generation for pagination
    const getPageNumbers = () => {
        if (!pagination?.lastVisiblePage) return [];

        const pages: (number | string)[] = [];
        const maxPage = pagination.lastVisiblePage;

        pages.push(1);

        let start = Math.max(2, currentPage - 2);
        let end = Math.min(maxPage - 1, currentPage + 2);

        if (start > 2) pages.push('...');

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < maxPage - 1) pages.push('...');
        if (maxPage > 1) pages.push(maxPage);

        return pages;
    };

    const getThePageTitle = () => {
        const genre = isFiltered ? currentFilterName != "null"? currentFilterName : "" :  decodedId;
        const type = currentTypeOfItems != "null"? currentTypeOfItems : "";
        const state = currentStateOfItems != "null"? currentStateOfItems : "";
    
        return `${genre}${type ? ` | ${type}` : ""}${state ? ` | ${state}` : ""}`;
    };
    

    const screenWidgetBody = () => {
        if (!animeList) {
            {/* error case */ }
            return (<ErrorWidget type={1} title='Something Happened!' message={`Something went wrong here`} />)
        } else {
            if (animeList.length == 0) {
                {/* empty case */ }
                return (<ErrorWidget type={1} title='No Anime?' message={isFiltered? `Seems Theres No Anime With Tags you choose`:`Something went wrong here`} />)
            } else {
                {/* normal case */ }
                return (<div>
                    <>
                    {/* Grid Layout */}
                    <div className="grid grid-cols-2 -m-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                        {animeList?.map((elem, index) => (
                            <div 
                                key={`${elem.mal_id}-${index}`}
                                className="transform hover:scale-105 transition-transform duration-200"
                            >
                                <AnimeWidget 
                                    anime={elem} 
                                    isRanked={decodedId === "Top Anime" || isFiltered} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.lastVisiblePage > 1 && (
                        <div className="flex justify-center mt-12">
                            <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-2 shadow-lg">
                                <button
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsLeft className="w-5 h-5 text-white" />
                                </button>

                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5 text-white" />
                                </button>

                                <div className="flex gap-1">
                                    {getPageNumbers().map((page, index) => (
                                        page === '...' ? (
                                            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                                                {page}
                                            </span>
                                        ) : (
                                            <button
                                                key={`page-${page}`}
                                                onClick={() => handlePageChange(page as number)}
                                                className={`
                                                    px-3 py-1 rounded-md min-w-[2.5rem]
                                                    transition-colors duration-200
                                                    ${currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-700 text-gray-300'}
                                                `}
                                            >
                                                {page}
                                            </button>
                                        )
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.lastVisiblePage}
                                    className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5 text-white" />
                                </button>

                                <button
                                    onClick={() => handlePageChange(pagination.lastVisiblePage)}
                                    disabled={currentPage === pagination.lastVisiblePage}
                                    className="p-1 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronsRight className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
                </div>)
            }
        }
    }

    return (
        <div className="bg-gray-900 rounded-lg p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {getThePageTitle()}
                        </h1>
                        {pagination && (
                            <p className="text-gray-400 text-sm">
                                Showing page {currentPage} of {pagination.lastVisiblePage}
                            </p>
                        )}
                    </div>
                    
                    {isFiltered && (
                        <Link 
                            href="/anime/This Season"
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                        >
                            Clear Filter
                        </Link>
                    )}
                </div>
                <div className="h-1 w-20 bg-blue-500 rounded mt-4"></div>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="flex justify-start items-center min-h-[50vh]">
                    <div className="relative">
                    <LoadingWidget width='md:w-1/4 w-full -mx-8' />
                    </div>
                </div>
            ) : 
                screenWidgetBody()
            }
        </div>
    );
};

const AnimeListDisplayPage = () => {
    return (
        <Suspense>
        <AnimeListDisplay />
      </Suspense>
    )
}

export default AnimeListDisplayPage;