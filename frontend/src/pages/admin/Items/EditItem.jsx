import React, { useState } from 'react';

export default function EditItem({ item, onSave, onClose }) {
    const [formData, setFormData] = useState(item);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'itemidarray' ? value.split(',').map(v => v.trim()) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await onSave(formData);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80%] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {Object.keys(item).map((key) => (
                            key !== 'itemid' && key!== "inStock" && key!=="isApi" && key!== "apiType" && key !== "_id" && key!== "createdAt" && key!== "updatedAt" && key!== "__v" && (
                                <div key={key} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={key === 'itemidarray' ? formData[key]?.join(', ') : formData[key] || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
