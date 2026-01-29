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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>
                            <input type="text" name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">API Type</label>
                            <input type="text" name="apiType" value={formData.apiType} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Items (comma-separated)</label>
                            <input type="text" name="items" value={formData.items} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Important Note</label>
                            <input type="text" name="importantnote" value={formData.importantnote} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image Path (URL)</label>
                            <input type="text" name="imgpath" value={formData.imgpath} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="istrending" checked={formData.istrending} onChange={handleChange} className="w-4 h-4" />
                            <label className="text-sm font-medium">Is Trending</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input type="checkbox" name="instock" checked={formData.instock} onChange={handleChange} className="w-4 h-4" />
                            <label className="text-sm font-medium">In Stock</label>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
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