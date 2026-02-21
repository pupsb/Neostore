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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-h-[80%] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {Object.keys(item).map((key) => (
                            key !== 'itemid' && key !== "inStock" && key !== "isApi" && key !== "apiType" && key !== "_id" && key !== "createdAt" && key !== "updatedAt" && key !== "__v" && (
                                <div key={key} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 capitalize">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={key === 'itemidarray' ? formData[key]?.join(', ') : formData[key] || ''}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            )
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-500"
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
