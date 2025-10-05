const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./src/models/Admin');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost:27017/student_mentoring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('admin123', 8);

    const admin = new Admin({
      email: 'admin@example.com',
      password: hashedPassword,
      firstname: 'Admin',
      lastname: 'User',
      role: 'Admin',
      isEmailVerified: true,
    });

    await admin.save();
    console.log('Admin created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
