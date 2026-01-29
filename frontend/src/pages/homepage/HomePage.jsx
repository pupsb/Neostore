import React, { useEffect, useState } from "react";
import CardsScroller from "../../components/card/CardsScroller";
import Carousel from "./Carousel";
import CardsGrid from "../../components/card/CardsGrid";
import { useGetProducts } from "../../hooks/useGetProducts";
import ProductSkeletons from "../../components/skeletons/ProductSkeletons";
import whatsappIcon from "../../assets/icons8-whatsapp-48.png";
import { useGetHomeImages } from "../../hooks/useGetHomeImages";
import PopupAd from "./PopupAd";
import Footer from "../footer/Footer";
import BottomNavBar from "../navbar/bottomNavbar";
import { faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomePage = () => {
  const iterations = Array.from({ length: 30 }, (_, index) => index);

  const { getProducts, isLoading, games, trending, ott, others, instantGames } = useGetProducts();
  const { getHomeImages, CarouselMb, CarouselPc, Popup } = useGetHomeImages();


  useEffect(() => {
    async function fetch() {
      const data = await getHomeImages();
    }
    fetch();
  }, []);


  useEffect(() => {
    async function fetch() {
      await getProducts();
    }
    fetch();
  }, []);
  // console.log("Popup", Popup);


  return (
    <>

      {Popup && Popup.length > 0 && <PopupAd popupData={Popup} />}

      {/* WhatsApp Button */}
      {/* <a
        href="https://t.me/woexsupport"
        className="fixed bottom-24 right-5 z-50 flex items-center gap-2 bg-blue-600 p-2 rounded-full text-white"
      >
        <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8" />
        <FontAwesomeIcon icon={faTelegram} size="2x" />
        Contact us
      </a> */}

      {/* Main Content */}
      <div className="mt-2 lg:mx-24 mx-4 flex flex-col gap-3 ">
        {CarouselMb && CarouselMb.length > 0 && CarouselPc && CarouselPc.length > 0 && <Carousel data={{ CarouselMb, CarouselPc }} />}
        {/* <Carousel /> */}

        <div className="mt-5 flex flex-col gap-4">

          {!isLoading ? (
            <>
              {trending && trending.length > 0 && (
                <div>
                  <div className="font-extrabold text-black md:text-2xl text-xl">
                    Trending
                  </div>
                  <CardsScroller data={trending} />
                </div>
              )}
              {instantGames && instantGames.length > 0 && (
                <section id="instant-games">
                  <div className="font-extrabold text-black md:text-2xl text-xl">
                    Discounts
                  </div>
                  <CardsGrid data={instantGames} />
                </section>
              )}

              {games && games.length > 0 && (
                <section id="games">
                  <div className="font-extrabold text-black md:text-2xl text-xl">
                    Games
                  </div>
                  <CardsGrid data={games} />
                </section>
              )}

              {ott && ott.length > 0 && (
                <section id="ott">
                  <div className="font-extrabold text-black md:text-2xl text-xl">
                    OTTs
                  </div>
                  <CardsGrid data={ott} />
                </section>
              )}

              {others && others.length > 0 && (
                <section id="others">
                  <div className="font-extrabold text-black md:text-2xl text-xl">
                    Others
                  </div>
                  <CardsGrid data={others} />
                </section>
              )}

            </>
          ) : (
            <div className="flex flex-col w-full gap-4 overflow-auto">
              <div className="font-extrabold text-black md:text-2xl text-xl">
                Trending
              </div>
              <div className="flex gap-5">
                {iterations.map((it) => (
                  <ProductSkeletons key={it} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <BottomNavBar />
      <Footer />
    </>
  );
};

export default HomePage;
