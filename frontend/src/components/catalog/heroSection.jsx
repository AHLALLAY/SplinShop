import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import catalogService from "../../services/catalog.js";

export default function HeroSection() {
    const [images, setImages] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const timerRef = useRef(null);

    const loadImages = async () => {
        try {
            const res = await catalogService.loadProductImages();
            setImages(res?.data || []);
        } catch (err) {
            console.error("Erreur lors de la récupération des images primaires:", err);
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    const startTimer = () => {
        stopTimer();
        if (images.length > 1) {
            timerRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % images.length);
            }, 5000);
        }
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    useEffect(() => {
        startTimer();
        return () => stopTimer();
    }, [images]);

    const handlePrev = () => {
        stopTimer();
        setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        startTimer();
    };

    const handleNext = () => {
        stopTimer();
        setActiveIndex((prev) => (prev + 1) % images.length);
        startTimer();
    };

    const handleSelect = (index) => {
        stopTimer();
        setActiveIndex(index);
        startTimer();
    };

    if (images.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-56 sm:h-80 md:h-[400px] overflow-hidden rounded-3xl border border-amber-200/50 bg-stone-100 shadow-md shadow-amber-950/5 group">
            {/* Slides */}
            <div className="relative h-full w-full">
                {images.map((img, idx) => (
                    <div
                        key={img.id || idx}
                        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                            idx === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <img
                            src={img.imgUrl}
                            alt={`Slide ${idx + 1}`}
                            className="h-full w-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-black/5" />
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-stone-800 shadow-md backdrop-blur-xs transition opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95"
                        aria-label="Image précédente"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-stone-800 shadow-md backdrop-blur-xs transition opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95"
                        aria-label="Image suivante"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === activeIndex
                                        ? "w-6 bg-amber-500 shadow-xs"
                                        : "w-2 bg-white/60 hover:bg-white"
                                }`}
                                aria-label={`Aller à l'image ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}