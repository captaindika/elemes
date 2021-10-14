const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { key } = process.env;
const { Op } = require("sequelize");

const register = async (req, res) => {
	try {
		const { name, password, email } = req.body;
		const result = await User.count({
			where: {
				email,
			},
		});
		if (!result) {
			const newPass = bcrypt.hashSync(password, 10000);
			await User.create({ name, email, password: newPass });
			res.status(200).json({ success: true, message: "Register successfully" });
		} else {
			res
				.status(400)
				.json({ success: false, message: "Email has already in use" });
		}
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `Something wrong on server, ${e.message}`,
		});
	}
};
const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const result = await User.findOne({
			where: {
				[Op.and]: [{ email }, { status: "active" }],
			},
			attributes: ["password", "role", "status"],
		});
		if (!result) {
			return res.status(404).json({
				success: false,
				message: `Can\'t find your account`,
			});
		}
		const checkPass = await bcrypt.compareSync(password, result.password);
		if (checkPass) {
			const token = await jwt.sign(
				{ role: result.role, status: result.status },
				key,
				{
					expiresIn: "30 days",
				}
			);
			res.status(200).json({ status: true, token });
		} else {
			res.status(404).json({
				success: false,
				message: `Please check your email & password`,
			});
		}
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `Something wrong on server, ${e.message}`,
		});
	}
};
const deleteUser = async (req, res) => {
	try {
		const { email } = req.params;
		const pastUser = await User.findOne({
			where: {
				[Op.and]: [{ email }, { status: "active" }],
			},
		});
		if (pastUser) {
			await User.update(
				{ status: "inactive" },
				{
					where: {
						[Op.and]: [{ email }, { status: "active" }],
					},
				}
			);
			res.status(200).json({
				success: true,
				message: `User with email ${email} deleted successfully`,
			});
		} else {
			res.status(404).json({
				success: false,
				message: `User with email ${email} not found`,
			});
		}
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `Something wrong on server, ${e.message}`,
		});
	}
};
module.exports = {
	register,
	login,
	deleteUser,
};
