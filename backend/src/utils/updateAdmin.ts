import mongoose from 'mongoose';
import { User } from '../models/User';
require('dotenv').config();

async function updateToAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-field-reservation');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    if (users.length === 0) {
      console.log('No users found in database');
      return;
    }

    // Update first user to admin role
    const firstUser = users[0];
    await User.findByIdAndUpdate(firstUser._id, { role: 'admin' });
    console.log(`Updated user ${firstUser.email} to admin role`);

    // Verify the update
    const updatedUser = await User.findById(firstUser._id);
    console.log(`User role is now: ${updatedUser?.role}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

updateToAdmin();
