import React, { useState, useContext } from "react";
import axios from "axios";
import { VariableContext } from "../../../context/VariableContext";

export default function CreateItems() {
  const { host, token } = useContext(VariableContext);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    suggestedTask: "",
    // inStock: true,
    // itemid: "",
    itemidarray: [""],
    originalprice: "",
    discountedprice: "",
    resellprice: "",
    isApi: false,
    apiType: "",
    imgpath: "",
  });

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required.";
    // if (!formData.itemid || isNaN(formData.itemid)) return "Valid Item ID is required.";
    if (!formData.originalprice || isNaN(formData.originalprice)) return "Valid Original Price is required.";
    if (!formData.discountedprice || isNaN(formData.discountedprice)) return "Valid Discounted Price is required.";
    if (!formData.resellprice || isNaN(formData.resellprice)) return "Valid Resell Price is required.";
    if (formData.isApi && !formData.apiType) return "API Type is required when Is API is true.";
    if (!formData.imgpath.trim()) return "Image Path is required.";
    return null;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "inStock" || name === "isApi" ? value === "true" : value,
    });
  };

  const handleAddItemId = () => {
    setFormData({
      ...formData,
      itemidarray: [...formData.itemidarray, ""],
    });
  };

  const handleRemoveItemId = (index) => {
    setFormData({
      ...formData,
      itemidarray: formData.itemidarray.filter((_, idx) => idx !== index),
    });
  };

  const handleItemIdChange = (index, value) => {
    const updatedArray = formData.itemidarray.map((id, idx) => (idx === index ? value : id));
    setFormData({
      ...formData,
      itemidarray: updatedArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      const response = await axios.post(`${host}/admin/createitem`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item created successfully!");
      // console.log(response.data);
    } catch (error) {
      console.error(error);
      alert("Error creating item.");
    }
  };

  return (
    <div className="p-6 mb-12 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Name:</label>
          <input
            type="text"
            name="name"
            className="block w-full p-2 border rounded"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Type: optional</label>
          <select
            name="type"
            className="block w-full p-2 border rounded"
            value={formData.type}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Type</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="weekly">Weekly</option>
            <option value="hot">Hot</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Suggested Task: optional</label>
          <input
            type="text"
            name="suggestedTask"
            className="block w-full p-2 border rounded"
            value={formData.suggestedTask}
            onChange={handleInputChange}
          />
        </div>
        {/* <div>
          <label className="block font-medium mb-2">In Stock:</label>
          <select
            name="inStock"
            className="block w-full p-2 border rounded"
            value={formData.inStock}
            onChange={handleInputChange}
          >
            <option value={true}>True</option>
            <option value={false}>False</option>
          </select>
        </div> */}
        {/* <div>
          <label className="block font-medium mb-2">Item ID: unique</label>
          <input
            type="number"
            name="itemid"
            className="block w-full p-2 border rounded"
            value={formData.itemid}
            onChange={handleInputChange}
          />
        </div> */}
        <div>
          <label className="block font-medium mb-2">Original Price:</label>
          <input
            type="number"
            name="originalprice"
            className="block w-full p-2 border rounded"
            value={formData.originalprice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Discounted Price:</label>
          <input
            type="number"
            name="discountedprice"
            className="block w-full p-2 border rounded"
            value={formData.discountedprice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Resell Price:</label>
          <input
            type="number"
            name="resellprice"
            className="block w-full p-2 border rounded"
            value={formData.resellprice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Is API:</label>
          <select
            name="isApi"
            className="block w-full p-2 border rounded"
            value={formData.isApi}
            onChange={handleInputChange}
          >
            <option value={false}>False</option>
            <option value={true}>True</option>
          </select>
        </div>
        {formData.isApi && (
          <div>
          <div>
            <label className="block font-medium mb-2">API Type:</label>
            <select
              name="apiType"
              className="block w-full p-2 border rounded"
              value={formData.apiType}
              onChange={handleInputChange}
            >
              <option value="">Select API Type</option>
              <option value="SMILEBR">SMILEBR</option>
              <option value="SMILEPH">SMILEPH</option>
              <option value="MOOGOLDMLBB">MOOGOLDMLBB</option>
              <option value="MOOGOLDGENSHIN">MOOGOLDGENSHIN</option>
              <option value="MOOGOLDHOK">MOOGOLDHOK</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
          <div>
          <label className="block font-medium mb-2 mt-2">Item ID Array: optional</label>
          {formData.itemidarray.map((id, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="block w-full p-2 border rounded mr-2"
                value={id}
                onChange={(e) => handleItemIdChange(index, e.target.value)}
              />
              <button
                type="button"
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleRemoveItemId(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddItemId}
          >
            Add Item ID
          </button>
        </div>
          </div>
          
        )}
        
        <div>
          <label className="block font-medium mb-2">Image Path:</label>
          <input
            type="text"
            name="imgpath"
            className="block w-full p-2 border rounded"
            value={formData.imgpath}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}