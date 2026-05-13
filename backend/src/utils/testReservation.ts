import mongoose from 'mongoose';
import { User } from '../models/User';
import { Field } from '../models/Field';
import { Reservation } from '../models/User';
require('dotenv').config();

async function testReservation() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football_reservation');
    console.log('Connected to MongoDB');

    // Find a user
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found');
      return;
    }
    
    const user = users[0];
    console.log(`Using user: ${user.email} (ID: ${user._id})`);

    // Find a field
    const fields = await Field.find({});
    console.log(`Found ${fields.length} fields`);
    
    if (fields.length === 0) {
      console.log('No fields found');
      return;
    }
    
    const field = fields[0];
    console.log(`Using field: ${field.name} (ID: ${field._id})`);

    // Check existing reservations for this user
    const existingReservations = await Reservation.find({ userId: user._id });
    console.log(`User has ${existingReservations.length} existing reservations`);
    
    if (existingReservations.length > 0) {
      console.log('Existing reservations:');
      existingReservations.forEach((res, index) => {
        console.log(`  ${index + 1}. ID: ${res._id}, Status: ${res.status}, Date: ${res.date}`);
      });
    }

    // Create a test reservation if none exist
    if (existingReservations.length === 0) {
      const testReservation = new Reservation({
        fieldId: field._id,
        userId: user._id,
        date: '2024-05-12',
        timeSlot: {
          id: 'test-slot-1',
          startTime: '18:00',
          endTime: '19:30',
          available: true,
          price: field.price,
          fieldId: field._id.toString(),
          date: '2024-05-12'
        },
        totalPrice: field.price,
        status: 'confirmed'
      });

      const savedReservation = await testReservation.save();
      console.log('Created test reservation:');
      console.log(`  ID: ${savedReservation._id}`);
      console.log(`  User: ${user.email}`);
      console.log(`  Field: ${field.name}`);
      console.log(`  Date: ${savedReservation.date}`);
      console.log(`  Status: ${savedReservation.status}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testReservation();
