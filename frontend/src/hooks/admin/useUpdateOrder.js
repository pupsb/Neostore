import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useUpdateOrder = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [order, setOrder] = useState([]);
  const { host } = useContext(VariableContext);

  const UpdateOrder = async (orderId, token, status1, reason) => {
    try {
      setIsLoading(true);
      console.log(`Updating order: ${orderId} to status: ${status1}, reason: ${reason}`);
      
      const response = await fetch(
        `${host}/admin/updateorder/${orderId}/${status1}/${reason}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrder(data);
      setIsLoading(false);
      return data;
    } catch (error) {
      console.error("UpdateOrder error:", error);
      setIsLoading(false);
      throw error;
    }
  };

  return { isLoading, UpdateOrder, order };
};
