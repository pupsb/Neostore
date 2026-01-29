import React, { useContext, useEffect, useState } from 'react';
import { useGetTransactions } from '../../../hooks/wallet/useGetTransactions';
import { VariableContext } from '../../../context/VariableContext';
import Spinner from '../../../components/Spinner';
import { timeFormatter } from '../../../utils/timeFormater';
import { FaSearch, FaFilter } from 'react-icons/fa';



const Transactions = () => {
  const { getTxns, isLoading, txns } = useGetTransactions();
  const { user, token } = useContext(VariableContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    async function fetch() {
      await getTxns(user?.userid, token);
    }
    fetch();
  }, []);

  const formatDateForComparison = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const today = formatDateForComparison(new Date());

  const filteredTxns = txns.filter(txn => {
    const matchesSearch = txn.txnid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || txn.status === statusFilter;
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Refunded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]"><Spinner /></div>;
  }

  return (
    <div className="max-w-7xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet Transactions</h2>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Transaction ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Processing">Processing</option>
              <option value="Success">Success</option>
              <option value="Refunded">Refunded</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTxns.map((txn) => (
                <tr key={txn.txnid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{txn.txnid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{txn.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{txn.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{timeFormatter(txn.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {txn.status === "Created" && (
                      <a
                        href={`https://neostore.in/walletconfirmation?client_txn_id=${txn.txnid}`}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Verify Payment
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {filteredTxns.map((txn) => (
            <div key={txn.txnid} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">#{txn.txnid}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(txn.status)}`}>
                  {txn.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">Type: {txn.type}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount: ₹{txn.amount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date: {timeFormatter(txn.createdAt)}</p>
                {txn.status === "Created" && (
                  <a
                    href={`https://neostore.in/walletconfirmation?client_txn_id=${txn.txnid}`}
                    className="block mt-3 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Verify Payment
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredTxns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;