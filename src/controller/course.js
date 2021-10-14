const Course = require("../model/course");
const { uploadCloudinary } = require("../connection/cloudinary");
const Category = require("../model/category");
const User = require("../model/user");
const { Op } = require("sequelize");

const createCourse = async (req, res) => {
	try {
		const { name, price, category_id } = req.body;
		let thumbnail;
		if (!req.file == "undefined") {
			const directoryFile = `./uploads/${req.file.filename}`;
			thumbnail = await uploadCloudinary(directoryFile);
		}
		const result = await Course.create({
			name,
			price,
			category_id,
			thumbnail: thumbnail || null,
		});
		if (!result) {
			return res
				.status(400)
				.json({ status: false, message: "Please check your request body" });
		}
		res
			.status(200)
			.json({ status: true, message: `Course ${name} created successfully` });
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};
const getCourse = async (req, res) => {
	try {
		let sort, searching, free;
		const { price, search } = req.query;
		if (search && search.length > 0) {
			searching = {
				name: {
					[Op.substring]: search,
				},
			};
		}
		switch (price) {
			case "high":
				sort = { order: [["price", "desc"]] };
				break;
			case "low":
				sort = { order: [["price", "asc"]] };
				break;
			case "free":
				free = { price: { [Op.eq]: 0 } };
				break;
			default:
				sort = {};
				free = {};
				break;
		}
		const result = await Course.findAll({
			where: {
				...searching,
				...free,
			},
			include: [{ model: Category, as: "category", attributes: ["name"] }],
			attributes: ["id", "name", "price", "thumbnail"],
			...sort,
		});
		res.status(200).json(result);
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};
const detailCourse = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Course.findOne({
			where: {
				id,
			},
			include: [{ model: Category, as: "category", attributes: ["name"] }],
		});
		Category.increment("counter", { where: { id: result.category_id } });
		res.json(result);
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};
const deleteCourse = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await Course.destroy({
			where: {
				id,
			},
		});
		if (result) {
			res.status(200).json({
				success: true,
				message: `Course with id ${id} deleted successfully`,
			});
		} else {
			res
				.status(404)
				.json({ success: false, message: `Course with id ${id} not found` });
		}
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};

const updateCourse = async (req, res) => {
	try {
		let thumbnail;
		const { id } = req.params;
		const { name, price } = req.body;
		const courseObj = {};
		if (name && name.length > 0) {
			courseObj.name = name;
		}
		if (price && price.length > 0) {
			courseObj.price = price;
		}
		if (req.file) {
			thumbnail = await uploadCloudinary(`./uploads/${req.file.filename}`);
			courseObj.thumbnail = thumbnail;
		}
		Course.update({ ...courseObj }, { where: { id } }).then((result, err) => {
			if (err)
				return res.status(400).json({
					status: false,
					message: `Invalid Course supplied`,
				});
			if (result[0]) {
				return res.status(200).json({
					success: true,
					message: `Course with id: ${id} updated successfully`,
				});
			} else {
				res.status(404).json({
					success: false,
					message: `Course with id ${id} not found`,
				});
			}
		});
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};

const statistic = async (req, res) => {
	try {
		const [freeCourse, totalCourse, totalUser] = await Promise.all([
			Course.count({
				where: {
					price: {
						[Op.eq]: 0,
					},
				},
			}),
			Course.count({}),
			User.count({
				where: {
					role: {
						[Op.ne]: "admin",
					},
				},
			}),
		]);
		res.json({ freeCourse, totalCourse, totalUser });
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};

const popularCategory = async (req, res) => {
	try {
		const result = await Category.findAll({
			order: [["counter", "DESC"]],
			limit: 1,
		});
		res.json(result);
	} catch (e) {
		res.json({ freeCourse, totalCourse, totalUser });
	}
};
module.exports = {
	createCourse,
	getCourse,
	detailCourse,
	deleteCourse,
	updateCourse,
	statistic,
	popularCategory,
};
