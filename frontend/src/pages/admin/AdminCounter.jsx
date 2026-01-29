import React, { useContext, useEffect, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import PointsQuery from "./QueryPoints";
import PointsQueryPh from "./QueryPointsPh";

const AdminCounter = () => {
  const [data, setData] = useState(null);
  const { user, host, token } = useContext(VariableContext);

  useEffect(() => {
    async function fetchdata() {
      const response = await fetch(`${host}/admin/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setData(data);
    }
    fetchdata();
  }, []);

  return (
    <div className="bg-[#252f3b] p-6">
      <div className="text-white font-semibold text-2xl text-center mb-6">
        All Orders
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        <div className="flex flex-col items-center bg-[#1c2733] p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-white">{data?.total_order}</div>
          <div className="text-sm text-gray-300">Total Orders</div>
        </div>
        <div className="flex flex-col items-center bg-[#1c2733] p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-white">{data?.completed}</div>
          <div className="text-sm text-gray-300">Completed</div>
        </div>
        <div className="flex flex-col items-center bg-[#1c2733] p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-white">{data?.refunded}</div>
          <div className="text-sm text-gray-300">Refunded</div>
        </div>
        <div className="flex flex-col items-center bg-[#1c2733] p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-white">{data?.processing}</div>
          <div className="text-sm text-gray-300">Processing</div>
        </div>
        <div className="flex flex-col items-center bg-[#1c2733] p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-white">₹ {data?.total_sale}</div>
          <div className="text-sm text-gray-300">Total Sale</div>
        </div>
      </div>
      <div className="mt-10 md:flex flex-row">
        <PointsQuery/>
        <PointsQueryPh/>
      </div>
    </div>
  );
};

export default AdminCounter;
