import React from "react";

const BalanceErr = () => {
  return (
    <div className="mt-16 lg:mx-24 mx-4 flex flex-col items-center">
      {/* Error Card */}
      <div className="bg-[#023E8A] border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-xl shadow-lg max-w-md w-full">
        {/* Message */}
        <h1 className="bg-yellow-400 text-white p-4 rounded-lg text-xl md:text-2xl font-bold text-center shadow-sm">
          Insufficient Balance
        </h1>
        {/* Message Body */}
        <p className="mt-4 text-center text-blue-100">
          Please add funds to your wallet to complete the transaction.
        </p>
        {/* CTA Button */}
        <div className="mt-6 flex justify-center">
          <a
            href="/topup"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-6 py-3 transition-all duration-300"
            aria-label="Go to wallet page"
          >
            Top-Up Wallet
          </a>
        </div>
      </div>
    </div>
  );
};

export default BalanceErr;
