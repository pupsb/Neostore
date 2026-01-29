import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useUpdateItem = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [item, setItem] = useState([]);
  const { host } = useContext(VariableContext);

  const UpdateItem = async (itemId, token, { price, resellPrice, itemInstock }) => {
    
    setIsLoading(true);
    const response = await fetch(
      `${host}/admin/updateitem/${itemId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body : JSON.stringify({ price, resellPrice, itemInstock })
      }
    );

    setItem(await response.json());
    setIsLoading(false);
  };

  return { isLoading, UpdateItem, item };
};
