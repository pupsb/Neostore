import React, { useState, useEffect, useContext } from "react";
import { VariableContext } from "../../context/VariableContext";

const CarouselPeek = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Get backend host URL for images
    const { host } = useContext(VariableContext);

    // Destructure CarouselMb and CarouselPc from data prop
    const { CarouselMb, CarouselPc } = data || {};

    // Fallback test images for development when backend data is unavailable
    const testImages = [
        {
            url: "https://i.pinimg.com/1200x/36/9f/6f/369f6f9d06575f4d0629f4f8bf8347f8.jpg",
            title: "Test Banner 1",
            redirectUrl: "#"
        },
        {
            url: "https://i.pinimg.com/1200x/e6/b9/c1/e6b9c1decfae8e63c78edf62d1328f3f.jpg",
            title: "Test Banner 2",
            redirectUrl: "#"
        },
        {
            url: "https://i.pinimg.com/1200x/36/9f/6f/369f6f9d06575f4d0629f4f8bf8347f8.jpg",
            title: "Test Banner 3",
            redirectUrl: "#"
        }
    ];

    // Use test images if carousel data is not available (development mode)
    const carouselPcData = (CarouselPc && CarouselPc.length > 0) ? CarouselPc : testImages;
    const carouselMbData = (CarouselMb && CarouselMb.length > 0) ? CarouselMb : testImages;

    const totalSlides = carouselPcData?.length || 0;

    // Auto-play functionality
    useEffect(() => {
        if (totalSlides <= 1) return; // Don't auto-play if only 1 slide

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [totalSlides]);

    const handlePrevious = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleNext = () => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const goToSlide = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    // Helper to get image URL
    const getImageUrl = (imagePath) => `${imagePath}`;

    // Safe array access helper
    const getSlideData = (index, dataArray) => {
        if (!dataArray || dataArray.length === 0) return null;
        const safeIndex = ((index % dataArray.length) + dataArray.length) % dataArray.length;
        return dataArray[safeIndex];
    };

    return (
        <div className="relative w-full mt-2">
            {/* Desktop Carousel - Peek Effect */}
            <div className="hidden md:block relative h-80 overflow-visible">
                <div className="flex items-center justify-center h-full relative">
                    {/* Previous Image (Left Peek) */}
                    <div
                        className="absolute left-0 h-64 w-1/4 cursor-pointer transition-all duration-600 ease-in-out hover:scale-105"
                        style={{
                            transform: 'translateX(10%) scale(0.85)',
                            opacity: 0.6,
                            zIndex: 1
                        }}
                        onClick={handlePrevious}
                    >
                        {(() => {
                            const slideData = getSlideData(currentIndex - 1, carouselPcData);
                            return slideData ? (
                                <img
                                    key={`prev-${currentIndex}`}
                                    src={getImageUrl(slideData.url)}
                                    alt="Previous"
                                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                                />
                            ) : null;
                        })()}
                    </div>

                    {/* Center Image (Active) */}
                    <div
                        className="relative h-80 w-1/2 transition-all duration-600 ease-in-out"
                        style={{
                            zIndex: 10,
                            opacity: isTransitioning ? 0.3 : 1,
                            transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
                        }}
                    >
                        {(() => {
                            const slideData = getSlideData(currentIndex, carouselPcData);
                            return slideData ? (
                                <a
                                    key={`current-${currentIndex}`}
                                    href={slideData.redirectUrl || "#"}
                                    onClick={(e) => {
                                        if (!slideData.redirectUrl) e.preventDefault();
                                    }}
                                    className="block w-full h-full"
                                >
                                    <img
                                        src={getImageUrl(slideData.url)}
                                        alt={slideData.title || `Slide ${currentIndex + 1}`}
                                        className="w-full h-full object-cover rounded-2xl shadow-2xl transition-transform duration-600"
                                    />
                                </a>
                            ) : null;
                        })()}
                    </div>

                    {/* Next Image (Right Peek) */}
                    <div
                        className="absolute right-0 h-64 w-1/4 cursor-pointer transition-all duration-600 ease-in-out hover:scale-105"
                        style={{
                            transform: 'translateX(-10%) scale(0.85)',
                            opacity: 0.6,
                            zIndex: 1
                        }}
                        onClick={handleNext}
                    >
                        {(() => {
                            const slideData = getSlideData(currentIndex + 1, carouselPcData);
                            return slideData ? (
                                <img
                                    key={`next-${currentIndex}`}
                                    src={getImageUrl(slideData.url)}
                                    alt="Next"
                                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                                />
                            ) : null;
                        })()}
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={handlePrevious}
                        className="absolute left-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                        aria-label="Previous slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        className="absolute right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-all duration-300 hover:scale-110"
                        aria-label="Next slide"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicator Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {carouselPcData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? "w-8 h-3 bg-purple-500"
                                : "w-3 h-3 bg-white/50 hover:bg-white/80"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile Carousel - With Navigation */}
            <div
                className="block md:hidden relative h-48 rounded-2xl overflow-hidden transition-opacity duration-600"
                style={{
                    opacity: isTransitioning ? 0.3 : 1
                }}
            >
                {(() => {
                    const slideData = getSlideData(currentIndex, carouselMbData);
                    return slideData ? (
                        <a
                            key={`mobile-${currentIndex}`}
                            href={slideData.redirectUrl || "#"}
                            onClick={(e) => {
                                if (!slideData.redirectUrl) e.preventDefault();
                            }}
                            className="block w-full h-full transition-transform duration-600"
                            style={{
                                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)'
                            }}
                        >
                            <img
                                src={getImageUrl(slideData.url)}
                                alt={slideData.title || `Mobile Slide ${currentIndex + 1}`}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        </a>
                    ) : null;
                })()}

                {/* Mobile Left Arrow */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Mobile Right Arrow */}
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-300"
                    aria-label="Next slide"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Mobile Navigation Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {carouselMbData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? "w-6 h-2 bg-purple-500"
                                : "w-2 h-2 bg-white/50"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarouselPeek;
