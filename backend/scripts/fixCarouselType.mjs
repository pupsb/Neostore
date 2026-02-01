import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Gallery Schema
const gallerySchema = new mongoose.Schema({
    title: String,
    type: String,
    redirectUrl: String,
    url: String,
    id: String
});

const Gallery = mongoose.model('Gallery', gallerySchema);

async function fixCarouselTypes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.mongo_url);
        console.log('✅ Connected to MongoDB');

        // Find all images with type "Carousel" (incorrect)
        const incorrectImages = await Gallery.find({ type: 'Carousel' });
        console.log(`\nFound ${incorrectImages.length} image(s) with incorrect type "Carousel"`);

        if (incorrectImages.length === 0) {
            console.log('✅ No images to fix!');
            process.exit(0);
        }

        // Display images found
        incorrectImages.forEach((img, index) => {
            console.log(`\n${index + 1}. Title: ${img.title || 'N/A'}`);
            console.log(`   Current Type: ${img.type}`);
            console.log(`   URL: ${img.url}`);
            console.log(`   ID: ${img.id}`);
        });

        // Update all to CarouselMb
        const result = await Gallery.updateMany(
            { type: 'Carousel' },
            { $set: { type: 'CarouselMb' } }
        );

        console.log(`\n✅ Successfully updated ${result.modifiedCount} image(s) to type "CarouselMb"`);

        // Verify the update
        const verification = await Gallery.find({ type: 'Carousel' });
        if (verification.length === 0) {
            console.log('✅ Verification passed: No more images with type "Carousel"');
        } else {
            console.log('⚠️  Warning: Still found images with type "Carousel"');
        }

        // Show current counts
        const carouselMbCount = await Gallery.countDocuments({ type: 'CarouselMb' });
        const carouselPcCount = await Gallery.countDocuments({ type: 'CarouselPc' });
        const popupCount = await Gallery.countDocuments({ type: 'Popup' });

        console.log('\n📊 Current Gallery Stats:');
        console.log(`   CarouselMb: ${carouselMbCount} image(s)`);
        console.log(`   CarouselPc: ${carouselPcCount} image(s)`);
        console.log(`   Popup: ${popupCount} image(s)`);

        await mongoose.disconnect();
        console.log('\n✅ Script completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
fixCarouselTypes();
