const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/auth");
const adminController = require("../controllers/admin.controller");
const Authorize = require("../middlewares/authorize");
const Role = require("../utils/roles");
const Logger = require("../middlewares/logger");
const events = require("../utils/logEvents");

// Admin login route - No Auth middleware here!
router.post("/login", adminController.adminLoginHandler, Logger(events.LOGIN));

// Protected Routes - Using Role.ADMIN (All Caps)
router.get("/dashboard", Auth, Authorize(Role.ADMIN), adminController.adminDashboardHandler);
router.get("/getAllUsers", Auth, Authorize(Role.ADMIN), adminController.getAllUsers);

// Group & User Management
router.post("/assignMentees", Auth, Authorize(Role.ADMIN), adminController.assignMentees, Logger(events.GROUP_UPDATE));
router.post("/createMentor", Auth, Authorize(Role.ADMIN), adminController.createMentor);
router.post("/createStudent", Auth, Authorize(Role.ADMIN), adminController.createStudent);
router.delete("/purge-invalid-user", Auth, Authorize(Role.ADMIN), adminController.purgeJohnDoe);

module.exports = router;