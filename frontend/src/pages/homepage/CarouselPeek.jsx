import React, { useState, useEffect } from "react";

const CarouselPeek = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

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
        if (totalSlides <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
            setTimeout(() => setIsTransitioning(false), 600);
        }, 5000);

        return () => clearInterval(interval);
    }, [totalSlides]);

    const handlePrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
        setTimeout(() => setIsTransitioning(false), 600);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 600);
    };

    // Helper to get image URL
    const getImageUrl = (imagePath) => `${imagePath}`;

    // Get slide position for 3D carousel
    const getSlideStyle = (index) => {
        const diff = index - currentIndex;
        const absIndex = ((index % totalSlides) + totalSlides) % totalSlides;

        if (diff === 0) {
            // Center slide
            return {
                transform: 'translateZ(0px) scale(1)',
                zIndex: 10,
                opacity: 1,
                transition: isTransitioning ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            };
        } else if (diff === 1 || diff === -(totalSlides - 1)) {
            // Right slide
            return {
                transform: 'translateX(35%) translateZ(-250px) scale(0.75)',
                zIndex: 9,
                opacity: 0.5,
                transition: isTransitioning ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            };
        } else if (diff === -1 || diff === (totalSlides - 1)) {
            // Left slide
            return {
                transform: 'translateX(-35%) translateZ(-250px) scale(0.75)',
                zIndex: 9,
                opacity: 0.5,
                transition: isTransitioning ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            };
        } else {
            // Hidden slides
            return {
                transform: 'translateZ(-500px) scale(0.5)',
                zIndex: 1,
                opacity: 0,
                transition: isTransitioning ? 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
            };
        }
    };

    const getClickHandler = (index) => {
        const diff = index - currentIndex;
        if (diff === 1 || diff === -(totalSlides - 1)) {
            return handleNext;
        } else if (diff === -1 || diff === (totalSlides - 1)) {
            return handlePrevious;
        }
        return () => { };
    };

    return (
        <div className="relative w-full mt-2">
            {/* Mobile Carousel - Sliding */}
            <div className="md:hidden relative">
                <div className="overflow-hidden rounded-2xl shadow-xl">
                    <div
                        className="flex"
                        style={{
                            transform: `translateX(-${currentIndex * 100}%)`,
                            transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
                        }}
                    >
                        {carouselMbData.map((slide, index) => (
                            <div key={`mobile-slide-${index}`} className="w-full flex-shrink-0">
                                <div className="w-full h-[200px] bg-gray-100 overflow-hidden">
                                    <a
                                        href={slide.redirectUrl || "#"}
                                        onClick={(e) => {
                                            if (!slide.redirectUrl) e.preventDefault();
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(slide.url)}
                                            alt={slide.title || `slide-${index}`}
                                            className="w-full h-full object-cover"
                                            draggable="false"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Navigation Arrows */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg z-10 bg-gray-800/90 hover:bg-gray-800"
                    aria-label="Previous"
                    disabled={isTransitioning}
                >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 shadow-lg z-10 bg-gray-800/90 hover:bg-gray-800"
                    aria-label="Next"
                    disabled={isTransitioning}
                >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                    </svg>
                </button>
            </div>

            {/* Desktop 3D Carousel */}
            <div className="hidden md:block relative w-full max-w-5xl mx-auto">
                <div
                    className="relative h-[450px] lg:h-[380px] w-full"
                    style={{
                        perspective: '1500px',
                        perspectiveOrigin: '50% 50%'
                    }}
                >
                    <div
                        className="relative w-full h-full"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {carouselPcData.map((slide, index) => (
                            <div
                                key={`desktop-slide-${index}`}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                style={{
                                    ...getSlideStyle(index),
                                    transformOrigin: 'center center 0px',
                                    willChange: 'transform, opacity'
                                }}
                                onClick={getClickHandler(index)}
                            >
                                <div className="w-4/5 h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                                    <a
                                        href={slide.redirectUrl || "#"}
                                        onClick={(e) => {
                                            if (!slide.redirectUrl) e.preventDefault();
                                        }}
                                    >
                                        <img
                                            src={getImageUrl(slide.url)}
                                            alt={slide.title || `slide-${index}`}
                                            className="w-full h-full object-cover"
                                            draggable="false"
                                        />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Desktop Navigation Arrows */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 z-20 group"
                    aria-label="Previous"
                    disabled={isTransitioning}
                >
                    <svg className="text-gray-800 text-xl group-hover:text-purple-600 transition-colors w-6 h-6" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z" />
                    </svg>
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-200 z-20 group"
                    aria-label="Next"
                    disabled={isTransitioning}
                >
                    <svg className="text-gray-800 text-xl group-hover:text-purple-600 transition-colors w-6 h-6" fill="currentColor" viewBox="0 0 320 512">
                        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
                    </svg>
                </button>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-2">
                {carouselPcData.map((_, index) => (
                    <button
                        key={`dot-${index}`}
                        onClick={() => goToSlide(index)}
                        className={`rounded-full transition-all duration-300 ${index === currentIndex
                            ? "bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 w-8 h-2.5 shadow-lg"
                            : "bg-gray-300 hover:bg-purple-300 w-2.5 h-2.5"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                        disabled={isTransitioning}
                    />
                ))}
            </div>
        </div>
    );
};

export default CarouselPeek;
