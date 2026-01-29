import React, { useState, useEffect, useContext } from 'react';
import { VariableContext } from '../../../context/VariableContext';
import useGallery from '../../../hooks/admin/useImageGallery';

const AdminGallery = () => {
    const { host } = useContext(VariableContext);
    const { images, fetchImages, uploadImage, deleteImage } = useGallery();

    const [title, setTitle] = useState('');
    const [redirectUrl, setRedirectUrl] = useState(''); // New state for redirect URL
    const [imageFile, setImageFile] = useState(null);
    const [type, setType] = useState('CarouselMb'); // Default dropdown selection
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !imageFile || !type) {
            setMessage({ type: 'error', text: 'Please provide all required fields!' });
            return;
        }

        const result = await uploadImage(title, imageFile, type, redirectUrl); // Include redirect URL

        if (result.success) {
            setTitle('');
            setRedirectUrl(''); // Clear redirect URL field
            setImageFile(null);
            setType('Carousel');
            setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        } else {
            setMessage({ type: 'error', text: result.message });
        }
    };

    const handleDelete = async (imageId) => {
        const confirm = window.confirm('Are you sure you want to delete this image?');
        if (confirm) {
            const result = await deleteImage(imageId);
            if (result.success) {
                setMessage({ type: 'success', text: 'Image deleted successfully!' });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
        }
    };

    const handleCopy = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            setMessage({ type: 'success', text: 'URL copied to clipboard!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to copy URL!' });
        }
    };

    return (
        <div className="mt-1 mb-[1rem] lg:mx-1 mx-1 flex flex-col">
            {message.text && (
                <div
                    className={`py-2 px-4 mb-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
                >
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col gap-4">
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Image Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                />

                {/* Redirect URL Input */}
                <input
                    type="text"
                    placeholder="Redirect URL (optional)"
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                />

                {/* Type Dropdown */}
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                >
                    <option value="CarouselMb">CarouselMb</option>
                    <option value="CarouselPc">CarouselPc</option>
                    <option value="Banner">Banner</option>
                    <option value="Popup">Popup</option>
                    <option value="Item">Item</option>
                    <option value="Product">Product</option>
                </select>

                {/* File Input */}
                <input
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white"
                />

                {/* Image Preview */}
                {imageFile && (
                    <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md mt-2"
                    />
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Upload Image
                </button>
            </form>

            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-white border-b dark:border-gray-700">
                                Title
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-white border-b dark:border-gray-700">
                                Type
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-white border-b dark:border-gray-700">
                                Image
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-white border-b dark:border-gray-700">
                                URL
                            </th>
                            <th className="px-4 py-2 text-left text-gray-800 dark:text-white border-b dark:border-gray-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {images.map((image) => (
                            <tr key={image.id}>
                                <td className="px-4 py-2 text-gray-800 dark:text-white border-b dark:border-gray-700">
                                    {image.title}
                                </td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white border-b dark:border-gray-700">
                                    {image.type}
                                </td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white border-b dark:border-gray-700">
                                    <img
                                        src={`${host}/${image.url}`}
                                        alt={image.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                </td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white border-b dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span>{`${host}/${image.url}`}</span>
                                        <button
                                            onClick={() => handleCopy(`${host}/${image.url}`)}
                                            className="px-2 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                        >
                                            Copy
                                        </button>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-gray-800 dark:text-white border-b dark:border-gray-700">
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminGallery;
