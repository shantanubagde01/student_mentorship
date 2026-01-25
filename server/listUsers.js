const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./src/models/Admin');
const Mentor = require('./src/models/Mentor');
const Student = require('./src/models/Student');

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://localhost:27017/student_mentoring', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('=== ADMINS ===');
    const admins = await Admin.find({}, 'email firstname lastname');
    admins.forEach(admin => {
      console.log(`Email: ${admin.email}, Name: ${admin.firstname} ${admin.lastname}`);
    });

    console.log('\n=== MENTORS ===');
    const mentors = await Mentor.find({}, 'email firstname lastname');
    mentors.forEach(mentor => {
      console.log(`Email: ${mentor.email}, Name: ${mentor.firstname} ${mentor.lastname}`);
    });

    console.log('\n=== STUDENTS ===');
    const students = await Student.find({}, 'email firstname lastname');
    students.forEach(student => {
      console.log(`Email: ${student.email}, Name: ${student.firstname} ${student.lastname}`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error('Error listing users:', error);
  }
}

listUsers();
