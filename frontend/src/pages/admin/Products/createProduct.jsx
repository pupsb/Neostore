import React, { useContext } from "react";
import { VariableContext } from "../../../context/VariableContext";
import { useCreateProduct } from "../../../hooks/admin/useCreateProducts";

const CreateProduct = () => {
    const { host, token } = useContext(VariableContext);
    const {
        formData,
        handleInputChange,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleAddInput,
        handleRemoveInput,
        handleSubmit,
    } = useCreateProduct(host, token);

    return (
        <div className="p-6 mb-12 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="space-y-4"
            >
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
                    <label className="block font-medium mb-2">Type:</label>
                    <select
                        name="type"
                        className="block w-full p-2 border rounded"
                        value={formData.type}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Type</option>
                        <option value="MLBB">MLBB</option>
                        <option value="GENSHIN">GENSHIN</option>
                        <option value="HOK">HOK</option>
                        <option value="PUBG">PUBG</option>
                        <option value="MCGG">MCGG</option>
                        <option value="OTHER">OTHER</option>
                    </select>
                </div>
                {/* <div>
                    <label className="block font-medium mb-2">Product ID: unique</label>
                    <input
                        type="number"
                        name="productid"
                        className="block w-full p-2 border rounded"
                        value={formData.productid}
                        onChange={handleInputChange}
                    />
                </div> */}
                <div>
                    <label className="block font-medium mb-2">Category:</label>
                    <select
                        name="category"
                        className="block w-full p-2 border rounded"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        <option value="games">Game</option>
                        <option value="instant-games">Instant Games</option>
                        <option value="ott">OTT</option>
                        <option value="others">Others</option>
                    </select>
                </div>
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
                <div>
                    <label className="block font-medium mb-2">Important Note:</label>
                    <textarea
                        name="importantnote"
                        className="block w-full p-2 border rounded"
                        value={formData.importantnote}
                        onChange={handleInputChange}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-2">Inputs:</label>
                    {formData.inputs.map((input, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                className="block w-full p-2 border rounded"
                                value={input.label}
                                placeholder={`Input ${index + 1}`}
                                onChange={(e) => {
                                    const updatedInputs = [...formData.inputs];
                                    updatedInputs[index].label = e.target.value;
                                    handleInputChange(e); // Use the same handler for updates
                                }}
                            />
                            {/* <button
                                type="button"
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleRemoveInput(index)}
                            >
                                Remove
                            </button> */}
                        </div>
                    ))}
                    {/* <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleAddInput}
                    >
                        Add Input
                    </button> */}
                </div>

                <div>
                    <label className="block font-medium mb-2">Items (IDs):</label>
                    {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="number"
                                className="block w-full p-2 border rounded"
                                value={item}
                                placeholder="Item ID"
                                onChange={(e) => handleItemChange(index, e.target.value)}
                            />
                            <button
                                type="button"
                                className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => handleRemoveItem(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleAddItem}
                    >
                        Add Item
                    </button>
                </div>

                {/* <div>
                    <label className="block font-medium mb-2">In Stock:</label>
                    <select
                        name="instock"
                        className="block w-full p-2 border rounded"
                        value={formData.instock}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value={true}>True</option>
                        <option value={false}>False</option>
                    </select>
                </div> */}
                <div>
                    <label className="block font-medium mb-2">Is Trending:</label>
                    <select
                        name="istrending"
                        className="block w-full p-2 border rounded"
                        value={formData.istrending}
                        onChange={(e) =>
                            handleInputChange({ target: { name: "istrending", value: e.target.value === "true" } })
                        }
                    >
                        <option value={false}>False</option>
                        <option value={true}>True</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-2">Is API:</label>
                    <select
                        name="isApi"
                        className="block w-full p-2 border rounded"
                        value={formData.isApi}
                        onChange={(e) =>
                            handleInputChange({ target: { name: "isApi", value: e.target.value === "true" } })
                        }
                    >
                        <option value="false">False</option>
                        <option value="true">True</option>
                    </select>
                </div>

                {formData.isApi && (
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
                )}

                <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CreateProduct;
