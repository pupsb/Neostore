import { useContext, useState } from "react";
import { VariableContext } from "../context/VariableContext";

export const useGetProducts = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [games, setGames] = useState([]);
  const [instantGames, setInstantGames] = useState([]);
  const [trending, setTrending] = useState([]);
  const [ott, setOtt] = useState([]);
  const [others, setOthers] = useState([]);
  const { host } = useContext(VariableContext);
  const [products,setProducts] = useState([]);

  const getAllProducts = async(token)=>{
    setIsLoading(true);
    const response = await fetch(`${host}/product/allproducts`,{
      method : "GET",
      headers: {
        "Content-Type": "application/json",
         Authorization: `Bearer ${token}`,
      },
    })
    setProducts(await response.json());
    setIsLoading(false);
  }

  const getProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${host}/product/gethomeproducts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

      // Process responses concurrently
      const data = await response.json();
      // Update state once all responses are available
      setTrending(data.trending);
      setInstantGames(data.instantGames)
      setGames(data.games);
      setOtt(data.ott);
      setOthers(data.others);

      setIsLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  return { games, ott, trending, instantGames, others,  isLoading, getProducts,getAllProducts,products };
};




