// DEPRECATED: Mentor creation is now handled via admin API endpoints.
// This script is kept for reference but should not be used.
// Use POST /admin/createMentor instead.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Mentor = require('./src/models/Mentor');

async function createMentor() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost:27017/student_mentoring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('mentor123', 8);

    const mentor = new Mentor({
      email: 'mentor@example.com',
      password: hashedPassword,
      firstname: 'Shantanu',
      lastname: 'Bagde',
      department: 'Information Tchnology',
      designation: 'Professor',
      isEmailVerified: true,
    });

    await mentor.save();
    console.log('Mentor created successfully');
    console.log('Email: mentor@example.com');
    console.log('Password: mentor123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating mentor:', error);
  }
}

createMentor();
