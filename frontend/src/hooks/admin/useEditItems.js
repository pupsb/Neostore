import { useState } from 'react';

export function useEditItems(host, token) {
    const [isEditing, setIsEditing] = useState(false);
    const [editItem, setEditItem] = useState(null);

    const startEdit = (item) => {
        setEditItem(item);
        setIsEditing(true);
    };

    const saveEdit = async (updatedItem) => {
        console.log(updatedItem);
        
        try {
            const response = await fetch(`${host}/admin/edititem/${updatedItem.itemid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) {
                throw new Error('Failed to update item');
            }
            return true; // Indicates success
        } catch (error) {
            console.error(error.message);
            return false; // Indicates failure
        }
    };

    const closeEdit = () => {
        setEditItem(null);
        setIsEditing(false);
    };

    return { isEditing, editItem, startEdit, saveEdit, closeEdit };
}
