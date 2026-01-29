import React, { useState } from "react";
import AddUserBalance from "../addUserBalance/addUserBalance";
import UpdateUserData from "./updateUserData";

const UsersTableRow = ({ user }) => {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTopUpModalOpen = () => setIsTopUpModalOpen(true);
  const handleTopUpModalClose = () => setIsTopUpModalOpen(false);

  const handleEditModalOpen = () => setIsEditModalOpen(true);
  const handleEditModalClose = () => setIsEditModalOpen(false);

  return (
    <>
      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <th
          scope="row"
          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {user?.userid}
        </th>
        <td className="px-6 py-4">{user?.name}</td>
        <td className="px-6 py-4">{user?.mobilenumber}</td>
        <td className="px-6 py-4">{user?.email}</td>
        <td className="px-6 py-4">{user?.role}</td>
        <td className="px-6 py-4">{user?.balance}</td>
        <td className="px-6 py-4">{user?.verified === "true" ? "Verified" : "Not Verified"}</td>
        <td className="px-6 py-4">{user?.isBlocked === "true" ? "Blocked" : "Not Blocked"}</td>
        <td className="px-6 py-4 space-x-2">
          <button onClick={handleTopUpModalOpen} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Top-Up
          </button>
          <button onClick={handleEditModalOpen} className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 mt-2">
            Edit
          </button>
        </td>
      </tr>

      {/* Top-Up Modal */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddUserBalance user={user} closeModal={handleTopUpModalClose} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <UpdateUserData user={user} closeModal={handleEditModalClose} />
          </div>
        </div>
      )}
    </>
  );
};

export default UsersTableRow;
