import { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";

export const useGetUsers = () => {
  const [isLoading1, setIsLoading] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0); // Add state for totalCount
  const { host } = useContext(VariableContext);

  const getUsers = async (token, currentPage = 1, rowsPerPage = 25) => {
    setIsLoading(true);
    const response = await fetch(`${host}/admin/users_data?page=${currentPage}&limit=${rowsPerPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    setUsers(data.users);
    setTotalPages(data.totalPages); // Set totalPages based on the response
    setTotalCount(data.totalCount); // Set totalCount based on the response
    setIsLoading(false);
  };

  return { isLoading1, getUsers, users, setUsers, totalPages, totalCount };
};
