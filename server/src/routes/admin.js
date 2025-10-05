const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const adminController = require("../controllers/admin.controller");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

/** All admin routes are in this file
 *  For protected routes we are passing the Authorize middleware to check if the user
 *  is authorized to perform the operation/action.
 *
 *  **This will prevent other users of the system from penetrating into the admin dashboard
 */

// admin login route
router.post("/login", adminController.adminLoginHandler, Logger(events.LOGIN));

// admin dashboard route
router.get("/dashboard", Auth, Authorize(Role.Admin), adminController.adminDashboardHandler);

// get all mentor and students
router.get("/getAllUsers", Auth, Authorize(Role.Admin), adminController.getAllUsers);

// saving student mentor groups
router.post(
    "/saveGroup",
    Auth,
    Authorize(Role.Admin),
    adminController.saveGroup,
    Logger(events.GROUP_UPDATE)
);

// assign mentees
router.post("/assignMentees", Auth, Authorize(Role.Admin), adminController.assignMentees, Logger(events.GROUP_UPDATE));

// assign mentees
router.post("/removeMentees", Auth, Authorize(Role.Admin), adminController.removeMentees, Logger(events.GROUP_UPDATE));

// create mentor
router.post("/createMentor", Auth, Authorize(Role.Admin), adminController.createMentor);

// delete mentor
router.delete("/deleteMentor", Auth, Authorize(Role.Admin), adminController.deleteMentor);

// update mentor credentials
router.patch("/updateMentorCredentials", Auth, Authorize(Role.Admin), adminController.updateMentorCredentials);

// create student
router.post("/createStudent", Auth, Authorize(Role.Admin), adminController.createStudent);

// delete student
router.delete("/deleteStudent", Auth, Authorize(Role.Admin), adminController.deleteStudent);

// update student credentials
router.patch("/updateStudentCredentials", Auth, Authorize(Role.Admin), adminController.updateStudentCredentials);

// get admin profile route
router.get("/profile", Auth, Authorize(Role.Admin), adminController.getProfile);

// admin profile update route
router.post("/profile", Auth, Authorize(Role.Admin), adminController.updateProfile);

// banning user route
router.patch("/banUser", Auth, Authorize(Role.Admin), adminController.banUser);

// get all interactions
router.get("/interactions", Auth, Authorize(Role.Admin), adminController.getAllInteractions);

module.exports = router;
