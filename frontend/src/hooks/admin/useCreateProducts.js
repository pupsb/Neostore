import { useState } from "react";
import axios from "axios";

export const useCreateProduct = (host, token) => {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        // productid: "",
        category: "",
        imgpath: "",
        importantnote: "",
        inputs: [{ label: "" }, { label: "" }],
        items: [""],
        // instock: "",
        istrending: false,
        isApi: false,
        apiType: "",
    });

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required.";
        if (!formData.type.trim()) return "Type is required.";
        // if (!formData.productid || isNaN(formData.productid)) return "Valid Product ID is required.";
        if (!formData.category) return "Category is required.";
        if (!formData.imgpath.trim()) return "Image Path is required.";
        if (formData.inputs.some((input) => !input.label.trim())) return "All input fields must have labels.";
        if (formData.items.some((item) => !item || isNaN(item))) return "All items must be valid numbers.";
        // if (!formData.instock) return "In Stock selection is required.";
        if (formData.isApi && !formData.apiType) return "API Type is required when Is API is true.";
        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // If the field is "type", ensure it's capitalized with no spaces
        if (name === "type") {
            setFormData({
                ...formData,
                [name]: value.replace(/\s+/g, "").toUpperCase(),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, ""],
        });
    };

    const handleRemoveItem = (index) => {
        const updatedItems = formData.items.filter((_, idx) => idx !== index);
        setFormData({
            ...formData,
            items: updatedItems,
        });
    };

    const handleAddInput = () => {
        setFormData({
            ...formData,
            inputs: [...formData.inputs, { label: "" }],
        });
    };

    const handleRemoveInput = (index) => {
        const updatedInputs = formData.inputs.filter((_, idx) => idx !== index);
        setFormData({
            ...formData,
            inputs: updatedInputs,
        });
    };

    const handleItemChange = (index, value) => {
        const updatedItems = formData.items.map((item, idx) =>
            idx === index ? value : item
        );
        setFormData({
            ...formData,
            items: updatedItems,
        });
    };

    const handleSubmit = async () => {
        const errorMessage = validateForm();
        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        try {
            console.log('Submitting product:', formData);
            const response = await axios.post(
                `${host}/admin/createproduct`,
                {
                    ...formData,
                    items: formData.items.map(Number),
                    inputs: formData.inputs,
                    instock: formData.instock === "true",
                    istrending: formData.istrending === "true",
                    apiType: formData.isApi ? formData.apiType : "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Product created successfully:', response.data);
            alert("Product created successfully!");
            
            // Reset form to initial state
            setFormData({
                name: "",
                type: "",
                category: "",
                imgpath: "",
                importantnote: "",
                inputs: [{ label: "" }, { label: "" }],
                items: [""],
                istrending: false,
                isApi: false,
                apiType: "",
            });
        } catch (error) {
            console.error('Error creating product:', error);
            console.error('Error response:', error.response);
            console.error('Error data:', error.response?.data);
            const errorMsg = error.response?.data?.error || error.message || "Error creating product.";
            alert(`Error: ${errorMsg}`);
        }
    };

    return {
        formData,
        handleInputChange,
        handleItemChange,
        handleAddItem,
        handleRemoveItem,
        handleAddInput,
        handleRemoveInput,
        handleSubmit,
    };
};