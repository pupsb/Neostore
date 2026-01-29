import React, { useContext, useState, useEffect } from 'react'
import { VariableContext } from '../../../context/VariableContext'
import EditProductModal from './editProduct'

export default function AllProducts() {
    const { host, token } = useContext(VariableContext)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleProductUpdate = (updatedProduct) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.productid === updatedProduct.productid ? updatedProduct : product
            )
        );
    };

    // Function to fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${host}/admin/getallproducts`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }

                const data = await response.json()
                setProducts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [host, token])

    // Function to delete product
    const deleteProduct = async (productId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?')

        if (confirmDelete) {
            try {
                const response = await fetch(`${host}/admin/deleteproduct/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error('Failed to delete product')
                }

                // If deletion is successful, update the product list
                setProducts(prevProducts => prevProducts.filter(product => product.productid !== productId))
            } catch (err) {
                setError(err.message)
            }
        }
    }

    const openModal = (product) => {
        setSelectedProduct(product)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedProduct(null)
    }

    if (loading) return <div className="text-center py-10">Loading...</div>
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">All Products</h1>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product ID</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">API Type</th>
                            <th scope="col" className="px-6 py-3">Category</th>
                            <th scope="col" className="px-6 py-3">Is Trending</th>
                            <th scope="col" className="px-6 py-3">Important Note</th>
                            <th scope="col" className="px-6 py-3">Items</th>
                            <th scope="col" className="px-6 py-3">In Stock</th>
                            <th scope="col" className="px-6 py-3">Actions</th>  {/* New column for actions */}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{product.productid}</td>
                                <td className="px-6 py-4">{product.name}</td>
                                <td className="px-6 py-4">{product.type}</td>
                                <td className="px-6 py-4">{product.apiType || 'N/A'}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">{product.istrending ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4">{product.importantnote}</td>
                                <td className="px-6 py-4">{product.items.join(', ')}</td>
                                <td className="px-6 py-4">{product.instock ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openModal(product)}
                                        className="text-blue-500 hover:text-blue-700 font-bold mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product.productid)}
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
            {isModalOpen && selectedProduct && (
                <EditProductModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    product={selectedProduct}
                    onUpdate={handleProductUpdate}
                    host={host}
                    token={token}
                />
            )}
        </div>
    )
}
