const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const adminController = require("../controllers/admin.controller");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

/** All admin routes are in this file
 * For protected routes we are passing the Authorize middleware to check if the user
 * is authorized to perform the operation/action.
 */

// Admin login route
router.post("/login", adminController.adminLoginHandler, Logger(events.LOGIN));

// Admin dashboard route
router.get("/dashboard", Auth, Authorize(Role.Admin), adminController.adminDashboardHandler);

// Get all mentor and students
router.get("/getAllUsers", Auth, Authorize(Role.Admin), adminController.getAllUsers);

// Saving student mentor groups
router.post(
    "/saveGroup",
    Auth,
    Authorize(Role.Admin),
    adminController.saveGroup,
    Logger(events.GROUP_UPDATE)
);

// Assign mentees
router.post("/assignMentees", Auth, Authorize(Role.Admin), adminController.assignMentees, Logger(events.GROUP_UPDATE));

// Remove mentees
router.post("/removeMentees", Auth, Authorize(Role.Admin), adminController.removeMentees, Logger(events.GROUP_UPDATE));

// Create mentor
router.post("/createMentor", Auth, Authorize(Role.Admin), adminController.createMentor);

// Delete mentor
router.delete("/deleteMentor", Auth, Authorize(Role.Admin), adminController.deleteMentor);

/** * PURGE ROUTE: Removes "John undefined Doe" permanently.
 * Only call this to clean the database.
 */
router.delete("/purge-invalid-user", Auth, Authorize(Role.Admin), adminController.purgeJohnDoe);

// Update mentor credentials
router.patch("/updateMentorCredentials", Auth, Authorize(Role.Admin), adminController.updateMentorCredentials);

// Create student
router.post("/createStudent", Auth, Authorize(Role.Admin), adminController.createStudent);

// Delete student
router.delete("/deleteStudent", Auth, Authorize(Role.Admin), adminController.deleteStudent);

// Update student credentials
router.patch("/updateStudentCredentials", Auth, Authorize(Role.Admin), adminController.updateStudentCredentials);

// Get admin profile route
router.get("/profile", Auth, Authorize(Role.Admin), adminController.getProfile);

// Admin profile update route
router.post("/profile", Auth, Authorize(Role.Admin), adminController.updateProfile);

// Banning user route
router.patch("/banUser", Auth, Authorize(Role.Admin), adminController.banUser);

// Get all interactions
router.get("/interactions", Auth, Authorize(Role.Admin), adminController.getAllInteractions);

module.exports = router;