import React, { useEffect } from "react";
import "flowbite";
import { initFlowbite } from "flowbite";

const Carousel = (data) => {
  useEffect(() => {
    initFlowbite();
  }, []);

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

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => `${imagePath}`;

  return (
    <>
      <div id="default-carousel" className="relative z-10 mt-2" data-carousel="slide">
        <div className="relative h-40 overflow-hidden rounded-[1em] md:h-80">

          {/* First Carousel Item */}
          <div className="hidden duration-700 ease-in-out rounded-[1em] h-full" data-carousel-item>
            {carouselPcData[0] && (
              <div className="hidden md:block">
                <a
                  href={carouselPcData[0].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselPcData[0].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselPcData[0].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={carouselPcData[0]?.title || "Banner 1"}
                  />
                </a>
              </div>
            )}
            {carouselMbData[0] && (
              <div className="block md:hidden">
                <a
                  href={carouselMbData[0].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselMbData[0].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselMbData[0].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={carouselMbData[0]?.title || "Banner MB 1"}
                  />
                </a>
              </div>
            )}
          </div>

          {/* Second Carousel Item */}
          <div className="hidden duration-700 ease-in-out w-full h-full" data-carousel-item>
            {carouselPcData[1] && (
              <div className="hidden md:block">
                <a
                  href={carouselPcData[1].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselPcData[1].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselPcData[1].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={carouselPcData[1]?.title || "Banner 2"}
                  />
                </a>
              </div>
            )}
            {carouselMbData[1] && (
              <div className="block md:hidden">
                <a
                  href={carouselMbData[1].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselMbData[1].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselMbData[1].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={carouselMbData[1]?.title || "Banner MB 2"}
                  />
                </a>
              </div>
            )}
          </div>

          {/* Third Carousel Item */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            {carouselPcData[2] && (
              <div className="hidden md:block">
                <a
                  href={carouselPcData[2].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselPcData[2].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselPcData[2].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={carouselPcData[2]?.title || "Banner 3"}
                  />
                </a>
              </div>
            )}
            {carouselMbData[2] && (
              <div className="block md:hidden">
                <a
                  href={carouselMbData[2].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!carouselMbData[2].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(carouselMbData[2].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={carouselMbData[2]?.title || "Banner MB 3"}
                  />
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Carousel Navigation Dots */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            className="w-5 h-3 rounded-full"
            aria-current="true"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-5 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-5 h-3 rounded-full"
            aria-current="false"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          ></button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
