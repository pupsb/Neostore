import React, { useState, useEffect } from "react";

const CarouselPeek = (data) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Destructure CarouselMb and CarouselPc from data prop
    const { CarouselMb, CarouselPc } = data.data || {};

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
    const carouselPcData = CarouselPc && CarouselPc.length > 0 ? CarouselPc : testImages;
    const carouselMbData = CarouselMb && CarouselMb.length > 0 ? CarouselMb : testImages;

    const totalSlides = carouselPcData.length;

    // Auto-play functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [totalSlides]); // Only depend on totalSlides, not currentIndex

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    // Helper to get image URL
    const getImageUrl = (imagePath) => `${imagePath}`;

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
                        <img
                            src={getImageUrl(carouselPcData[(currentIndex - 1 + totalSlides) % totalSlides].url)}
                            alt="Previous"
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                    </div>

                    {/* Center Image (Active) */}
                    <div
                        className="relative h-80 w-1/2 transition-all duration-600 ease-in-out"
                        style={{ zIndex: 10 }}
                    >
                        <a
                            href={carouselPcData[currentIndex].redirectUrl || "#"}
                            onClick={(e) => {
                                if (!carouselPcData[currentIndex].redirectUrl) e.preventDefault();
                            }}
                            className="block w-full h-full"
                        >
                            <img
                                src={getImageUrl(carouselPcData[currentIndex].url)}
                                alt={carouselPcData[currentIndex]?.title || `Slide ${currentIndex + 1}`}
                                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                            />
                        </a>
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
                        <img
                            src={getImageUrl(carouselPcData[(currentIndex + 1) % totalSlides].url)}
                            alt="Next"
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
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

            {/* Mobile Carousel - Simple */}
            <div className="block md:hidden relative h-48 rounded-2xl overflow-hidden">
                <a
                    href={carouselMbData[currentIndex].redirectUrl || "#"}
                    onClick={(e) => {
                        if (!carouselMbData[currentIndex].redirectUrl) e.preventDefault();
                    }}
                    className="block w-full h-full"
                >
                    <img
                        src={getImageUrl(carouselMbData[currentIndex].url)}
                        alt={carouselMbData[currentIndex]?.title || `Mobile Slide ${currentIndex + 1}`}
                        className="w-full h-full object-cover"
                    />
                </a>

                {/* Mobile Navigation Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {carouselMbData.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                ? "w-6 h-2 bg-white"
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
