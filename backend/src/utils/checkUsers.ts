import mongoose from 'mongoose';
import { User } from '../models/User';
import { Reservation } from '../models/User';
import { Field } from '../models/Field';
require('dotenv').config();

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football_reservation');
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users:`);
    
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. Name: ${user.name}`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Role: ${user.role}`);
      console.log(`     ID: ${user._id}`);
      console.log('');
    });

    // Find "Super Admin" user
    const superAdmin = await User.findOne({ name: 'Super Admin' });
    
    if (superAdmin) {
      console.log('Found Super Admin:');
      console.log(`  Name: ${superAdmin.name}`);
      console.log(`  Email: ${superAdmin.email}`);
      console.log(`  ID: ${superAdmin._id}`);
      
      // Check reservations for Super Admin
      const adminReservations = await Reservation.find({ userId: superAdmin._id });
      console.log(`Super Admin has ${adminReservations.length} reservations`);
      
      if (adminReservations.length === 0) {
        console.log('Creating a reservation for Super Admin...');
        
        // Find a field
        const field = await Field.findOne({});
        
        if (field) {
          const testReservation = new Reservation({
            fieldId: field._id,
            userId: superAdmin._id,
            date: '2024-05-12',
            timeSlot: {
              id: 'admin-slot-1',
              startTime: '18:00',
              endTime: '19:30',
              available: true,
              price: 35,
              fieldId: field._id.toString(),
              date: '2024-05-12'
            },
            totalPrice: 35,
            status: 'confirmed'
          });

          const savedReservation = await testReservation.save();
          console.log('Created reservation for Super Admin:');
          console.log(`  ID: ${savedReservation._id}`);
          console.log(`  User: ${superAdmin.name}`);
          console.log(`  Field: ${field.name}`);
          console.log(`  Date: ${savedReservation.date}`);
          console.log(`  Status: ${savedReservation.status}`);
        }
      }
    } else {
      console.log('Super Admin user not found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

checkUsers();
