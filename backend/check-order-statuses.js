// check-order-statuses.js
import mongoose from 'mongoose';

const MONGO_URL = 'mongodb+srv://neostore:neoxkuber@cluster0.r8lvmrh.mongodb.net/?appName=Cluster0';

async function checkStatuses() {
  try {
    await mongoose.connect(MONGO_URL);
    const db = mongoose.connection.db;
    const ordersCollection = db.collection('orders');
    
    console.log('=== ACTUAL ORDER STATUSES ===\n');
    
    // Group by status to see all unique values
    const statusGroups = await ordersCollection.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]).toArray();
    
    console.log('Status Distribution:');
    statusGroups.forEach(group => {
      console.log(`  "${group._id}": ${group.count} orders`);
    });
    
    // Get sample orders with each status
    console.log('\n\n=== SAMPLE ORDERS ===');
    const sampleOrders = await ordersCollection.find({})
      .limit(10)
      .sort({ createdAt: -1 })
      .toArray();
    
    sampleOrders.forEach((order, i) => {
      console.log(`\n${i + 1}. Order ${order._id}`);
      console.log(`   Product: ${order.productId?.name || order.productname || 'N/A'}`);
      console.log(`   Status: "${order.status}"`);
      console.log(`   Payment Status: "${order.paymentStatus || 'N/A'}"`);
      console.log(`   Created: ${order.createdAt || order._id.getTimestamp()}`);
      console.log(`   API Order: ${order.isApi || false}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkStatuses();
