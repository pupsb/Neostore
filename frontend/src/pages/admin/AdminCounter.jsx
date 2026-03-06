import React, { useContext, useEffect, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import PointsQuery from "./QueryPoints";
import PointsQueryPh from "./QueryPointsPh";

const AdminCounter = () => {
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useState("all");
  const { user, host, token } = useContext(VariableContext);

  // Compute startDate/endDate from the selected preset
  function getDateRange(range) {
    const now = new Date();
    let startDate, endDate;

    switch (range) {
      case "today": {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = start.toISOString();
        endDate = now.toISOString();
        break;
      }
      case "7days": {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        startDate = start.toISOString();
        endDate = now.toISOString();
        break;
      }
      case "month": {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = start.toISOString();
        endDate = now.toISOString();
        break;
      }
      default:
        // "all" – no filtering
        return {};
    }
    return { startDate, endDate };
  }

  useEffect(() => {
    async function fetchdata() {
      const params = getDateRange(dateRange);
      const qs = new URLSearchParams(params).toString();
      const url = `${host}/admin/stats${qs ? `?${qs}` : ""}`;

      const response = await fetch(url, {
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
  }, [dateRange]);

  return (
    <div className="bg-[#252f3b] p-6">
      {/* Header row with title + date filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
        <div className="text-white font-semibold text-2xl text-center">
          All Orders
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-[#1c2733] text-white border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>
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
        <PointsQuery />
        <PointsQueryPh />
      </div>
    </div>
  );
};

export default AdminCounter;
