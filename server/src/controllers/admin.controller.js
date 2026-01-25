const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const Mentor = require("../models/Mentor");
const Student = require("../models/Student");
const Meeting = require("../models/Meeting");
const Post = require("../models/Post");
const Log = require("../models/Log");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs")

// importing utils
const response = require("../utils/responses.utils");

// importing helpers methods
const studentHelpers = require("../helpers/student.helper");
const mentorHelpers = require("../helpers/mentor.helper");

// env config
dotenv.config();

/**
 * This module consists of all the handler functions for the admin route
 */

module.exports = {
    /** Admin Login Handler */
    adminLoginHandler: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return response.badrequest(res, "Please provide valid email/password", {});
            }

            const admin = await Admin.findByCredentials(email, password);
            const token = await admin.generateAuthToken();
            response.success(res, "Login successful", { auth_token: token, role: "ADMIN" });

            req.user = admin;
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    /** Purge "John undefined Doe" from all collections */
    purgeJohnDoe: async (req, res, next) => {
        try {
            // 1. Delete from Mentors
            const deletedMentor = await Mentor.deleteMany({
                firstname: "John",
                middlename: "undefined",
                lastname: "Doe"
            });

            // 2. Delete from Students
            const deletedStudent = await Student.deleteMany({
                firstname: "John",
                middlename: "undefined",
                lastname: "Doe"
            });

            // 3. Clean up any broken logs or interactions involving that specific name string
            await Log.deleteMany({ message: { $regex: "John undefined Doe" } });

            response.success(res, "Purge Complete", {
                mentorsRemoved: deletedMentor.deletedCount,
                studentsRemoved: deletedStudent.deletedCount
            });
        } catch (err) {
            console.log("Purge Error:", err);
            response.error(res);
        }
    },

    // Create a new mentor with Sanitization Fix
    createMentor: async (req, res, next) => {
        try {
            const { email, password, firstname, lastname, middlename, department, designation } = req.body;

            if (!email || !password || !firstname) {
                return response.badrequest(res, "Missing required fields");
            }

            const existingMentor = await Mentor.findOne({ email });
            if (existingMentor) {
                return response.error(res, "Mentor with this email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            // FIX: Stop "undefined" string from saving
            const cleanMiddleName = (middlename === "undefined" || !middlename) ? "" : middlename;

            const mentor = new Mentor({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                middlename: cleanMiddleName,
                department,
                designation,
                isEmailVerified: true,
            });

            await mentor.save();
            response.success(res, "Mentor created successfully", { mentor });
            next();
        } catch (err) {
            console.log("createMentor error:", err);
            response.error(res);
        }
    },

    // Delete a mentor by ID
    deleteMentor: async (req, res, next) => {
        try {
            const { id } = req.body;
            if (!id) return response.badrequest(res, "Mentor ID is required");

            const mentor = await Mentor.findByIdAndDelete(id);
            if (!mentor) return response.notfound(res, "Mentor not found");

            response.success(res, "Mentor deleted successfully");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Update mentor credentials
    updateMentorCredentials: async (req, res, next) => {
        try {
            const { id, email, password } = req.body;
            if (!id) return response.badrequest(res, "Mentor ID is required");

            const mentor = await Mentor.findById(id);
            if (!mentor) return response.notfound(res, "Mentor not found");

            if (email) {
                const existingMentor = await Mentor.findOne({ email });
                if (existingMentor && existingMentor._id.toString() !== id) {
                    return response.error(res, "Email already in use");
                }
                mentor.email = email;
            }

            if (password) {
                mentor.password = await bcrypt.hash(password, 8);
            }

            await mentor.save();
            response.success(res, "Mentor credentials updated", { mentor });
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Create a new student with Sanitization Fix
    createStudent: async (req, res, next) => {
        try {
            const { email, password, firstname, lastname, middlename, enrollment_no, semester, department } = req.body;

            if (!email || !password || !firstname || !semester || !enrollment_no) {
                return response.badrequest(res, "Missing required fields");
            }

            const existingStudent = await Student.findOne({ email });
            if (existingStudent) {
                return response.error(res, "Student with this email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            // FIX: Stop "undefined" string from saving
            const cleanMiddleName = (middlename === "undefined" || !middlename) ? "" : middlename;

            const student = new Student({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                middlename: cleanMiddleName,
                enrollment_no,
                semester,
                department,
                isEmailVerified: true,
            });

            await student.save();
            response.success(res, "Student created successfully", { student });
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Delete a student by ID
    deleteStudent: async (req, res, next) => {
        try {
            const { id } = req.body;
            if (!id) return response.badrequest(res, "Student ID is required");

            const student = await Student.findByIdAndDelete(id);
            if (!student) return response.notfound(res, "Student not found");

            response.success(res, "Student deleted successfully");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Update student credentials
    updateStudentCredentials: async (req, res, next) => {
        try {
            const { id, email, password } = req.body;
            if (!id) return response.badrequest(res, "Student ID is required");

            const student = await Student.findById(id);
            if (!student) return response.notfound(res, "Student not found");

            if (email) {
                const existingStudent = await Student.findOne({ email });
                if (existingStudent && existingStudent._id.toString() !== id) {
                    return response.error(res, "Email already in use");
                }
                student.email = email;
            }

            if (password) {
                student.password = await bcrypt.hash(password, 8);
            }

            await student.save();
            response.success(res, "Student credentials updated", { student });
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    adminDashboardHandler: (req, res, next) => {
        response.success(res, "", { user: req.user });
        next();
    },

    getAllUsers: async (req, res, next) => {
        const students = await studentHelpers.getAllStudents();
        const mentors = await mentorHelpers.getAllMentors();
        response.success(res, "", { mentors, students });
        next();
    },

    saveGroup: async (req, res, next) => {
        try {
            const mentorCountToUpdate = {};
            const newStudentsList = {};
            const mentor = await Mentor.findById(req.body.mentorId);
            const students = req.body.studentIds;
            const oldStudents = await Student.find({
                mentoredBy: mongoose.Types.ObjectId(req.body.mentorId),
            }).distinct("_id");

            if (!mentor) return response.error(res);

            for (let i = 0; i < students.length; i++) {
                if (!newStudentsList[students[i]]) {
                    newStudentsList[students[i]] = 1;
                }
            }

            for (let i = 0; i < oldStudents.length; i++) {
                if (!newStudentsList[oldStudents[i]]) {
                    const oldStudent = await Student.findById(oldStudents[i]);
                    oldStudent.mentoredBy = undefined;
                    await oldStudent.save();
                }
            }

            for (let i = 0; i < students.length; i++) {
                const student = await Student.findById(students[i]);
                if (student.mentoredBy && student.mentoredBy !== req.body.mentorId) {
                    mentorCountToUpdate[student.mentoredBy]
                        ? (mentorCountToUpdate[student.mentoredBy] += 1)
                        : (mentorCountToUpdate[student.mentoredBy] = 1);
                }
                student.mentoredBy = mentor._id;
                await student.save();
            }

            if (Object.keys(mentorCountToUpdate).length !== 0) {
                for (let mentorId in mentorCountToUpdate) {
                    const newMentor = await Mentor.findById(mentorId);
                    newMentor.studentCount -= mentorCountToUpdate[mentorId];
                    await newMentor.save();
                }
            }

            mentor.studentCount = students.length;
            await mentor.save();

            const allStudents = await studentHelpers.getAllStudents();
            const allMentors = await mentorHelpers.getAllMentors();

            response.success(res, "Assigned Successfully", {
                mentors: allMentors,
                students: allStudents,
            });
            next();
        } catch (err) {
            console.log("catch", err);
            response.error(res);
        }
    },

    assignMentees: async (req, res, next) => {
        try {
            const { mentorId, studentIds } = req.body;
            if (!mentorId || !studentIds || studentIds.length < 1) return response.badrequest(res);
            
            const mentor = await Mentor.findById(mentorId);

            for await (const studentId of studentIds) {
                const student = await Student.findById(studentId);
                student.mentoredBy = mentor._id;
                await student.save();
            }

            const studentCount = await Student.countDocuments({ mentoredBy: mentor._id });
            mentor.studentCount = studentCount;
            await mentor.save();
            response.success(res);
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    removeMentees: async (req, res, next) => {
        try {
            const { mentorId, studentIds } = req.body;
            if (!mentorId || !studentIds || studentIds.length < 1) return response.badrequest(res);

            const mentor = await Mentor.findById(mentorId);

            for await (const studentId of studentIds) {
                const student = await Student.findById(studentId);
                if (student.mentoredBy) {
                    student.mentoredBy = undefined;
                    await student.save();
                }
            }

            const studentCount = await Student.countDocuments({ mentoredBy: mentor._id });
            mentor.studentCount = studentCount;
            await mentor.save();
            response.success(res);
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    getProfile: async (req, res, next) => {
        try {
            response.success(res, "", req.user);
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const { firstname, middlename, lastname } = req.body;
            const admin = req.user;

            admin.firstname = firstname || admin.firstname;
            admin.middlename = middlename || admin.middlename;
            admin.lastname = lastname || admin.lastname;
            await admin.save();
            response.success(res, "", admin);
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    banUser: async (req, res, next) => {
        try {
            const { id } = req.body;
            let user = await Mentor.findById(id) || await Student.findById(id);

            if (!user) return response.notfound(res);

            user.isBanned = !user.isBanned;
            await user.save();

            response.success(res, user.isBanned ? "User has been banned" : "User has been unbanned");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    getAllInteractions: async (req, res, next) => {
        try {
            const mentors = await Mentor.find();
            const result = [];

            for await (const mentor of mentors) {
                const posts = await Post.find({ group_id: mentor._id }).populate("author");
                const meetings = await Meeting.find({ host: mentor._id })
                    .populate("host")
                    .populate("participants.user");

                result.push({ mentor, posts, meetings });
            }

            response.success(res, "", { count: result.length, interactions: result });
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },
};