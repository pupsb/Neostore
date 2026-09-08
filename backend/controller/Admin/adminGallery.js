import Gallery from "../../models/ImageGallery.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


export const uploadImage = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send({ error: 'No files uploaded' });
        }
  
        const images = req.files.map((file) => ({
            title: req.body.title,
            type: req.body.type, // Add type field
            redirectUrl: req.body.redirectUrl, // Add redirect URL field
            url: file.path.replace(/\\/g, '/'),
            id: uuidv4(),
        }));
  
        const savedImages = await Gallery.insertMany(images);
        res.status(200).send(savedImages);
    } catch (error) {
        console.error('Error in uploadImage:', error);
        res.status(500).send({ error: 'Failed to save images to the database.' });
    }
  };
  
  
  export const getImages = async (req, res) => {
    try {
      const images = await Gallery.find();
      res.status(200).send(images);
    } catch (error) {
      console.error('Error in getImages:', error);
      res.status(500).send({ error: 'Failed to fetch images.' });
    }
  }
  
export const deleteImage = async (req, res) => {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const { imageId } = req.params;

    // Find the image in the database by its id
    const image = await Gallery.findOne({ id: imageId });
    if (!image) {
      return res.status(404).send({ error: 'Image not found' });
    }

    // Safely construct file path
    if (image.url) {
      const cleanUrl = image.url.replace(/\\/g, '/').replace(/^uploads\//, '');
      const imagePath = path.join(__dirname, '../..', 'uploads', cleanUrl);

      // Delete file from disk if it exists
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log('Deleted file from disk:', imagePath);
        } catch (err) {
          console.error('Error deleting image file from disk:', err);
        }
      } else {
        console.warn('Image file did not exist on server disk:', imagePath);
      }
    }

    // Always delete database entry
    await Gallery.findOneAndDelete({ id: imageId });
    res.status(200).send({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    res.status(500).send({ error: 'Failed to delete image' });
  }
};