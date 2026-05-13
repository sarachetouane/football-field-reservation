const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/football-field-reservation')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = mongoose.model('User');
    
    // Find all users and fix their passwords
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      console.log(`Processing user: ${user.email}`);
      
      // Check if password is already hashed (bcrypt hashes start with $2b$ or $2a$)
      if (user.password && !user.password.startsWith('$2')) {
        // Hash the plain text password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Update user with hashed password
        await User.updateOne(
          { _id: user._id },
          { $set: { password: hashedPassword } }
        );
        
        console.log(`✓ Updated password for ${user.email}`);
      } else {
        console.log(`- Password already hashed for ${user.email}`);
      }
    }
    
    console.log('Password fixing completed');
    mongoose.connection.close();
  })
  .catch(console.error);
