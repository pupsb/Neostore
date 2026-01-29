import { useContext, useState } from "react";
import { VariableContext } from "../context/VariableContext";

export const useGetItems = () => {
  const [isLoading, setIsLoading] = useState(null);
  const {host,productPageLoading,setProductPageLoading, setItems, items} = useContext(VariableContext);

  const getItems = async(_id)=>{
    
    setIsLoading(true);
    setProductPageLoading(true);
    // console.log(productId);
    
    const response = await fetch(`${host}/item/${_id}`,{
      method : "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    setItems(await response.json());
    // console.log(items);
    
    setProductPageLoading(false);
    setIsLoading(false);
    
  }
  return {isLoading,getItems};
 }