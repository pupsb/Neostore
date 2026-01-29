import React, { useEffect} from "react";
import "flowbite";
import { initFlowbite } from "flowbite";

const Carousel = (data) => {
  useEffect(() => {
    initFlowbite();
  }, []);

  // Destructure CarouselMb and CarouselPc from data prop
  const { CarouselMb, CarouselPc } = data.data;

  // Helper function to construct full image URL
  const getImageUrl = (imagePath) => `${imagePath}`;

  return (
    <>
      <div id="default-carousel" className="relative z-10 mt-2" data-carousel="slide">
        <div className="relative h-40 overflow-hidden rounded-[1em] md:h-80">

          {/* First Carousel Item */}
          <div className="hidden duration-700 ease-in-out rounded-[1em] h-full" data-carousel-item>
            {CarouselPc[0] && (
              <div className="hidden md:block">
                <a
                  href={CarouselPc[0].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselPc[0].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselPc[0].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={CarouselPc[0]?.title || "Banner 1"}
                  />
                </a>
              </div>
            )}
            {CarouselMb[0] && (
              <div className="block md:hidden">
                <a
                  href={CarouselMb[0].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselMb[0].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselMb[0].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={CarouselMb[0]?.title || "Banner MB 1"}
                  />
                </a>
              </div>
            )}
          </div>

          {/* Second Carousel Item */}
          <div className="hidden duration-700 ease-in-out w-full h-full" data-carousel-item>
            {CarouselPc[1] && (
              <div className="hidden md:block">
                <a
                  href={CarouselPc[1].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselPc[1].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselPc[1].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={CarouselPc[1]?.title || "Banner 2"}
                  />
                </a>
              </div>
            )}
            {CarouselMb[1] && (
              <div className="block md:hidden">
                <a
                  href={CarouselMb[1].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselMb[1].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselMb[1].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={CarouselMb[1]?.title || "Banner MB 2"}
                  />
                </a>
              </div>
            )}
          </div>

          {/* Third Carousel Item */}
          <div className="hidden duration-700 ease-in-out" data-carousel-item>
            {CarouselPc[2] && (
              <div className="hidden md:block">
                <a
                  href={CarouselPc[2].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselPc[2].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselPc[2].url)}
                    className="w-full h-full object-contain hidden md:block"
                    alt={CarouselPc[2]?.title || "Banner 3"}
                  />
                </a>
              </div>
            )}
            {CarouselMb[2] && (
              <div className="block md:hidden">
                <a
                  href={CarouselMb[2].redirectUrl || "#"}
                  onClick={(e) => {
                    if (!CarouselMb[2].redirectUrl) e.preventDefault();
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full h-full"
                >
                  <img
                    src={getImageUrl(CarouselMb[2].url)}
                    className="w-full h-full object-cover md:hidden block"
                    alt={CarouselMb[2]?.title || "Banner MB 3"}
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
