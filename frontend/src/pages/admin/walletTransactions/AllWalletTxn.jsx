// Component: AllWalletTxn.js
import React, { useContext, useEffect, useState } from 'react';
import { useGetAllWalletTxn } from '../../../hooks/admin/useGetAllWalletTxn';
import { VariableContext } from '../../../context/VariableContext';
import Spinner from '../../../components/Spinner';
import WalletTxnRow from './WalletTxnRow';

const AllWalletTxn = () => {
    const {
        isLoading,
        getWalletTxn,
        walletTxn,
        pagination
    } = useGetAllWalletTxn();
    const { token } = useContext(VariableContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [forOrderFilter, setForOrderFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50); // New state for rows per page

    useEffect(() => {
        getWalletTxn(token, currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage]);

    const handleSearchChange = (event) => setSearchQuery(event.target.value);
    const handleTypeFilterChange = (event) => setTypeFilter(event.target.value);
    const handleStatusFilterChange = (event) => setStatusFilter(event.target.value);
    const handleForOrderFilterChange = (event) => setForOrderFilter(event.target.value);
    const handleStartDateChange = (event) => setStartDate(event.target.value);
    const handleEndDateChange = (event) => setEndDate(event.target.value);
    const handleRowsPerPageChange = (event) => setRowsPerPage(Number(event.target.value)); // Handle change in rows per page

    const filteredTxns = walletTxn?.filter(order => {
        const matchesSearch =
            order?.txnid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order?.useremail?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType =
            typeFilter === 'All' || order?.type?.toLowerCase() === typeFilter.toLowerCase();

        const matchesStatus =
            statusFilter === 'All' || order?.status?.toLowerCase() === statusFilter.toLowerCase();

        const matchesForOrder =
            !forOrderFilter || order?.orderid?.toLowerCase().includes(forOrderFilter.toLowerCase());

        const orderDate = new Date(order?.updatedAt);
        const matchesDateRange =
            (!startDate || orderDate >= new Date(startDate)) &&
            (!endDate || orderDate <= new Date(endDate));

        return matchesSearch && matchesType && matchesStatus && matchesForOrder && matchesDateRange;
    });

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            {!isLoading ? (
                <div className="mt-[1rem] lg:mx-[1rem] mx-[1rem] flex flex-col gap-3">
                    {/* Filter Section */}
                    <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                        {/* Search by Transaction ID or Email */}
                        <input
                            type="text"
                            placeholder="Search by Transaction ID or Email"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                        />

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={handleTypeFilterChange}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
                        >
                            <option value="All">Type</option>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                            <option value="Refunded">Refunded</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
                        >
                            <option value="All">Status</option>
                            <option value="Success">Success</option>
                            <option value="Failed">Failed</option>
                            <option value="Created">Created</option>
                        </select>

                        {/* For Order Filter */}
                        <input
                            type="text"
                            placeholder="Filter by Order ID"
                            value={forOrderFilter}
                            onChange={handleForOrderFilterChange}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                        />

                        {/* Date Range Filters */}
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
                        {/* Rows per Page Filter */}
                        <select
                            value={rowsPerPage}
                            onChange={handleRowsPerPageChange}
                            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-auto"
                        >
                            <option value={50}>50 Rows</option>
                            <option value={100}>100 Rows</option>
                            <option value={250}>250 Rows</option>
                            <option value={500}>500 Rows</option>
                        </select>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex flex-wrap justify-between items-center mt-1 space-y-2 sm:space-y-0">
                        <div className="text-sm text-gray-600 text-center w-full sm:w-auto">
                            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                            {pagination.totalItems} transactions
                        </div>
                        <div className="flex flex-wrap justify-center items-center space-x-2 w-full sm:w-auto">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            {pagination.currentPage > 1 && (
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    className="px-4 py-2 bg-gray-200"
                                >
                                    {pagination.currentPage - 1}
                                </button>
                            )}
                            <span className="px-4 py-2 bg-blue-500 text-white rounded">
                                {pagination.currentPage}
                            </span>
                            {pagination.currentPage < pagination.totalPages && (
                                <button
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    className="px-4 py-2 bg-gray-200"
                                >
                                    {pagination.currentPage + 1}
                                </button>
                            )}
                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
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
                                    <th scope="col" className="px-6 py-3">Transaction ID</th>
                                    <th scope="col" className="px-6 py-3">Type</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">For Order</th>
                                    <th scope="col" className="px-6 py-3">User ID</th>
                                    <th scope="col" className="px-6 py-3">User Email</th>
                                    <th scope="col" className="px-6 py-3">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTxns?.map((order) => (
                                    <WalletTxnRow key={order.txnid} data={order} />
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
        </>
    );
};

export default AllWalletTxn;