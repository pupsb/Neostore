// src/components/NavBar.js
import React, { useContext, useEffect, useState } from "react";
import "flowbite";
import { initFlowbite } from "flowbite";
import { useAuth0 } from "@auth0/auth0-react";
import { VariableContext } from "../../context/VariableContext";
import defaultpp from "../../assets/defaultpp.png";
import logo from '../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Sidebar from "./sideBar";

const NavBar = () => {
  const { isLoading } = useAuth0();
  const { isLoggedIn, deleteUser, user } = useContext(VariableContext);

  // State to manage sidebar visibility
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    initFlowbite();
  }, [isLoggedIn]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {!isLoading && (
        <nav className="bg-white border-b md:bg-opacity-100">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="/Untitled design.png" alt="" className="w-14 rounded-lg" />
              <span className="text-xl font-bold text-black uppercase tracking-wider shadow-l">
                NeoStore
              </span>
            </a>

            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              {!isLoggedIn ? (
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-[#03045E] dark:hover:bg-[#023E8A] dark:focus:ring-blue-800"
                  onClick={() => window.location = "/login"}
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                  <button type="button" className="flex text-sm bg-[#293133] rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 rounded-full" src={defaultpp} alt="user photo" />
                  </button>

                  <div className="z-50 hidden my-4 text-base list-none bg-gray-100 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                    <div className="px-4 py-3">
                      <span className="block text-sm text-white-900 dark:text-white">{user?.name}</span>
                      <span className="block text-sm text-white-500 truncate dark:text-white">{user?.email}</span>
                    </div>
                    <ul className="py-2" aria-labelledby="user-menu-button">
                      <li>
                        <a href="/dashboard" className="block px-4 py-2 text-sm text-black hover:bg-green-500 dark:hover:bg-green-600 dark:text-white dark:hover:text-white">Dashboard</a>
                      </li>
                      <li>
                        <a href="/wallet" className="block px-4 py-2 text-sm text-black hover:bg-green-500 dark:hover:bg-green-600 dark:text-white dark:hover:text-white">Wallet</a>
                      </li>
                      <li>
                        <a href="/orders" className="block px-4 py-2 text-sm text-black hover:bg-green-500 dark:hover:bg-green-600 dark:text-white dark:hover:text-white">Orders</a>
                      </li>

                      {user?.role === "admin" && (
                        <li>
                          <a href="/admin" className="block px-4 py-2 text-sm text-black hover:bg-blue-500 dark:hover:bg-blue-600 dark:text-white dark:hover:text-white">Admin Dashboard</a>
                        </li>
                      )}
                      <li>
                        <a
                          className="block px-4 py-2 text-sm text-black hover:bg-green-500 dark:hover:bg-red-600 dark:text-white dark:hover:text-white"
                          onClick={() => {
                            deleteUser();
                            window.location = "/home";
                          }}
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-blue bg-[#E11D48] rounded-md md:hidden hover:bg-[#E11D48] focus:outline-none focus:ring-2 focus:ring-[#005F99] dark:hover:bg-[#E11D48] dark:focus:ring-black"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Sidebar component */}
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default NavBar;
