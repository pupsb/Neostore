import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import { useGetBalance } from '../../hooks/wallet/useGetBalance';
import { useGetPointsBalance } from '../../hooks/points/getPointsBalance';
import defaultpp from "../../assets/defaultpp.png";
import useEditProfile from "../../hooks/useEditProfile";
import { FaWallet, FaCoins, FaExchangeAlt, FaPlusCircle, FaHistory, FaEdit, FaCheck, FaBox, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Balance from "./Balance";
import Orders from "./orders/Orders";

const Dashboard = () => {
  const { isLoading: authLoading } = useAuth0();
  const { user, host, token } = useContext(VariableContext);
  const { getBalance, balance, isLoading: balanceLoading } = useGetBalance();
  const { getPointsBalance, pointsBalance } = useGetPointsBalance();
  const { editProfile, message } = useEditProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [orderStats, setOrderStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getBalance(user?.userid, token);
      await getPointsBalance(user?.userid, token);

      const response = await fetch(`${host}/user/myorder/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrderStats(data);
    };
    fetchData();
  }, []);

  if (authLoading || balanceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
                  <img src={defaultpp} alt="Profile" className="w-full h-full object-cover" />
                </div>

                <div className="mt-4 w-full">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">User ID</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user?.userid}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Name</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="px-3 py-1 rounded border text-gray-900"
                        />
                      ) : (
                        <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Email</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Mobile</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user?.mobilenumber || "N/A"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isEditing) {
                        editProfile(user?.userid, { name });
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="mt-6 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <FaCheck className="mr-2" /> Save Changes
                      </>
                    ) : (
                      <>
                        <FaEdit className="mr-2" /> Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Balance & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Balance Cards */}
            <Balance />

            {/* Order Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <FaBox className="text-blue-600 dark:text-blue-400 text-xl" />
                  </div>
                  <h3 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">
                    Order Statistics
                  </h3>
                </div>

                <a
                  href="/orders"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200"
                >
                  <FaHistory className="text-lg" />
                  <span>View History</span>
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{orderStats?.total_order}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total Orders</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{orderStats?.completed}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Completed</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-red-600">{orderStats?.refunded}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Refunded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <Orders />
      </div>
    </div>
  );
};

export default Dashboard;