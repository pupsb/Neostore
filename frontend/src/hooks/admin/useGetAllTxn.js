import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useGetAllTxn = () => {
  const [isLoading1, setIsLoading] = useState(null);
  const [txn, setTxn] = useState([]);
  const [totalTxns, setTotalTxns] = useState(0); // New state for total transactions
  const [page, setPage] = useState(1); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(50); // Rows per page
  const { host } = useContext(VariableContext);

  const getTxn = async (token, page, limit) => {
    setIsLoading(true);
    const response = await fetch(`${host}/admin/alltxn?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setTxn(data.transactions);
    setTotalTxns(data.totalTxns); // Update total transactions
    setIsLoading(false);
  };

  return { isLoading1, getTxn, txn, totalTxns, page, setPage, rowsPerPage, setRowsPerPage };
};
