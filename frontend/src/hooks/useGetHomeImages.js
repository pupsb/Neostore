import { useContext, useState } from "react";
import { VariableContext } from "../context/VariableContext";

export const useGetHomeImages = () => {

  const [isLoading, setIsLoading] = useState(null);
  const [CarouselMb, setCarouselMb] = useState([]);
  const [CarouselPc, setCarouselPc] = useState([]);
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
      // console.log(data);
      
      setCarouselMb(data.CarouselMb);
      setCarouselPc(data.CarouselPc)
      setPopup(data.Popup);

      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { CarouselMb, CarouselPc, Popup, isLoading, getHomeImages };
};




