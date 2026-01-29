import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Correct import for faTimes
import { useContext } from 'react';
import { VariableContext } from '../../context/VariableContext';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { isLoggedIn, deleteUser, user } = useContext(VariableContext);

  // Construct the WhatsApp message dynamically
  const message = encodeURIComponent(
    `Name: ${user?.name || "N/A"}\nMobile: ${user?.mobilenumber || "N/A"}\nEmail: ${user?.email || "N/A"}\n\nHello Admin of woexsupply.com,\nCould you please assist me?`
  );

  // WhatsApp link with the constructed message
  const whatsappLink = `https://wa.me/919395578107?text=${message}`;

  return (
    <>
      {isSidebarOpen && (
        <div
          className={`fixed inset-0 z-40 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={toggleSidebar}
        >
          <div
            className="fixed left-0 top-[60px] w-[70%] h-full bg-white shadow-xl p-4 z-50 transition-transform transform duration-300 ease-in-out"
            style={{ transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-xl text-gray-800 hover:text-blue-600"
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <ul className="space-y-6 mt-12">
              <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                <a href="/" className="block py-2 px-4 rounded-lg bg-red-100">
                  Home
                </a>
              </li>
              <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center py-2 px-4 rounded-lg bg-red-100">
                  <FontAwesomeIcon icon={faWhatsapp} className="mr-2" /> Contact
                </a>
              </li>
              {!isLoggedIn ? (
                <>
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a href="/login" className="block py-2 px-4 rounded-lg bg-red-100">
                      Login
                    </a>
                  </li>
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a href="/register" className="block py-2 px-4 rounded-lg bg-green-100">
                      Create Account
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a href="/dashboard" className="block py-2 px-4 rounded-lg bg-red-100">
                      Dashboard
                    </a>
                  </li>
                  {user?.role === "admin" && (
                    <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                      <a href="/admin" className="block py-2 px-4 rounded-lg bg-red-100">
                        Admin Dashboard
                      </a>
                    </li>
                  )}
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a href="/privacypage" className="block py-2 px-4 rounded-lg bg-red-100">
                      Privacy Policy
                    </a>
                  </li>
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a href="/refund-policy" className="block py-2 px-4 rounded-lg bg-red-100">
                      Refund Policy
                    </a>
                  </li>
                  <li className="text-lg text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    <a
                      className="block py-2 px-4 rounded-lg bg-red-100"
                      onClick={() => {
                        deleteUser();
                        window.location = "/home";
                      }}
                    >
                      Sign out
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
