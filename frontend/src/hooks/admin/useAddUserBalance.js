import { useState, useContext } from "react";
import { VariableContext } from "../../context/VariableContext";

const useAddUserBalance = () => {
    const {token, host} = useContext(VariableContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addUserBalance = async (userId, email, amount) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${host}/admin/adduserbalance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if authentication is required
        },
        body: JSON.stringify({ userId, email, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add balance");
      }

      const data = await response.json();
      return data; // Return response to the caller
    } catch (err) {
      setError(err.message);
      console.error("Error adding balance:", err);
      throw err; // Re-throw error for further handling
    } finally {
      setIsLoading(false);
    }
  };

  return { addUserBalance, isLoading, error };
};

export default useAddUserBalance;
