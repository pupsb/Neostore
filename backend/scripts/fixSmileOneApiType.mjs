/**
 * Fix Script: Update MLBB Items to Use Brazil (SMILEBR) API Type
 * 
 * Problem: Items are set to SMILEPH (Philippines) but using Brazil product IDs
 * Solution: Update all MLBB items to use SMILEBR apiType
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// Define Item schema (minimal version for this fix)
const itemSchema = new mongoose.Schema({}, { strict: false });
const Item = mongoose.model('Item', itemSchema);

async function fixSmileOneApiType() {
  try {
    console.log('\n🔧 Starting SmileOne API Type Fix...\n');
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // Find all items with SMILEPH apiType
    const itemsToFix = await Item.find({ apiType: 'SMILEPH' });
    
    console.log(`📊 Found ${itemsToFix.length} items with apiType: SMILEPH\n`);

    if (itemsToFix.length === 0) {
      console.log('✅ No items need to be fixed!');
      await mongoose.disconnect();
      return;
    }

    // Display items that will be updated
    console.log('📋 Items to be updated:');
    itemsToFix.forEach(item => {
      console.log(`  - ${item.name} (ID: ${item._id})`);
      console.log(`    Current apiType: ${item.apiType}`);
      console.log(`    itemidarray: ${JSON.stringify(item.itemidarray)}`);
    });

    console.log('\n🔄 Updating items to use SMILEBR...\n');

    // Update all items from SMILEPH to SMILEBR
    const result = await Item.updateMany(
      { apiType: 'SMILEPH' },
      { $set: { apiType: 'SMILEBR' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} items successfully!`);
    console.log('\n📊 Summary:');
    console.log(`  - Items matched: ${result.matchedCount}`);
    console.log(`  - Items modified: ${result.modifiedCount}`);
    console.log('\n✅ Fix completed! All MLBB items now use Brazil (SMILEBR) endpoint.\n');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

fixSmileOneApiType();
