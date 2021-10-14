const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, "./uploads/"),
	filename: (req, file, cb) => {
		const file_name = file.originalname;
		const extension = path.extname(file_name);
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, `${uniqueSuffix}${extension}`);
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1e8 },
	fileFilter: (req, file, callback) => {
		const typeFile = /jpg|jpeg|svg|png|gif/;
		const mimetype = typeFile.test(file.mimetype);
		const extName = typeFile.test(
			path.extname(file.originalname).toLowerCase()
		);
		if (mimetype && extName) {
			return callback(null, true);
		} else {
			return callback("jpg|jpeg|svg|png|gif file only");
		}
	},
}).single("thumbnail");

const filterImage = (req, res, next) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({
				success: false,
				message: err.message,
			});
		} else {
			next();
		}
	});
};

module.exports = {
	filterImage,
};
