const express = require("express");
const user = express.Router();
const { register, login, deleteUser } = require("../controller/user");
const { getCategory, addCategory } = require("../controller/category");
const {
	createCourse,
	getCourse,
	detailCourse,
	deleteCourse,
	updateCourse,
	statistic,
	popularCategory,
} = require("../controller/course");
const { auth, isAdmin } = require("../middleware/auth");
const { filterImage } = require("../middleware/multer");

user.post("/register", register);
user.post("/login", login);
user.get("/category", getCategory);
user.get("/category/popular", popularCategory);
user.get("/course", getCourse);
user.get("/course/:id", detailCourse);

// ______________________admin_______________________
//handle user
user.post("/category", auth, isAdmin, addCategory);
user.delete("/user/:email", auth, isAdmin, deleteUser);

// handle course
user.post("/course", auth, isAdmin, filterImage, createCourse);
user.delete("/course/:id", auth, isAdmin, deleteCourse);
user.put("/course/:id", auth, isAdmin, filterImage, updateCourse);
user.get("/statistic", auth, isAdmin, statistic);
module.exports = user;
