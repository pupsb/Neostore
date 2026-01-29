import { useState, useCallback, useContext } from 'react';
import { VariableContext } from '../../context/VariableContext';

const useGallery = () => {
    const { host, token } = useContext(VariableContext);
    const [images, setImages] = useState([]);
  
    // Fetch images from the backend
    const fetchImages = useCallback(async () => {
      try {
        const response = await fetch(`${host}/admin/imagegallery`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        } else {
          alert('Failed to fetch images.');
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }, [host, token]);
  
    // Upload image to the backend
    const uploadImage = useCallback(
        async (title, imageFile, type, redirectUrl) => {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('type', type);
            formData.append('images', imageFile);
            formData.append('redirectUrl', redirectUrl);
    
            try {
                const response = await fetch(`${host}/admin/uploadimage`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
    
                if (response.ok) {
                    const savedImage = await response.json();
                    setImages((prev) => [...prev, savedImage]);
                    return { success: true, data: savedImage };
                } else {
                    return { success: false, message: 'Failed to upload image.' };
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                return { success: false, message: 'Error uploading image.' };
            }
        },
        [host, token]
    );
    
  
    // Delete image from the backend
    const deleteImage = useCallback(
      async (imageId) => {
        try {
          const response = await fetch(`${host}/admin/deleteimage/${imageId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            setImages((prev) => prev.filter((image) => image.id !== imageId));
            return { success: true };
          } else {
            return { success: false, message: 'Failed to delete image.' };
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          return { success: false, message: 'Error deleting image.' };
        }
      },
      [host, token]
    );
  
    return { images, fetchImages, uploadImage, deleteImage };
  };
  
  export default useGallery;
  