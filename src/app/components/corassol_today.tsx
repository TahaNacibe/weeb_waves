import { FC, useRef, useState, useEffect, TouchEvent } from "react";
import { Anime } from "../types/anime_type";
import ColorButton from "./color_button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateTimeService from "../services/date_service";

type CarouselWidgetType = {
    todayAnimeList: Anime[];
};

let time_service = new DateTimeService();

const CarouselDisplay: FC<CarouselWidgetType> = ({ todayAnimeList }) => {
    const carouselRef = useRef<HTMLElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const dragThreshold = 50;

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused && !isDragging) {
                handleNext();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, isPaused, isDragging]);

    // Calculate height based on viewport
    useEffect(() => {
        const updateHeight = () => {
            if (carouselRef.current) {
                const vh = window.innerHeight;
                const minHeight = 480; // Minimum height in pixels
                const maxHeight = 800; // Maximum height in pixels
                const calculatedHeight = Math.floor(vh * 0.75); // 75% of viewport height
                
                // Clamp the height between min and max values
                const finalHeight = Math.min(Math.max(calculatedHeight, minHeight), maxHeight);
                carouselRef.current.style.height = `${finalHeight}px`;
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

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

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        if (carouselRef.current) {
            setStartX(e.pageX - carouselRef.current.offsetLeft);
            setScrollLeft(carouselRef.current.scrollLeft);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        const finalX = e.pageX - (carouselRef.current?.offsetLeft || 0);
        const deltaX = finalX - startX;
        
        if (Math.abs(deltaX) >= dragThreshold) {
            if (deltaX < 0) handleNext();
            else handlePrev();
        } else {
            scrollToIndex(currentIndex);
        }
        
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX);
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTouchStart = (e: TouchEvent) => {
        setIsDragging(true);
        setIsPaused(true);
        if (carouselRef.current) {
            setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft);
            setScrollLeft(carouselRef.current.scrollLeft);
        }
    };

    const handleTouchEnd = (e: TouchEvent) => {
        if (!isDragging || !carouselRef.current) return;
        
        const finalX = e.changedTouches[0].pageX - carouselRef.current.offsetLeft;
        const deltaX = finalX - startX;
        
        if (Math.abs(deltaX) >= dragThreshold) {
            if (deltaX < 0) handleNext();
            else handlePrev();
        } else {
            scrollToIndex(currentIndex);
        }
        
        setIsDragging(false);
        setIsPaused(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !carouselRef.current) return;
        const x = e.touches[0].pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX);
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div className="relative w-full z-20">
            <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors text-white text-2xl w-10 h-10 flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors text-white text-2xl w-10 h-10 flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <section
                ref={carouselRef}
                className="flex flex-row overflow-x-hidden w-full bg-black cursor-grab active:cursor-grabbing touch-pan-y"
                style={{ height: "calc(100vh - 200px)", maxHeight: "800px", minHeight: "480px" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => {
                    setIsPaused(false);
                    handleMouseUp;
                }}
            >
                {todayAnimeList.map((elem, index) => (
                    <div 
                        key={index} 
                        className="flex-none w-full relative flex flex-row-reverse"
                    >
                        {/* Image container with backdrop */}
                        <div className="w-2/3 relative bg-black overflow-hidden">
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
                                    className="h-full w-auto max-w-none object-contain p-4 rounded-3xl"
                                    draggable="false"
                                />
                            </div>

                            {/* Gradient overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />
                        </div>

                        {/* Content container */}
                        <div className="w-1/3 bg-black flex flex-col justify-center items-start p-8 relative">
                            <h1 className="text-lg font-light pb-4 text-white">#{elem.rank} Rank</h1>
                            <h1 className="text-white text-3xl font-semibold pb-4 line-clamp-4">{elem.title}</h1>
                            <div className="flex flex-wrap gap-4 py-2">
                                <InformationTag icon="/icons/playFilledWhite.png" content={elem.type} />
                                <InformationTag icon="/icons/time.png" content={elem.duration} />
                                <InformationTag icon="/icons/calendar.png" content={time_service.formatDate(elem.aired.from)} />
                            </div>
                            <h3 className="py-6 text-white/90 text-sm line-clamp-2">{elem.synopsis}</h3>
                            <div className="flex flex-row gap-4 bottom-4 absolute">
                                <ColorButton color="bg-white" content="Watch Now" prefix="/icons/playWhite.png" suffix={null} />
                                <ColorButton color="bg-white" content="Details" suffix="/icons/arrow.png" prefix={null} />
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {todayAnimeList.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
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
        <div className="flex flex-row items-center bg-white/10 rounded-full px-3 py-1">
            <img src={icon} alt="" className="w-4 h-4" />
            <h3 className="text-sm font-light px-2 text-white">{content}</h3>
        </div>
    );
};

export default CarouselDisplay;