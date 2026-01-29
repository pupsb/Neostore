import React, { useState, useContext } from "react";
import {VariableContext} from "../../../context/VariableContext";

const UpdateUserData = ({ user, closeModal }) => {

    const {host, token} = useContext(VariableContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    mobilenumber: user?.mobilenumber || "",
    email: user?.email || "",
    role: user?.role || "",
    verified: user?.verified || "false",
    isBlocked: user?.isBlocked || "false",
  });
  

  const [message, setMessage] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${host}/admin/updateuserdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, userid: user?.userid, _id: user._id }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "User updated successfully!, Please Refresh/Reload Page" });
        setTimeout(() => {
          closeModal();
        }, 2000); // Close the modal after 2 seconds
      } else {
        setMessage({ type: "error", text: result.message || "Failed to update user." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit User Data</h2>
      {message && (
        <div
          className={`mb-4 p-2 text-sm rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobilenumber"
            value={formData.mobilenumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="reseller">Reseller</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Verified</label>
          <select
            name="verified"
            value={formData.verified}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Block</label>
          <select
            name="isBlocked"
            value={formData.isBlocked}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="true">Blocked</option>
            <option value="false">Not Blocked</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserData;
