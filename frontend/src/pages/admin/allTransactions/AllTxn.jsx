import React, { useContext, useEffect, useState } from 'react';
import { useGetAllTxn } from '../../../hooks/admin/useGetAllTxn';
import { VariableContext } from '../../../context/VariableContext';
import TxnRow from './TxnRow';
import Spinner from '../../../components/Spinner';

const AllTxn = () => {
  const { getTxn, txn, isLoading1, totalTxns, page, setPage, rowsPerPage, setRowsPerPage } = useGetAllTxn();
  const { token } = useContext(VariableContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [userInputSearch, setUserInputSearch] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetch() {
      await getTxn(token, 1, rowsPerPage); // Default to page 1 when initially loading
    }
    fetch();
  }, [token, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleUserInputSearchChange = (event) => {
    setUserInputSearch(event.target.value);
  };

  const handlePaymentMethodFilterChange = (event) => {
    setPaymentMethodFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getTxn(token, newPage, rowsPerPage); // Update page and fetch data for that page
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // Reset to page 1 when rows per page is changed
    getTxn(token, 1, event.target.value); // Fetch data for page 1 with updated rowsPerPage
  };

  const filteredTxns = txn?.filter((order) => {
    const matchesSearch =
      order?.transactionid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order?.useremail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order?.status === statusFilter;
    const matchesUserInput =
      order?.input1?.toLowerCase().includes(userInputSearch.toLowerCase()) ||
      order?.input2?.toLowerCase().includes(userInputSearch.toLowerCase());
    const matchesPaymentMethod =
      paymentMethodFilter === 'All' || order?.paymentmode === paymentMethodFilter;

    const orderDateString = new Date(order?.updatedAt).toDateString();
    const startDateString = startDate ? new Date(startDate).toDateString() : null;
    const endDateString = endDate ? new Date(endDate).toDateString() : null;
    const matchesDateRange =
      (!startDateString || new Date(orderDateString) >= new Date(startDateString)) &&
      (!endDateString || new Date(orderDateString) <= new Date(endDateString));

    return (
      matchesSearch &&
      matchesStatus &&
      matchesUserInput &&
      matchesPaymentMethod &&
      matchesDateRange
    );
  });

  const totalPages = Math.ceil(totalTxns / rowsPerPage); // Calculate the total number of pages

  const generatePageNumbers = () => {
    const pageNumbers = [];
    if (page > 2) pageNumbers.push(page - 1);
    pageNumbers.push(page);
    if (page < totalPages) pageNumbers.push(page + 1);
    if (pageNumbers[pageNumbers.length - 1] < totalPages) pageNumbers.push(totalPages);
    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div>
      {!isLoading1 ? (
        <div className="mt-[1rem] lg:mx-[1rem] mx-[1rem] flex flex-col gap-3">
          {/* Filter Section */}
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <input
              type="text"
              placeholder="Search by Order ID or Email"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
            />

            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
            >
              <option value="All">Status</option>
              <option value="Processing">Processing</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
              <option value="Created">Created</option>
              <option value="Refunded">Refunded</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <input
              type="text"
              placeholder="Search User Input"
              value={userInputSearch}
              onChange={handleUserInputSearchChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
            />

            <select
              value={paymentMethodFilter}
              onChange={handlePaymentMethodFilterChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
            >
              <option value="All">Payment Method</option>
              <option value="upi">Upi</option>
              <option value="wallet">Wallet</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
            />

            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
            />
          </div>

          {/* Pagination Control */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            {/* Rows per page section */}
            <div className="mb-4 sm:mb-0">
              <label htmlFor="rowsPerPage" className="mr-2 text-sm">Rows per page:</label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
              </select>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-sm">Total Rows: {totalTxns}</span>

              {/* Previous button */}
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md text-sm"
              >
                Prev
              </button>

              {/* Page numbers */}
              {pageNumbers.map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`p-2 sm:px-4 sm:py-2 text-sm rounded-md ${page === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Next button */}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-md text-sm"
              >
                Next
              </button>
            </div>
          </div>


          {/* Transaction Table */}
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Order Id</th>
                  <th scope="col" className="px-6 py-3">Item name</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">User Input1</th>
                  <th scope="col" className="px-6 py-3">User Input2</th>
                  <th scope="col" className="px-6 py-3">Price</th>
                  <th scope="col" className="px-6 py-3">Payment Method</th>
                  <th scope="col" className="px-6 py-3">User Email</th>
                  <th scope="col" className="px-6 py-3">Updated At</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns?.map((order) => (
                  <TxnRow key={order.transactionid} data={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="justify-center items-center mt-[6rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-3">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default AllTxn;
