"use client"
import { useState, useEffect, FC,useRef } from "react";
import AnimeServices from "@/app/api/anime_services";
import { Play, ChevronLeft,ChevronRight } from "lucide-react";
import RecommendationItem from "@/app/types/recomandation_type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import LoadingWidget from "@/app/loading/loading_widgets";
import ErrorWidget from "@/app/error/error_widget";

// Define props type
interface RecommendationSectionProps {
    animeId: string | null;
}

const RecommendationSection: FC<RecommendationSectionProps> = ({ animeId }) => {
    let parentClass: string = "snap-x snap-proximity scroll-smooth"
    const animeServices = new AnimeServices();
    const searchParams = useSearchParams()
    const carouselRef = useRef<HTMLElement>(null);
    const [recommendedAnime, setRecommendedAnime] = useState<RecommendationItem[]>([]);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isSnapPossible, setSnapPossible] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getRecommendationAnime = async () => {
            if (animeId) {
                animeServices.getRecommendedAnime(animeId).then((data) => {
                    if (data) {
                        setRecommendedAnime(data);
                        setLoading(false)
                    }

                });
            }
        };
        getRecommendationAnime();
    }, [animeId,searchParams]); // Add animeId to the dependency array

    const mouseDown = (e: MouseEvent) => {
        e.preventDefault(); // Prevent default behavior
        setSnapPossible(false);
        setIsMouseDown(true);
        setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    };

    const mouseLeave = () => {
        setSnapPossible(true);
        setIsMouseDown(false);
    };

    const mouseUp = () => {
        setSnapPossible(true);
        setIsMouseDown(false);
    };

    const mouseMove = (e: MouseEvent) => {
        if (!isMouseDown) return;
        setSnapPossible(false)
        e.preventDefault(); // Prevent default behavior
        const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
        const walk = (x - startX) ;
        carouselRef.current!.scrollLeft = scrollLeft - walk;
    };

    const touchStart = (e: TouchEvent) => {
        e.preventDefault(); // Prevent default behavior
        const touch = e.touches[0];
        setSnapPossible(false)
        setIsMouseDown(true);
        setStartX(touch.pageX - (carouselRef.current?.offsetLeft || 0));
        setScrollLeft(carouselRef.current?.scrollLeft || 0);
    };
    
    const touchMove = (e: TouchEvent) => {
        if (!isMouseDown) return;
        e.preventDefault(); // Prevent default behavior
        const touch = e.touches[0];
        setSnapPossible(false)
        const x = touch.pageX - (carouselRef.current?.offsetLeft || 0);
        const walk = x - startX;
        carouselRef.current!.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const carouselElement = carouselRef.current;

        if (carouselElement) {
            carouselElement.addEventListener("pointermove", mouseMove);
            carouselElement.addEventListener("pointerdown", mouseDown);
            carouselElement.addEventListener("pointerleave", mouseLeave);
            carouselElement.addEventListener("pointerup", mouseUp);
            carouselElement.addEventListener("touchstart", touchStart);
            carouselElement.addEventListener("touchmove", touchMove);
            carouselElement.addEventListener("touchend", mouseUp);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener("pointermove", mouseMove);
                carouselElement.removeEventListener("pointerdown", mouseDown);
                carouselElement.removeEventListener("pointerleave", mouseLeave);
                carouselElement.removeEventListener("pointerup", mouseUp);
                carouselElement.removeEventListener("touchstart", touchStart);
                carouselElement.removeEventListener("touchmove", touchMove);
                carouselElement.removeEventListener("touchend", mouseUp);
            }
        };
    }, [isMouseDown, startX, scrollLeft]);
    //* buttons function
    const scrollToPreviousItem = () => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.scrollWidth / (recommendedAnime ?? []).length;
            carouselRef.current?.scrollTo({
                left: carouselRef.current?.scrollLeft - itemWidth,
                behavior: "smooth"
            })
            
        }
    }
    const scrollToNextItem = () => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.scrollWidth / (recommendedAnime ?? []).length
            carouselRef.current?.scrollTo({
                left: carouselRef.current?.scrollLeft + itemWidth,
                behavior: "smooth"
            })
        }
    }

    return (
        <div className="bg-black">
        <h1 className="text-2xl font-semibold bg-black p-2">
          Recommended for you
            </h1>
            <div className={`flex flex-row ${loading ? "block" : "hidden"}`}>
            <LoadingWidget width="w-1/4" />
                
            </div>
            <div className={`flex flex-row ${recommendedAnime.length == 0 && !loading ? "block" : "hidden"}`}>
            <ErrorWidget type={1} isEpisode={true} title="No recommendations" message="I don't know ..." />
                
            </div>
            <div className={`flex flex-row ${loading||recommendedAnime.length ==0? "hidden" : "block"}`}>
        <section className={`flex flex-row overflow-x-hidden bg-black p-4 w-[95%] gap-6 ${!isMouseDown? parentClass : ""}`} ref={carouselRef} style={{ userSelect: 'none' }}>
          {recommendedAnime.map((elem, index) => (
              <div
              key={`${elem.mal_id}${index}`} 
              className="group relative flex-shrink-0 w-48 snap-start"
            >
              <div className="relative flex flex-col shadow-xl transition-all duration-300 group-hover:bg-opacity-20">
                <div className="relative w-48 h-72">
                  <img
                    src={elem.images.jpg.large_image_url}
                    alt={elem.title}
                    draggable="false"
                    className="w-full h-full object-cover rounded-t-md group-hover:opacity-20"
                  />
                </div>
                <AnimeWidgetInfoBar title={elem.title} />
              </div>
                  <Link
              href={`/details/${elem.mal_id}?animeName=${elem.title}&animeId=${elem.mal_id}`}  
                      className="absolute inset-0 z-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                <Play className="w-12 h-12 text-white" />
              </Link>
            </div>
          ))}
                </section>
                {/* the movements buttons */}
                
               {recommendedAnime.length > 5? <div className="bg-black w-[4%] p-2 mt-2">
                    {/* left go button */}
                    <button onClick={scrollToPreviousItem}>
                    <div className="bg-white/5 rounded-lg p-2 h-fit ">
                        <ChevronLeft />
                    </div>

                    </button>
                    {/* right go button */}
                    <button onClick={scrollToNextItem}>
                    <div className="bg-white/5 rounded-lg p-2 h-fit mt-4">
                        <ChevronRight />
                    </div>

                    </button>
                </div> : null}
            </div>
        </div>
    );
};

// Info bar component
const AnimeWidgetInfoBar: FC<{ title: string }> = ({ title }) => (
    <div className="px-1 py-4 shadow-xl bg-gray-950">
        <h2 className="line-clamp-1 text-center text-sm font-semibold">
            {title}
        </h2>
    </div>
);

export default RecommendationSection;


//* 