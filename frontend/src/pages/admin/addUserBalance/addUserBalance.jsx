import React, { useState } from "react";
import useAddUserBalance from "../../../hooks/admin/useAddUserBalance";

const AddUserBalance = ({ user, closeModal }) => {
  const { addUserBalance, isLoading, error } = useAddUserBalance();

  const [amount, setAmount] = useState("");

  const handleSubmit = async () => {
    try {
      await addUserBalance(user.userid, user.email, amount);
      alert(`Successfully added ₹${amount} to ${user.name}'s wallet. \n Please Refresh/Reload Page.`);
      closeModal(); // Close modal after success
    } catch (err) {
      alert("Failed to add balance. Please try again.");
      console.error("Error adding balance:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Add Balance for {user?.name}
      </h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 mb-4 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}
      <div className="flex justify-end space-x-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 text-white rounded ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Balance"}
        </button>
      </div>
    </div>
  );
};

export default AddUserBalance;
