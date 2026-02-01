import { useContext, useState } from "react";
import { VariableContext } from "../context/VariableContext";

export const useGetHomeImages = () => {

  const [isLoading, setIsLoading] = useState(null);
  const [CarouselMb, setCarouselMb] = useState(null);
  const [CarouselPc, setCarouselPc] = useState(null);
  const [Popup, setPopup] = useState([]);

  const { host } = useContext(VariableContext);

  const getHomeImages = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${host}/gallery/images`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

      const data = await response.json();
      
      // Only update state if we got valid data
      if (data.CarouselMb && data.CarouselMb.length > 0) {
        setCarouselMb(data.CarouselMb);
      }
      if (data.CarouselPc && data.CarouselPc.length > 0) {
        setCarouselPc(data.CarouselPc);
      }
      if (data.Popup) {
        setPopup(data.Popup);
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
      setIsLoading(false);
    }
  };

  return { CarouselMb, CarouselPc, Popup, isLoading, getHomeImages };
};




