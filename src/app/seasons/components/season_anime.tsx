"use client";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import AnimeServices from '@/app/api/anime_services';
import Pagination from '@/app/types/pagenation_type';
import { Anime } from '@/app/types/anime_type';
import AnimeWidget from '@/app/components/anime_item_widget';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import LoadingWidget from '@/app/loading/loading_widgets';
import ErrorWidget from '@/app/error/error_widget';

const SearchListDisplay = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = params;
    const decodedId = typeof id === 'string' ? decodeURIComponent(id) : '';

    // Get page from URL using useSearchParams
    const currentPageFromUrl = Number(searchParams.get('page')) || 1;
    const seasonQuery = String(searchParams.get('season')) || "";
    const yearQuery = Number(searchParams.get('year')) || 2024;
    const filterTag = String(searchParams.get("filter")) || "";

    // State management
    const [pagination, setPagination] = useState<Pagination>();
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(currentPageFromUrl);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [season, setSeason] = useState<string>(seasonQuery);
    const [year, setYear] = useState<number>(yearQuery);
    const [isFiltered, setFilteredState] = useState<boolean>(false);

    // Get Current Filter name
    const currentFilterName = String(searchParams.get("genre")) || "N/A";
    const anime_service = new AnimeServices();

    const setFilterOn = () => {
        setFilteredState(filterTag === "filter");
    };

    // Fetch data with pagination
    const fetchData = async (page: number = 1) => {
        setIsLoading(true);
        setFilterOn();
        try {
            let response;
            if (isFiltered) {
                response = await anime_service.getSeasonDataFiltered(season, year, page);
            } else {
                response = await anime_service.getSeasonData(page, season, year);
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

    // Update season and year states when searchParams change
    useEffect(() => {
        const newSeason = String(searchParams.get('season')) || "";
        const newYear = Number(searchParams.get('year')) || 0;
        setSeason(newSeason);
        setYear(newYear);
    }, [searchParams]);

    // Fetch data when currentPage or any filter changes
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, season, year, isFiltered]);

    // Handle page change
    const handlePageChange = (page: number) => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);

        url.searchParams.set('page', page.toString());
        router.push(url.toString());
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
        const genre = isFiltered ? currentFilterName : decodedId;
        return `${season} ${year} | ${genre}`;
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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
                                                className={`px-3 py-1 rounded-md min-w-[2.5rem] transition-colors duration-200 ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'hover:bg-gray-700 text-gray-300'
                                                }`}
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
                            href={`/seasons/Season?year=${year}&season=${season}`}
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
                <LoadingWidget width='w-1/4' />
                </div>
            </div>
            ) : (
                screenWidgetBody()
            )}
        </div>
    );
};

export default SearchListDisplay;
