import { Anime } from "../types/anime_type";
import Pagination from "../types/pagenation_type";
import DateTimeService from "../services/date_service";
import { cache } from "react";
import Episode from "../types/episode_type";
import EpisodePagination from "../types/epidsodes_pagenation";
import RecommendationItem from "../types/recomandation_type";

class AnimeServices {
    // Maximum number of retry attempts for rate-limited requests
    private maxRetries: number = 10;

    // Method to fetch data with retry logic
    private async fetchWithRetry(url: string): Promise<any> {
        let retries = 0;
    
        while (retries < this.maxRetries) {
            try {
                const res = await fetch(url);
    
                // Check for rate-limiting before parsing JSON
                if (res.status === 429) {
                    retries++; // Increment retries on rate-limit
                    console.warn(`Rate limit hit. Retrying... (${retries}/${this.maxRetries})`);
                    // Wait for a certain amount of time before retrying
                    await this.delay(1000 * retries); // Wait 1 second multiplied by the number of retries
                    continue; // Retry the request after waiting
                }
    
                // If the response is ok (status in the range of 200-299), proceed to parse it
                if (res.ok) {
                    return await res.json();
                } else {
                    console.error(`Non-429 error encountered: ${res.status}`);
                    // If it's a non-recoverable error, we can exit the loop
                    break; // Exit loop on non-429 error
                }
            } catch (err) {
                console.error("Fetch failed:", err);
                retries++; // Increment retries if there's an error during fetch
                console.warn(`Fetch error encountered. Retrying... (${retries}/${this.maxRetries})`);
                await this.delay(1000 * retries); // Wait before retrying
            }
        }
    
        // If we exit the loop without a successful fetch, throw an error
        throw new Error(`Failed to fetch data after ${this.maxRetries} retries`);
    }
    
    // Helper function to create a delay
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
	

    // Get this season anime list
    getThisSeasonAnime = async (): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/seasons/now`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };
    // Get this season anime list
    getThisSeasonAnimeWithPage = async (page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/seasons/now?page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };

    // Get top anime list
    getTopAnimeList = async (): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/top/anime`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getTopAnimeList.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);
        return { data, pagination };
    };
    // Get top anime list
    getTopAnimeListWithPage = async (page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/top/anime?page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getTopAnimeList.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);
        return { data, pagination };
    };

    // Get anime scheduler list
    getAnimeSchedular = cache(async (): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const date_service = new DateTimeService();
        const day: string = date_service.getTheCurrentDay();
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/schedules/${day}?kids=false&sfw=true`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getAnimeSchedular.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    });
    // Get anime scheduler list
    getAnimeSchedularWithPage = cache(async (page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const date_service = new DateTimeService();
        const day: string = date_service.getTheCurrentDay();
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/schedules/${day}?kids=false&sfw=true?page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getAnimeSchedular.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    });
    
    // Get anime scheduler list for a specific day
getAnimeSchedulerForTheDay = cache(async (day: string): Promise<Anime[] | null> => {
    const validDays: string[] = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    // Check if the provided day is valid
    if (!validDays.includes(day)) {
        console.warn(`Invalid day provided: ${day}. Expected one of ${validDays.join(', ')}`);
        return null;  // Early exit if day is invalid
    }

    let dayData: Anime[] = [];
    const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/schedules/${day}?kids=false&sfw=true&page=1&limit=20`);

    // Check if response and data are defined to prevent errors
    if (!response || !response.data) {
        console.warn(`Data is undefined for ${day} in getAnimeScheduler.`);
        return null;  // Exit if no data
    }

    // Collect first page data
    dayData = response.data.map((item: any) => new Anime(item));

    // Pagination handling
    const pagination = new Pagination(response.pagination);
    for (let pageIndex = 2; pageIndex <= pagination.lastVisiblePage; pageIndex++) {
        const pageResponse = await this.fetchWithRetry(`https://api.jikan.moe/v4/schedules/${day}?kids=false&sfw=true&page=${pageIndex}&limit=20`);

        // Check if response and data are defined to prevent errors
        if (!pageResponse || !pageResponse.data) {
            console.warn(`Data is undefined for page ${pageIndex} of ${day} in getAnimeScheduler.`);
            break;  // Exit pagination loop for this day
        }

        // Append page data to dayData
        dayData.push(...pageResponse.data.map((item: any) => new Anime(item)));
    }

    // Return the day's data wrapped in an object with the day as the key
    return dayData.length > 0 ? dayData  : null;
});


	// Get this season anime list
    getFilteredAnimeList = async (genreId: number | null, typeId: string | null, statusId : string | null, page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const typeParm = typeId != "null" ? `&type=${typeId}` : ""
        const statusParm = statusId != "null" ? `&status=${statusId}` : ""
        const genreParm = genreId ? `&genres=${genreId}` : "" 
        console.log(`url: https://api.jikan.moe/v4/anime?${genreParm}${typeParm}&order_by=score&sort=desc&page=${page}`)
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime?${genreParm}${typeParm}${statusParm}&order_by=score&sort=desc&page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };
	// Get this season anime list
    getFilteredMovieList = async (genreId: number | null, statusId : string | null, page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const statusParm = statusId != "null" ? `&status=${statusId}` : ""
        const genreParm = genreId ? `&genres=${genreId}` : "" 
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime?${genreParm}${statusParm}&type=movie&order_by=score&sort=desc&page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };

        // Get movies by top list
        getMoviesListByNewts = async (page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
            const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/top/anime?page=${page}&type=movie&order_by=start_date`
);
    
            // Check if response and data are defined to prevent errors
            if (!response || !response.data) {
                console.warn("Data is undefined in movies list.");
                return null;
            }
    
            const data = response.data.map((item: any) => new Anime(item));
            const pagination = new Pagination(response.pagination);
            return { data, pagination };
    };
    
    // Get this season anime list
    getSearchResultByTerm = async (page: number,searchTerm: string): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime?q=${searchTerm}&page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };

    // Get filtered search
    getFilteredSearchList = async (genreId: number | null, typeId: string | null, statusId : string | null, searchTerm : string , page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const typeParm = typeId != "null" ? `&type=${typeId}` : ""
        const statusParm = statusId != "null" ? `&status=${statusId}` : ""
        const genreParm = genreId ? `&genres=${genreId}` : "" 
        console.log("search for = ",`https://api.jikan.moe/v4/anime?q=${searchTerm}&${genreParm}${typeParm}${statusParm}&order_by=score&sort=desc&page=${page}`)
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime?q=${searchTerm}&${genreParm}${typeParm}${statusParm}&order_by=score&sort=desc&page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };
    // Get this season anime list
    getSeasonData = async (page: number,season: string, year: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        const data = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };

    // Get filtered search
    getSeasonDataFiltered = async ( season: string, year: number, page: number): Promise<{ data: Anime[]; pagination: Pagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/seasons/${year}/${season}?order_by=score&sort=desc&page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        let data: Array<Anime> = response.data.map((item: any) => new Anime(item));
        const pagination = new Pagination(response.pagination);

        return { data, pagination };
    };
    //* 
    getAnimeDetails = async (animeId: string): Promise<{data: Anime }| null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/full`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getThisSeasonAnime.");
            return null;
        }

        let data: Anime = new Anime(response.data);

        return { data};
    };

    //* get anime episodes by page
    getAnimeEpisodesWithPage = cache(async (page: number,id:string | null): Promise<{ data: Episode[]; pagination: EpisodePagination } | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime/${id}/episodes?page=${page}`);

        // Check if response and data are defined to prevent errors
        if (!response || !response.data) {
            console.warn("Data is undefined in getAnimeSchedular.");
            return null;
        }
        
        const data = response.data.map((item: any) => new Episode(item));
        const pagination = new EpisodePagination(response.pagination);

        return { data, pagination };
    });

    getRelatedAnime = async (animeId: string | null): Promise<Anime[] | null> => {
        try {
            if (!animeId) return null;
    
            const relatedAnimeDataList: Anime[] = [];
            const relatedAnime = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/relations`);
    
            if (!relatedAnime?.data) {
                console.warn("No related anime data found");
                return [];
            }
    
            // Process each relation sequentially
            for (const relation of relatedAnime.data) {
                if (relation.relation !== "Adaptation" && relation.relation !== "Character") {
                    // Create an array of promises for all entries in this relation
                    const entryPromises = relation.entry.map((elem : any) => 
                        this.getAnimeDetails(elem.mal_id.toString())
                    );
    
                    // Wait for all promises in this relation to resolve
                    const animeResults = await Promise.all(entryPromises);
    
                    // Filter out null results and add valid ones to the list
                    animeResults.forEach(result => {
                        if (result?.data) {
                            relatedAnimeDataList.push(result.data);
                        }
                    });
                }
            }
    
            console.log("Related anime count:", relatedAnimeDataList.length);
            return relatedAnimeDataList;
    
        } catch (error) {
            console.error("Error fetching related anime:", error);
            return null;
        }
    };

    //* get related anime 
    getRecommendedAnime = async (animeId: string | null) : Promise<RecommendationItem[] | null> => {
        const response = await this.fetchWithRetry(`https://api.jikan.moe/v4/anime/${animeId}/recommendations`);
        if (!response || !response.data) {
            return null
        }
            const data = response.data.map((item: any) => new RecommendationItem(item));
            return data
    }

}

export default AnimeServices;
