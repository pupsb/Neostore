import { useAuth0 } from "@auth0/auth0-react";
import React, { useContext, useEffect, useState } from "react";
import AdminTableRow from "./AdminTableRow";
import { useGetProcessingOrder } from "../../../hooks/admin/useGetProcessingOrder";
import Spinner from "../../../components/Spinner";
import { VariableContext } from "../../../context/VariableContext";

const OrdersAdminTable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { orders, getOrders, isLoading1 } = useGetProcessingOrder();
  const [change, setChange] = useState(true);
  const { token, host } = useContext(VariableContext);

  useEffect(() => {
    async function fetch() {
      // const token = await getAccessTokenSilently();
      await getOrders(token);
    }
    fetch();
  }, [change]);

  const handleExportCsv = async () => {
    try {
      const res = await fetch(`${host}/admin/export/orders`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed", err);
    }
  };

  return (
    <>
      {!isLoading1 ? (
        <div className="mt-[1rem] lg:mx-[1rem] mx-[1rem] flex flex-col gap-3">
          {/* Export button */}
          <div className="flex justify-end">
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              ⬇ Export CSV
            </button>
          </div>

          {orders?.length > 0 ? (
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Item name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Userid
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Input2
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <AdminTableRow key={order.id} data={order} setChange={setChange} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 mt-4">
              No pending orders.
            </div>
          )}
        </div>
      ) : (
        <div className="justify-center items-center mt-[6rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-3">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default OrdersAdminTable;
