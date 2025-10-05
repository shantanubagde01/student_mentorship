// DEPRECATED: Student creation is now handled via admin API endpoints.
// This script is kept for reference but should not be used.
// Use POST /admin/createStudent instead.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Student = require('./src/models/Student');

async function createStudent() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost:27017/student_mentoring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const hashedPassword = await bcrypt.hash('student123', 8);

    const student = new Student({
      email: 'student@example.com',
      password: hashedPassword,
      firstname: 'Jane',
      lastname: 'Smith',
      programme: 'B.Tech',
      department: 'Computer Science',
      semester: '6',
      isEmailVerified: true,
    });

    await student.save();
    console.log('Student created successfully');
    console.log('Email: student@example.com');
    console.log('Password: student123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating student:', error);
  }
}

createStudent();
