import React, { FC, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Anime } from "../types/anime_type";
import AnimeWidget from "./anime_item_widget";

type AnimeScrollType = {
    animeList: Anime[] | null,
    isRanked: boolean
};

const AnimeScrollWidget: FC<AnimeScrollType> = ({ animeList, isRanked }) => {
    //* vars
    let parentClass: string = "snap-x snap-proximity scroll-smooth"
    //* the carousel reference
    const carouselRef = useRef<HTMLElement>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isSnapPossible, setSnapPossible] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

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
            const itemWidth = carouselRef.current.scrollWidth / (animeList ?? []).length;
            carouselRef.current?.scrollTo({
                left: carouselRef.current?.scrollLeft - itemWidth,
                behavior: "smooth"
            })
            
        }
    }
    const scrollToNextItem = () => {
        if (carouselRef.current) {
            const itemWidth = carouselRef.current.scrollWidth / (animeList ?? []).length
            carouselRef.current?.scrollTo({
                left: carouselRef.current?.scrollLeft + itemWidth,
                behavior: "smooth"
            })
        }
    }
    // Render the anime list
    if (animeList != null) {
        if (animeList.length > 0) {
            return (
                <div className="flex flex-row">
                <section
                    className={`flex flex-row flex-grow overflow-x-hidden ml-2 ${!isMouseDown? parentClass : ""}`}
                    ref={carouselRef}
                    style={{ userSelect: 'none' }} // Prevent text selection
                >
                    {animeList.map((anime) => (
                        <div key={anime.mal_id} className="flex-shrink-0 w-1/6 p-2 snap-start">
                            <AnimeWidget anime={anime} isRanked={isRanked} />
                        </div>
                    ))}
                    </section>
                    <div className="flex flex-col h-[80%] flex-shrink ">
            <button onClick={scrollToPreviousItem}>
            <div className="flex colorTab rounded-lg items-center h-[60%] p-2 mx-2">
            <ChevronLeft />
            </div>

                        </button>
                        <button onClick={scrollToNextItem}>

            <div className="flex colorTab rounded-lg h-[60%] p-2 items-center m-2">
            <ChevronRight />
            </div>
                        </button>
        </div>
                </div>
            );
        } else {
            return <div>No seasonal anime data available.</div>;
        }
    } else {
        return <div>Error getting Anime of the season.</div>;
    }
};

export default AnimeScrollWidget;
