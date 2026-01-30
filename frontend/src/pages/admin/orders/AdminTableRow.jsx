import React, { useContext, useState } from "react";
import { useUpdateOrder } from "../../../hooks/admin/useUpdateOrder";

import { useAuth0 } from "@auth0/auth0-react";
import { VariableContext } from "../../../context/VariableContext";

const AdminTableRow = ({ data, setChange }) => {
  const { UpdateOrder, isLoading } = useUpdateOrder();
  const [reason, setReason] = useState("");
  const { token } = useContext(VariableContext);

  const { getAccessTokenSilently } = useAuth0();

  const handleUpdateOrder = async (orderId, status) => {
    try {
      // Use default reason if empty
      const updateReason = reason.trim() || "Admin action";
      await UpdateOrder(orderId, token, status, updateReason);
      setChange((prev) => !prev);
      // Show success message
      alert(`Order updated to ${status} successfully!`);
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Failed to update order. Please try again.");
    }
  };
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {data?.orderid}
      </th>
      <td className="px-6 py-4">{data?.itemname}</td>
      <td
        className="px-6 py-4"
        style={
          data?.status === "Processing"
            ? { color: "#FF962D" }
            : data?.status === "Completed"
              ? { color: "#9ACD32" }
              : { color: "#FF4646" }
        }
      >
        {data?.status}
      </td>
      <td className="px-6 py-4">{data?.input1}</td>
      <td className="px-6 py-4">{data?.input2}</td>
      <td className="px-6 py-4">₹ {data?.value}</td>
      <td className="px-6 py-4">{data?.useremail}</td>
      <td className="px-6 py-4">{data?.paymentmode}</td>
      <td className="px-6 py-4 flex">
        <button
          type="button"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => handleUpdateOrder(data?._id, "Completed")}
        >
          Completed
        </button>
        <button
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={() => handleUpdateOrder(data?._id, "Refunded")}
        >
          Refund
        </button>
        <button
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-red-900"
          onClick={() => handleUpdateOrder(data?._id, "Cancelled")}
        >
          Cancelled
        </button>
      </td>
      <td className="px-6 py-4">
        <input
          type="text"
          placeholder="Reason (optional)"
          className="border border-gray-300 rounded px-2 py-1 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          onChange={(e) => setReason(e.target.value)}
        />
      </td>
    </tr>
  );
};

export default AdminTableRow;
