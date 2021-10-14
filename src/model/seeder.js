const User = require("./user");
require("dotenv").config();
const { admin_pw } = process.env;
const bcrypt = require("bcrypt");

const runSeed = async () => {
	try {
		const isExist = await User.count({ where: { email: "mamat@gmail.com" } });
		if (!isExist) {
			const password = await bcrypt.hashSync(admin_pw, 10000);
			const admin = await User.create({
				name: "Mamat Manja",
				email: "mamat@gmail.com",
				password,
				role: "admin",
			});
			if (admin) {
				console.log("Admin account created");
			} else {
				throw "Can't create admin account";
			}
		}
	} catch (e) {
		console.log(e);
	}
};

module.exports = {
	runSeed,
};
