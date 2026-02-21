import React, { useState, useEffect } from 'react';

const EditProductModal = ({ isOpen, onClose, product, onUpdate, host, token }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        apiType: '',
        category: '',
        istrending: false,
        importantnote: '',
        items: '',
        instock: false,
        imgpath: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                type: product.type || '',
                apiType: product.apiType || '',
                category: product.category || '',
                istrending: product.istrending || false,
                importantnote: product.importantnote || '',
                items: product.items?.join(', ') || '',
                instock: product.instock || false,
                imgpath: product.imgpath || '',
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) return 'Product name is required.';
        if (!formData.type.trim()) return 'Product type is required.';
        if (!formData.category.trim()) return 'Category is required.';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${host}/admin/editproduct/${product._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    items: formData.items.split(',').map((item) => item.trim()),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }

            const updatedProduct = await response.json();
            onUpdate(updatedProduct);
            onClose();
            alert('Product updated successfully!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Type</label>
                            <input type="text" name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">API Type</label>
                            <input type="text" name="apiType" value={formData.apiType} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Items (comma-separated)</label>
                            <input type="text" name="items" value={formData.items} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Important Note</label>
                            <input type="text" name="importantnote" value={formData.importantnote} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image Path (URL)</label>
                            <input type="text" name="imgpath" value={formData.imgpath} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="istrending" checked={formData.istrending} onChange={handleChange} className="w-4 h-4" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Is Trending</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="instock" checked={formData.instock} onChange={handleChange} className="w-4 h-4" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">In Stock</label>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;