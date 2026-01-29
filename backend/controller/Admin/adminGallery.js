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
            url: file.path,
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
  
      // Getting the current directory using import.meta.url
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      
      const { imageId } = req.params;
  
      // Find the image in the database by its id
      const image = await Gallery.findOne({ id: imageId });
      if (!image) {
        return res.status(404).send({ error: 'Image not found' });
      }
  
      // Correctly construct the file path by removing the 'uploads/' prefix from the image URL
      // const imagePath = path.join(__dirname, '..', 'uploads', image.url.replace('uploads/', ''));
      const imagePath = path.join(__dirname, '../..', 'uploads', image.url.replace('uploads/', ''));
  
      // Log the image path for debugging purposes
      console.log('Trying to delete file at:', imagePath);
  
      // Check if the file exists before trying to delete
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('Image file does not exist:', imagePath);
          return res.status(404).send({ error: 'Image file not found on server' });
        }
  
        // If file exists, delete it
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
            return res.status(500).send({ error: 'Failed to delete image file from server' });
          }
  
          // If file deletion is successful, proceed to delete the database entry
          Gallery.findOneAndDelete({ id: imageId })
            .then(() => {
              res.status(200).send({ message: 'Image deleted successfully' });
            })
            .catch((error) => {
              console.error('Error deleting image from database:', error);
              res.status(500).send({ error: 'Failed to delete image from database' });
            });
        });
      });
    } catch (error) {
      console.error('Error in deleteImage:', error);
      res.status(500).send({ error: 'Failed to delete image' });
    }
  };