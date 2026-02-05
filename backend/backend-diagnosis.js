// backend-diagnosis.js
// Run this script to diagnose backend database issues

import mongoose from 'mongoose';

const MONGO_URL = 'mongodb+srv://neostore:neoxkuber@cluster0.r8lvmrh.mongodb.net/?appName=Cluster0';

async function diagnose() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB Connected\n');

    // Get database instance
    const db = mongoose.connection.db;

    // Check all collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections Found:', collections.map(c => c.name).join(', '));
    console.log('');

    // Check Orders Collection
    console.log('=== ORDERS DIAGNOSIS ===');
    const ordersCollection = db.collection('orders');
    
    const totalOrders = await ordersCollection.countDocuments();
    console.log(`Total Orders: ${totalOrders}`);
    
    const processingOrders = await ordersCollection.countDocuments({ status: 'processing' });
    console.log(`Orders in Processing: ${processingOrders}`);
    
    const completedOrders = await ordersCollection.countDocuments({ status: 'completed' });
    console.log(`Orders Completed: ${completedOrders}`);
    
    const failedOrders = await ordersCollection.countDocuments({ status: 'failed' });
    console.log(`Orders Failed: ${failedOrders}`);

    // Get recent processing orders
    if (processingOrders > 0) {
      console.log('\n⚠️  Recent Stuck Processing Orders:');
      const stuckOrders = await ordersCollection.find({ status: 'processing' })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      
      stuckOrders.forEach((order, i) => {
        console.log(`\n${i + 1}. Order ID: ${order._id}`);
        console.log(`   Product: ${order.product?.name || 'N/A'}`);
        console.log(`   Created: ${order.createdAt}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Payment Status: ${order.paymentStatus || 'N/A'}`);
      });
    }

    console.log('\n\n=== USERS DIAGNOSIS ===');
    const usersCollection = db.collection('users');
    
    const totalUsers = await usersCollection.countDocuments();
    console.log(`Total Users: ${totalUsers}`);
    
    // Get recent users
    console.log('\n📋 Last 5 Registered Users:');
    const recentUsers = await usersCollection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    recentUsers.forEach((user, i) => {
      console.log(`\n${i + 1}. User ID: ${user._id}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Mobile: ${user.mobilenumber || 'N/A'}`);
      console.log(`   Created: ${user.createdAt || user._id.getTimestamp()}`);
      console.log(`   Verified: ${user.isVerified || false}`);
    });

    // Check for users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const

 todayUsers = await usersCollection.countDocuments({
      createdAt: { $gte: today }
    });
    console.log(`\n\n👥 Users Created Today: ${todayUsers}`);

    console.log('\n\n=== RECOMMENDATIONS ===');
    if (processingOrders > 0) {
      console.log('⚠️  You have stuck orders in processing status.');
      console.log('   Possible causes:');
      console.log('   - Payment webhook not firing');
      console.log('   - API provider not sending status updates');
      console.log('   - Backend not processing payment callbacks');
    }

    if (todayUsers === 0) {
      console.log('⚠️  No new users registered today');
      console.log('   Check if registration API is working correctly');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n\n✅ Diagnosis complete. Connection closed.');
    process.exit(0);
  }
}

diagnose();
