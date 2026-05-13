const mongoose = require('mongoose');

// Simple connection and update
mongoose.connect('mongodb://localhost:27017/football-field-reservation')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = mongoose.model('User');
    
    // Find and update first user to admin
    const users = await User.find({});
    if (users.length > 0) {
      await User.updateOne({ _id: users[0]._id }, { role: 'admin' });
      console.log('Updated user to admin:', users[0].email);
    } else {
      console.log('No users found');
    }
    
    mongoose.connection.close();
  })
  .catch(console.error);
