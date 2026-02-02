/**
 * Diagnostic Script: Check All Item API Types and Product IDs
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

// Define Item and Product schemas
const itemSchema = new mongoose.Schema({}, { strict: false });
const productSchema = new mongoose.Schema({}, { strict: false });

const Item = mongoose.model('Item', itemSchema);
const Product = mongoose.model('Product', productSchema);

async function checkApiTypes() {
  try {
    console.log('\n🔍 Checking Database Configuration...\n');
    
    await mongoose.connect(MONGO_URL);
    console.log('✅ Connected to MongoDB\n');

    // Get all items
    const allItems = await Item.find({});
    console.log(`📊 Total Items: ${allItems.length}\n`);

    // Get all products
    const allProducts = await Product.find({});
    console.log(`📦 Total Products: ${allProducts.length}\n`);

    // Check items for API related fields
    console.log('📋 Items with API Configuration:');
    const apiItems = allItems.filter(item => item.isApi || item.apiType);
    
    apiItems.forEach(item => {
      console.log(`\n  📌 ${item.name}`);
      console.log(`     _id: ${item._id}`);
      console.log(`     itemid: ${item.itemid}`); // Added itemid
      console.log(`     isApi: ${item.isApi}`);
      console.log(`     apiType: ${item.apiType}`);
      console.log(`     itemidarray: ${JSON.stringify(item.itemidarray)}`);
      console.log(`     productId: ${item.productId}`);
    });
    
    // Check for duplicate itemids
    console.log('\n🔍 Checking for duplicate itemids...');
    const itemidMap = {};
    allItems.forEach(item => {
      if (item.itemid) {
        if (itemidMap[item.itemid]) {
           itemidMap[item.itemid].push(item.name);
        } else {
           itemidMap[item.itemid] = [item.name];
        }
      }
    });
    
    for (const [id, names] of Object.entries(itemidMap)) {
      if (names.length > 1) {
        console.log(`⚠️ Duplicate itemid detected: ${id} -> ${names.join(', ')}`);
      }
    }

    // Check products for API configuration
    console.log('\n\n📦 Products with API Configuration:');
    const apiProducts = allProducts.filter(p => p.isApi);
    
    apiProducts.forEach(product => {
      console.log(`\n  📦 ${product.name}`);
      console.log(`     ID: ${product._id}`);
      console.log(`     isApi: ${product.isApi}`);
      console.log(`     Items related to this product:`);
      
      const relatedItems = allItems.filter(item => 
        item.productId && item.productId.toString() === product._id.toString()
      );
      
      relatedItems.forEach(item => {
        console.log(`       - ${item.name} (apiType: ${item.apiType}, itemidarray: ${JSON.stringify(item.itemidarray)})`);
      });
    });

    await mongoose.disconnect();
    console.log('\n\n✅ Diagnostic complete!\n');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

checkApiTypes();
