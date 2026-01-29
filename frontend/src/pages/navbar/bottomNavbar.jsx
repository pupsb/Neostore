import React, { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faWallet, faHome, faShoppingBag, faHeadset, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const BottomNavBar = () => {
  const { isLoggedIn, user } = useContext(VariableContext);
  const location = useLocation();
  const [isSupporting, setIsSupporting] = useState(false);

  if (!isLoggedIn) return null;

  const navItems = [
    {
      path: '/dashboard',
      icon: faUserAlt,
      label: 'Profile',
    },
    {
      path: '/wallet',
      icon: faWallet,
      label: 'Wallet',
    },
    {
      path: '/orders',
      icon: faShoppingBag,
      label: 'Orders',
    },
    {
      path: '#support',
      icon: faHeadset,
      label: 'Support',
      isSupport: true,
    },
  ];

  const message = encodeURIComponent(
    `Name: ${user?.name || "N/A"}\nMobile: ${user?.mobilenumber || "N/A"}\nEmail: ${user?.email || "N/A"}\n\nHello Admin of neostoreofficial.in/,\nCould you please assist me?`
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4">
      {/* Support Modal */}
      {isSupporting && (
        <div className="absolute bottom-24 right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/919395578107?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://t.me/NeostoreSupport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTelegram} />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <div className="mx-4 bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="px-2 py-1">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;

              return item.isSupport ? (
                <button
                  key={item.label}
                  onClick={() => setIsSupporting(!isSupporting)}
                  className={`flex flex-col items-center py-3 px-4 relative ${isSupporting
                    ? 'text-blue-600'
                    : 'text-gray-600'
                    } hover:bg-gray-50 rounded-xl transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-xl mb-1 transition-transform ${isSupporting ? 'transform rotate-12' : ''
                      }`}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ) : (
                <a
                  key={item.label}
                  href={item.path}
                  className={`flex flex-col items-center py-3 px-4 relative ${isActive
                    ? 'text-blue-600'
                    : 'text-gray-600'
                    } hover:bg-gray-50 rounded-xl transition-colors`}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-xl mb-1 ${isActive ? 'transform scale-110 transition-transform' : ''
                      }`}
                  />
                  <span className="text-xs font-medium">{item.label}</span>
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;