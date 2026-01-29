import React, { useState, useContext } from 'react';
import closeIcon from "../../assets/close-icon.png";
import { VariableContext } from '../../context/VariableContext';

export default function PopupAd({ popupData }) {
  const { host } = useContext(VariableContext);
  const [isPopupVisible, setIsPopupVisible] = useState(true);

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  // Ensure `popupData` exists and has at least one item before rendering
  if (!popupData || popupData.length === 0 || !isPopupVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-50 py-4">
      <div className="relative bg-white rounded-t-lg shadow-lg w-full max-w-xs sm:max-w-md mx-4">
        <img
          src={`${popupData[0].url}`}
          alt="Ad"
          className="w-full h-auto rounded-t-lg object-cover"
          style={{ borderTopLeftRadius: "0.5rem", borderTopRightRadius: "0.5rem" }}
        />
        <button
          onClick={handlePopupClose}
          className="absolute top-2 right-2 p-1"
        >
          <img src={closeIcon} alt="Close" className="w-7 h-7 sm:w-6 sm:h-6" />
        </button>

        {/* WhatsApp Join Button */}
      </div>
      <button
        onClick={() => window.open(`${popupData[0].redirectUrl}`, "_blank")}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg text-sm sm:text-base font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
      >
        {popupData[0].title}
      </button>
    </div>
  );
}
