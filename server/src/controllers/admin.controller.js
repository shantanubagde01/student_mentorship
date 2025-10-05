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
 * This module consists of all the handler function for the admin route
 */

module.exports = {
    /** Admin Login Handler */
    adminLoginHandler: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                // if email/pass does not exists
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

    // Create a new mentor
    createMentor: async (req, res, next) => {
        try {
            const { email, password, firstname, lastname, middlename, department, designation } = req.body;

            console.log("createMentor request body:", req.body);

            if (!email || !password || !firstname) {
                console.log("createMentor missing required fields");
                return response.badrequest(res, "Missing required fields");
            }

            const existingMentor = await Mentor.findOne({ email });
            if (existingMentor) {
                console.log("createMentor mentor already exists with email:", email);
                return response.error(res, "Mentor with this email already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 8);

            const mentor = new Mentor({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                middlename: middlename || "",
                department,
                designation,
                isEmailVerified: true,
            });

            await mentor.save();
            console.log("createMentor mentor saved:", mentor);
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
            if (!id) {
                return response.badrequest(res, "Mentor ID is required");
            }

            const mentor = await Mentor.findByIdAndDelete(id);
            if (!mentor) {
                return response.notfound(res, "Mentor not found");
            }

            response.success(res, "Mentor deleted successfully");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Update mentor credentials (email/password)
    updateMentorCredentials: async (req, res, next) => {
        try {
            const { id, email, password } = req.body;
            if (!id) {
                return response.badrequest(res, "Mentor ID is required");
            }

            const mentor = await Mentor.findById(id);
            if (!mentor) {
                return response.notfound(res, "Mentor not found");
            }

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

    // Create a new student
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

            const student = new Student({
                email,
                password: hashedPassword,
                firstname,
                lastname,
                middlename: middlename || "",
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
            if (!id) {
                return response.badrequest(res, "Student ID is required");
            }

            const student = await Student.findByIdAndDelete(id);
            if (!student) {
                return response.notfound(res, "Student not found");
            }

            response.success(res, "Student deleted successfully");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // Update student credentials (email/password)
    updateStudentCredentials: async (req, res, next) => {
        try {
            const { id, email, password } = req.body;
            if (!id) {
                return response.badrequest(res, "Student ID is required");
            }

            const student = await Student.findById(id);
            if (!student) {
                return response.notfound(res, "Student not found");
            }

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

    // admin dashboard handler function
    adminDashboardHandler: (req, res, next) => {
        response.success(res, "", { user: req.user });
        next();
    },

    // this route handler returns the list of all users i.e, all mentors and students
    getAllUsers: async (req, res, next) => {
        const students = await studentHelpers.getAllStudents();
        const mentors = await mentorHelpers.getAllMentors();
        response.success(res, "", { mentors, students });
        next();
    },

    /**
     *  saveGroup route saves the mentor and students group.
     *  We store the mentor's id in every student's property named "mentordBy" , to establish a link
     *  between a mentor and the students mentored by him.
     *
     * Add/Update and unassigned students operations are in this route
     * */
    saveGroup: async (req, res, next) => {
        try {
            const mentorCountToUpdate = {};
            const newStudentsList = {};
            const mentor = await Mentor.findById(req.body.mentorId);
            const students = req.body.studentIds;
            const oldStudents = await Student.find({
                mentoredBy: mongoose.Types.ObjectId(req.body.mentorId),
            }).distinct("_id");

            console.log("student", oldStudents);

            if (!mentor) {
                // if mentor doesn't exists
                return response.error(res);
            }

            // generating the newStudentList object or hash map
            for (let i = 0; i < students.length; i++) {
                if (!newStudentsList[students[i]]) {
                    newStudentsList[students[i]] = 1;
                }
            }

            // finding the students not in the old instance from db
            for (let i = 0; i < oldStudents.length; i++) {
                if (!newStudentsList[oldStudents[i]]) {
                    const oldStudent = await Student.findById(oldStudents[i]);
                    oldStudent.mentoredBy = undefined;
                    // oldStudent.assigned = "";
                    await oldStudent.save();
                }
            }

            // looping through students array
            for (i = 0; i < students.length; i++) {
                const student = await Student.findById(students[i]);
                // checking for changes in the new request. And updating the student count
                if (student.mentoredBy && student.mentoredBy !== req.body.mentorId) {
                    mentorCountToUpdate[student.mentoredBy]
                        ? (mentorCountToUpdate[student.mentoredBy] += 1)
                        : (mentorCountToUpdate[student.mentoredBy] = 1);
                }
                student.mentoredBy = mentor._id;
                // setting student to assigned
                // student.assigned = "in a group";
                await student.save();
            }

            if (Object.keys(mentorCountToUpdate).length !== 0) {
                for (let mentorId in mentorCountToUpdate) {
                    const newMentor = await Mentor.findById(mentorId);
                    newMentor.studentCount -= mentorCountToUpdate[mentorId];
                    // if (newMentor.studentCount < 1) {
                    //     newMentor.assigned = "unassigned"; // "" empty string is used to set false
                    // }
                    await newMentor.save();
                }
            }

            // setting mentor to assigned
            // if (students.length === 0) {
            //     mentor.assigned = "unassigned";
            // } else {
            //     mentor.assigned = "assigned";
            // }
            // setting no of students
            mentor.studentCount = students.length;
            await mentor.save();

            // getting all the students and mentors after performing all the above operations
            const allStudents = await studentHelpers.getAllStudents();
            const allMentors = await mentorHelpers.getAllMentors();

            // log.generateLog(logEvents.GROUP_UPDATE, req.user, req.ip); // logging the event

            // sending final response back
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
    // this handler assign students to a mentor
    assignMentees: async (req, res, next) => {
        try {
            const { mentorId, studentIds } = req.body;

            // data not provided
            if (!mentorId || !studentIds || studentIds.length < 1) {
                return response.badrequest(res);
            }
            // getting mentor profile
            const mentor = await Mentor.findById(mentorId);

            for await (const studentId of studentIds) {
                const student = await Student.findById(studentId);

                // checking if mentee is already assigned to another mentor
                // if (student.mentoredBy) {
                //     return response.error(res, "Mentee already assigned to another mentor");
                // }
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
    // remove mentees from under a mentor
    removeMentees: async (req, res, next) => {
        try {
            const { mentorId, studentIds } = req.body;

            // data not provided
            if (!mentorId || !studentIds || studentIds.length < 1) {
                return response.badrequest(res);
            }

            // getting mentor profile
            const mentor = await Mentor.findById(mentorId);

            for await (const studentId of studentIds) {
                const student = await Student.findById(studentId);

                // checking if mentor is already assigned to a mentor
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

    // get admin profile
    getProfile: async (req, res, next) => {
        try {
            const admin = req.user;
            response.success(res, "", admin);
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // update Profile
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

    // user banning handler
    banUser: async (req, res, next) => {
        try {
            const { id } = req.body;
            let user;

            if (!user) {
                user = await Mentor.findById(id);
            }

            if (!user) {
                user = await Student.findById(id);
            }

            if (!user) {
                return response.notfound(res);
            }

            if (user.isBanned) {
                user.isBanned = false;
            } else {
                user.isBanned = true;
            }

            await user.save();

            if (user.isBanned) response.success(res, "User has been banned");
            else response.success(res, "User has been unbanned");
            next();
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },

    // get all interactions for admin
    getAllInteractions: async (req, res, next) => {
        try {
            const mentors = await Mentor.find();
            const result = [];

            for await (const mentor of mentors) {
                const posts = await Post.find({ group_id: mentor._id }).populate("author");
                const meetings = await Meeting.find({ host: mentor._id })
                    .populate("host")
                    .populate("participants.user");

                result.push({
                    mentor,
                    posts,
                    meetings,
                });
            }

            response.success(res, "", { count: result.length, interactions: result });
        } catch (err) {
            console.log(err);
            response.error(res);
        }
    },
};
