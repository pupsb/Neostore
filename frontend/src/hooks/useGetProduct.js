import { useContext, useState, useEffect } from "react";
import { VariableContext } from "../context/VariableContext";

export const useGetProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { host , product, setProduct , setProductPageLoading} = useContext(VariableContext);

  const getProduct = async (_id) => {
    setProductPageLoading(true);
    setIsLoading(true);

    try {
      const response = await fetch(`${host}/product/eachproduct/${_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setProduct(await response.json());
      // console.log(product);
      

    } catch (error) {
      console.error("Error fetching product: ", error);
    } finally {
      setProductPageLoading(true);
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log(product);
  // }, [product]);
  
  return { isLoading, getProduct, product };
};
