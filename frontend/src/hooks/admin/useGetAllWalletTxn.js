// Hook: useGetAllWalletTxn.js
import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useGetAllWalletTxn = () => {
  const [isLoading, setIsLoading] = useState(null);
  const [walletTxn, setWalletTxn] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 50
  });
  const { host } = useContext(VariableContext);

  const getWalletTxn = async (token, page = 1, limit = 50) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${host}/admin/allwallettxn?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      setWalletTxn(data.transactions);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: limit
      });
    } catch (error) {
      console.error("Error fetching wallet transactions:", error);
      setWalletTxn([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    isLoading, 
    getWalletTxn, 
    walletTxn, 
    setWalletTxn,
    pagination 
  };
};
