import React, { useContext, useEffect } from 'react';
import { useGetBalance } from '../../hooks/wallet/useGetBalance';
import { useGetPointsBalance } from '../../hooks/points/getPointsBalance';
import { VariableContext } from '../../context/VariableContext';
import { FaWallet, FaCoins, FaExchangeAlt, FaPlusCircle, FaHistory } from 'react-icons/fa';

const Balance = () => {
  const { user, token } = useContext(VariableContext);
  const { getBalance, balance, isLoading } = useGetBalance();
  const { getPointsBalance, pointsBalance } = useGetPointsBalance();

  useEffect(() => {
    function fetchData() {
      getBalance(user?.userid, token);
      getPointsBalance(user?.userid, token);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Balance */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaWallet className="text-white text-xl" />
              <h3 className="ml-3 text-xl font-semibold text-white">Wallet Balance</h3>
            </div>
            <a href="/wallet" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-all duration-200">
              <FaHistory />
              <span>View History</span>
            </a>
          </div>
          <div className="mb-4">
            <div className="text-3xl font-bold text-white">{balance?.balance} <span className="text-lg">W Coins</span></div>
          </div>
          <a
            href="/topup"
            className="flex items-center justify-center w-full px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200"
          >
            <FaPlusCircle className="mr-2" /> Top Up
          </a>
        </div>

        {/* Points Balance */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center mb-4">
            <FaCoins className="text-white text-xl" />
            <h3 className="ml-3 text-xl font-semibold text-white">Reward Points</h3>
          </div>
          <div className="mb-4">
            <div className="text-3xl font-bold text-white">
              {pointsBalance?.balance?.toFixed(2)} <span className="text-lg">Points</span>
            </div>
          </div>
          <a
            href="/redeem"
            className="flex items-center justify-center w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
          >
            <FaExchangeAlt className="mr-2" /> Redeem
          </a>
        </div>
      </div>
    </>
  );
};

export default Balance;