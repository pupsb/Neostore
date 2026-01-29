import React, { useContext, useState } from "react";
import { VariableContext } from "../../context/VariableContext";
import { usePostTransaction } from "../../hooks/wallet/usePostTransaction";

const TopUp = () => {
  const [value, setValue] = useState("");
  const { user, token } = useContext(VariableContext);
  const { postOrder } = usePostTransaction();

  const amountOptions = [
    { value: "100", label: "₹100" },
    { value: "250", label: "₹250" },
    { value: "500", label: "₹500" },
    { value: "1000", label: "₹1000" },
    { value: "2000", label: "₹2000" },
    { value: "5000", label: "₹5000" },
  ];

  const handleSubmit = () => {
    const amount = parseInt(value);

    if (amount <= 0 || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }

    const userid = user?.userid;
    const values = { value, userid };
    postOrder(values, token);
  };

  return (
    <div className="mt-[3rem] lg:mx-[6rem] mx-[1rem] flex flex-col gap-6 items-center">
      {/* Heading Section */}
      <h1 className="text-3xl font-bold text-[#0077B6]">Top-Up Your Wallet</h1>
      <p className="text-gray-600 text-sm md:text-base text-center max-w-[600px]">
        Choose from preset amounts or enter a custom amount to top up your wallet.
      </p>

      {/* Input Section */}
      <div className="flex flex-col w-full max-w-md gap-4">
        <div className="flex justify-between items-center">
          <label className="text-lg font-medium text-[#03045E]">
            Enter Custom Amount
          </label>
          {value && (
            <button
              onClick={() => setValue("")}
              className="text-sm text-blue-800 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            ₹
          </span>
          <input
            type="number"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter amount"
            className="pl-8 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent"
          />
        </div>
      </div>

      {/* Amount Options Section */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-md">
        {amountOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setValue(option.value)}
            className={`px-4 py-2 rounded-lg border ${value === option.value
                ? "bg-blue-800 text-white border-blue-800"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-800 hover:text-blue-800"
              } transition-colors duration-200`}
          >
            {option.label}
          </button>
        ))}
      </div>


      {/* Button Section */}
      <button
        type="button"
        className={`mt-4 w-full max-w-md text-white font-medium rounded-lg text-base px-6 py-3 ${value
            ? "bg-blue-800 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
          }`}
        onClick={handleSubmit}
        disabled={!value}
      >
        Top Up {value && `₹${value}`}
      </button>

      {/* Information Section */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>Make sure to double-check your amount before proceeding.</p>
        <p className="text-[#0077B6] font-medium">
          Contact support if you face any issues.
        </p>
      </div>
    </div>
  );
};

export default TopUp;