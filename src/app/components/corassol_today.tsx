import { FC, useRef, useState, useEffect } from "react";
import { Anime } from "../types/anime_type";
import ColorButton from "./color_button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateTimeService from "../services/date_service";
import Link from "next/link";

type CarouselWidgetType = {
    todayAnimeList: Anime[];
};

let time_service = new DateTimeService();

const CarouselDisplay: FC<CarouselWidgetType> = ({ todayAnimeList }) => {
    const carouselRef = useRef<HTMLElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !isMouseDown) {
                handleNext();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, isMouseDown]);

    useEffect(() => {
        const updateHeight = () => {
            if (carouselRef.current) {
                const vh = window.innerHeight;
                const minHeight = isMobile ? 400 : 480;
                const maxHeight = isMobile ? 600 : 800;
                const heightRatio = isMobile ? 0.6 : 0.75;
                const calculatedHeight = Math.floor(vh * heightRatio);
                const finalHeight = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
                carouselRef.current.style.height = `${finalHeight}px`;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, [isMobile]);

    const scrollToIndex = (index: number) => {
        if (carouselRef.current) {
            const newIndex = Math.min(Math.max(index, 0), todayAnimeList.length - 1);
            carouselRef.current.scrollTo({
                left: newIndex * carouselRef.current.clientWidth,
                behavior: 'smooth'
            });
            setCurrentIndex(newIndex);
        }
    };

    const handlePrev = () => {
        const newIndex = currentIndex - 1;
        if (newIndex >= 0) {
            scrollToIndex(newIndex);
        } else {
            scrollToIndex(todayAnimeList.length - 1);
        }
    };

    const handleNext = () => {
        const newIndex = currentIndex + 1;
        if (newIndex < todayAnimeList.length) {
            scrollToIndex(newIndex);
        } else {
            scrollToIndex(0);
        }
    };

    useEffect(() => {
        const carouselElement = carouselRef.current;

        const mouseDown = (e: PointerEvent) => {
            e.preventDefault();
            setIsPaused(true);
            setIsMouseDown(true);
            setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
            setScrollLeft(carouselRef.current?.scrollLeft || 0);
        };

        const mouseLeave = () => {
            setIsMouseDown(false);
            setIsPaused(false);
        };

        const mouseUp = () => {
            setIsMouseDown(false);
            setIsPaused(false);
            
            if (carouselRef.current) {
                const currentScroll = carouselRef.current.scrollLeft;
                const itemWidth = carouselRef.current.clientWidth;
                const newIndex = Math.round(currentScroll / itemWidth);
                scrollToIndex(newIndex);
            }
        };

        const mouseMove = (e: PointerEvent) => {
            if (!isMouseDown) return;
            e.preventDefault();
            const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
            const walk = (x - startX);
            if (carouselRef.current) {
                carouselRef.current.scrollLeft = scrollLeft - walk*2;
            }
        };

        if (carouselElement) {
            carouselElement.addEventListener("pointermove", mouseMove);
            carouselElement.addEventListener("pointerdown", mouseDown);
            carouselElement.addEventListener("pointerleave", mouseLeave);
            carouselElement.addEventListener("pointerup", mouseUp);
        }

        return () => {
            if (carouselElement) {
                carouselElement.removeEventListener("pointermove", mouseMove);
                carouselElement.removeEventListener("pointerdown", mouseDown);
                carouselElement.removeEventListener("pointerleave", mouseLeave);
                carouselElement.removeEventListener("pointerup", mouseUp);
            }
        };
    }, [isMouseDown, startX, scrollLeft]);

    return (
        <div className="relative w-full z-20">
            <button 
                onClick={handlePrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1 md:p-2 rounded-full hover:bg-black/70 transition-colors text-white text-xl md:text-2xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
            
            <button 
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-1 md:p-2 rounded-full hover:bg-black/70 transition-colors text-white text-xl md:text-2xl w-8 h-8 md:w-10 md:h-10 flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            <section
                ref={carouselRef}
                className="flex flex-row overflow-x-hidden w-full bg-black cursor-grab active:cursor-grabbing touch-pan-y"
                style={{ 
                    height: isMobile ? "calc(100vh - 150px)" : "calc(100vh - 200px)", 
                    maxHeight: isMobile ? "600px" : "800px",
                    minHeight: isMobile ? "400px" : "480px",
                    userSelect: 'none'
                }}
            >
                {todayAnimeList.map((elem, index) => (
                    <div 
                        key={index} 
                        className="flex-none w-full relative flex flex-col md:flex-row-reverse"
                    >
                        {/* Image container with backdrop */}
                        <div className="w-full md:w-2/3 h-1/2 md:h-full relative bg-black overflow-hidden">
                            {/* Blurred backdrop for fill */}
                            <div 
                                className="absolute inset-0 blur-xl opacity-40 scale-110"
                                style={{
                                    backgroundImage: `url(${elem.images.jpg.large_image_url})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}
                            />
                            
                            {/* Main image - contained */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img
                                    src={elem.images.jpg.large_image_url}
                                    alt={elem.title}
                                    className="h-full w-screen object-cover md:w-auto ms:object-contain max-w-none md:p-4 md:rounded-3xl"
                                    draggable="false"
                                />
                            </div>

                            {/* Gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                        </div>

                        {/* Content container */}
                        <div className="w-full md:w-1/3 h-1/2 md:h-full bg-black flex flex-col justify-center items-start p-4 md:p-8 relative">
                            <h1 className="text-base md:text-lg font-light pb-2 md:pb-4 text-white">#{elem.rank} Rank</h1>
                            <h1 className="text-2xl md:text-3xl text-white font-semibold pb-2 md:pb-4 line-clamp-3 md:line-clamp-4">{elem.title}</h1>
                            <div className="flex flex-wrap gap-2 md:gap-4 py-1 md:py-2">
                                <InformationTag icon="/icons/playFilledWhite.png" content={elem.type} />
                                <InformationTag icon="/icons/time.png" content={elem.duration} />
                                <InformationTag icon="/icons/calendar.png" content={time_service.formatDate(elem.aired.from)} />
                            </div>
                            <h3 className="py-2 md:py-6 text-white/90 text-xs md:text-sm line-clamp-2">{elem.synopsis}</h3>
                            <div className="flex flex-row gap-2 md:gap-4 mt-2 py-2 md:bottom-4 md:absolute">
                                <Link href={`/details/${elem.mal_id}?animeName=${elem.title}&animeId=${elem.mal_id}`}>
                                <ColorButton color="bg-white" content="Watch Now" prefix="/icons/playWhite.png" suffix={null} />
                                </Link>
                                <Link href={`/details/${elem.mal_id}?animeName=${elem.title}&animeId=${elem.mal_id}`}>
                                <ColorButton color="bg-white" content="Details" suffix="/icons/arrow.png" prefix={null} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
                {todayAnimeList.map((_, index) => (
                    <button
                        key={index}
                        className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
                            index === currentIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => scrollToIndex(index)}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    />
                ))}
            </div>
        </div>
    );
};

type InformationTagType = {
    content: string,
    icon: string,
};

const InformationTag: FC<InformationTagType> = ({ content, icon }) => {
    return (
        <div className="flex flex-row items-center bg-white/10 rounded-full px-2 md:px-3 py-0.5 md:py-1">
            <img src={icon} alt="" className="w-3 h-3 md:w-4 md:h-4" />
            <h3 className="text-xs md:text-sm font-light px-1.5 md:px-2 text-white">{content}</h3>
        </div>
    );
};

export default CarouselDisplay;