import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation(); // Get the current path

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 fixed md:relative inset-0 bg-gray-800 text-white w-64 p-5 transition-transform duration-300 ease-in-out z-50 overflow-y-auto`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Welcome Admin</h2>
        </div>
        <ul className="mt-8 space-y-4">
          <li>
            <Link
              to="/admin"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-600"
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/orders"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Pending Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/price"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/price"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Update Products and Items
            </Link>
          </li>
          <li>
            <Link
              to="/admin/usersdata"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/usersdata"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              User Data
            </Link>
          </li>
          <li>
            <Link
              to="/admin/txn"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/txn"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              All Orders
            </Link>
          </li>
          <li>
            <Link
              to="/admin/wallettxn"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/wallettxn"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Wallet Transactions
            </Link>
          </li>
          <li>
            <Link
              to="/admin/admingallery"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/admingallery"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/admin/createproduct"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/createproduct"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Create Product
            </Link>
          </li>
          <li>
            <Link
              to="/admin/createitems"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/createitems"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              Create Items
            </Link>
          </li>
          <li>
            <Link
              to="/admin/viewitems"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/viewitems"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              View Items
            </Link>
          </li>
          <li>
            <Link
              to="/admin/viewproducts"
              onClick={closeSidebar}
              className={`block p-3 rounded-md transition-colors ${
                pathname === "/admin/viewproducts"
                  ? "bg-blue-500 hover:bg-blue-400"
                  : "hover:bg-gray-700"
              }`}
            >
              View Products
            </Link>
          </li>
        </ul>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-r-md z-50 ${
          isSidebarOpen ? "right-0" : "right-0"
        }`}
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </>
  );
}
