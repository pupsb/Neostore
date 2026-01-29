import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { host } = useContext(VariableContext);
  const { token } = useContext(VariableContext);

  const updateProduct = async (_id, instock, importantNote) => {
    console.log("updateProducthook");
    console.log(_id, instock, importantNote);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${host}/admin/updateproduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
          },
          body: JSON.stringify({ _id, instock , importantNote})
        }
      );
      setResponse(await response.json());
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, updateProduct, response };
};
