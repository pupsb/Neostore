import React, { useContext, useState, useEffect } from 'react';
import { VariableContext } from '../../../context/VariableContext';
import { useEditItems } from '../../../hooks/admin/useEditItems';
import EditItem from './EditItem';

export default function AllItems() {
    const { host, token } = useContext(VariableContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isEditing, editItem, startEdit, saveEdit, closeEdit } = useEditItems(host, token);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${host}/admin/getallitems`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }

                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [host, token]);

    const updateItems = async (updatedItem) => {
        const success = await saveEdit(updatedItem);
        if (success) {
            setItems((prevItems) =>
                prevItems.map((item) => (item.itemid === updatedItem.itemid ? updatedItem : item))
            );
        }
        return success;
    };

    const deleteItem = async (itemId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this item?');
        if (confirmDelete) {
            try {
                const response = await fetch(`${host}/admin/deleteitem/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to delete item');
                }

                setItems((prevItems) => prevItems.filter((item) => item.itemid !== itemId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">All Items</h1>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Item ID</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">API Type</th>
                            <th className="px-6 py-3">In Stock</th>
                            <th className="px-6 py-3">Original Price</th>
                            <th className="px-6 py-3">Discounted Price</th>
                            <th className="px-6 py-3">Resell Price</th>
                            <th className="px-6 py-3">Suggested Task</th>
                            <th className="px-6 py-3">ItemId Array</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.itemid} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{item.itemid}</td>
                                <td className="px-6 py-4">{item.name}</td>
                                <td className="px-6 py-4">{item.apiType || 'N/A'}</td>
                                <td className="px-6 py-4">{item.inStock ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4">{item.originalprice}</td>
                                <td className="px-6 py-4">{item.discountedprice}</td>
                                <td className="px-6 py-4">{item.resellprice}</td>
                                <td className="px-6 py-4">{item.suggestedTask || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    {item.itemidarray ? item.itemidarray.join(', ') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 flex space-x-2">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="text-blue-500 hover:text-blue-700 font-bold"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteItem(item.itemid)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isEditing && (
                <EditItem item={editItem} onSave={updateItems} onClose={closeEdit} />
            )}
        </div>
    );
}
