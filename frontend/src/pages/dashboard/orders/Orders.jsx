import React, { useState, useMemo, useContext, useEffect } from 'react';
import { useGetOrder } from '../../../hooks/useGetOrder';
import Spinner from '../../../components/Spinner';
import { VariableContext } from '../../../context/VariableContext';
import { timeFormatter } from '../../../utils/timeFormater';

const Orders = () => {
  const { user } = useContext(VariableContext);
  const { getOrders, isLoading1, orders } = useGetOrder();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('Uid/Email');
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetch() {
      await getOrders(user?._id);
    }
    fetch();
  }, []);

  const formatDateForComparison = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const today = formatDateForComparison(new Date());

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = formatDateForComparison(order?.createdAt);
      const matchesSearch = searchFilter === 'Uid/Email'
        ? order?.input1?.toLowerCase().includes(searchQuery.toLowerCase()) || order?.orderid?.toLowerCase().includes(searchQuery.toLowerCase())
        : order?.orderid?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order?.status === statusFilter;
      const matchesDateRange = (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [orders, searchQuery, searchFilter, statusFilter, startDate, endDate]);

  if (isLoading1) {
    return <div className='flex justify-center items-center min-h-screen'><Spinner /></div>;
  }

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">My Orders</h1>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search by ${searchFilter}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Uid/Email">Uid/Email</option>
                <option value="OrderId">OrderId</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Created">Created</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Orders List/Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uid/Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Mode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order?.orderid} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{order?.orderid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order?.itemname}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order?.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        order?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          order?.status === 'Refunded' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {order?.status === 'Refunded' && order?.reason}
                      {order?.status === 'Cancelled' && (order?.reason || 'No reason provided')}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order?.input1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{order?.value}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{order?.paymentmode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{timeFormatter(order?.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order?.status === 'Created' && (
                        <a
                          href={`https://neostore.in/confirmation?client_txn_id=${order?.orderid}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
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
          <div className="md:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div key={order?.orderid} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">#{order?.orderid}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order?.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                    order?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order?.status === 'Refunded' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {order?.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {(order?.status === 'Refunded' && order?.reason) ||
                    (order?.status === 'Cancelled' && order?.reason) ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Reason : &nbsp;
                      {order?.reason}
                    </p>
                  ) : null}

                  <p className="text-sm text-gray-600 dark:text-gray-300">Item: {order?.itemname}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Uid/Email: {order?.input1}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Price: ₹{order?.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Payment Method: {order?.paymentmode}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Date: {timeFormatter(order?.createdAt)}</p>
                  {order?.status === 'Created' && (
                    <a
                      href={`https://neostore.in/confirmation?client_txn_id=${order?.orderid}`}
                      className="block mt-3 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Verify Payment
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;