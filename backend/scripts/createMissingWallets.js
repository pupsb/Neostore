import mongoose from 'mongoose';
import User from './models/User.js';
import Wallet from './models/Wallet.js';
import Point from './models/Points.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkWallets() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const users = await User.find();
    const wallets = await Wallet.find();
    
    console.log('Total users:', users.length);
    console.log('Total wallets:', wallets.length);

    const usersWithoutWallets = [];
    for (const user of users) {
      const wallet = await Wallet.findOne({ dbuserid: user._id });
      if (!wallet) {
        usersWithoutWallets.push({
          userid: user.userid,
          email: user.email,
          _id: user._id.toString()
        });
      }
    }

    console.log('\\nUsers without wallets:', usersWithoutWallets.length);
    if (usersWithoutWallets.length > 0) {
      console.log('\\nCreating wallets for users...');
      for (const user of usersWithoutWallets) {
        const fullUser = await User.findById(user._id);
        const newWallet = new Wallet({
          dbuserid: fullUser._id,
          userid: fullUser.userid,
          useremail: fullUser.email,
          balance: 0
        });
        await newWallet.save();
        
        // Also create Points if missing
        const existingPoints = await Point.findOne({ dbuserid: fullUser._id });
        if (!existingPoints) {
          const newPoints = new Point({
            dbuserid: fullUser._id,
            userid: fullUser.userid,
            useremail: fullUser.email,
            balance: 0
          });
          await newPoints.save();
          console.log(`Created wallet and points for user ${fullUser.userid}`);
        } else {
          console.log(`Created wallet for user ${fullUser.userid}`);
        }
      }
      console.log('\\nDone! Created wallets for', usersWithoutWallets.length, 'users');
    } else {
      console.log('All users have wallets!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkWallets();
