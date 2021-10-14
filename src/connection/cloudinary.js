const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv").config();
const { cloud_name, api_key, api_secret } = process.env;

const uploadCloudinary = async (filePath) => {
	try {
		cloudinary.config({
			cloud_name,
			api_key,
			api_secret,
		});
		const { secure_url } = await cloudinary.uploader.upload(filePath);
		fs.unlinkSync(filePath);
		return secure_url;
	} catch (e) {
		throw e.message;
	}
};

module.exports = {
	uploadCloudinary,
};
