import mongoose from 'mongoose';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
require('dotenv').config();

async function testApi() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football_reservation');
    console.log('Connected to MongoDB');

    // Find the admin user
    const user = await User.findOne({ email: 'denisic@mailinator.com' });
    
    if (!user) {
      console.log('User not found');
      return;
    }
    
    console.log(`Found user: ${user.email} (ID: ${user._id})`);
    console.log(`User role: ${user.role}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );
    
    console.log(`Generated token: ${token}`);
    console.log('Use this token in Authorization header: Bearer ' + token);

    // Test the API endpoint using curl equivalent
    const { exec } = require('child_process');
    
    try {
      const curlCommand = `curl -X GET "http://localhost:5000/api/reservations/my" -H "Authorization: Bearer ${token}" -H "Content-Type: application/json"`;
      
      exec(curlCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('Curl error:', error);
          return;
        }
        if (stderr) {
          console.error('Stderr:', stderr);
          return;
        }
        
        console.log('\nAPI Response:');
        console.log('Data:', stdout);
      });
    } catch (execError) {
      console.error('Exec error:', execError);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

testApi();
