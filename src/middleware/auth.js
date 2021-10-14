const jwt = require("jsonwebtoken");
const { key } = process.env;
const auth = (req, res, next) => {
	try {
		const { authorization } = req.headers;
		if (authorization && authorization.startsWith("Bearer")) {
			jwt.verify(
				authorization.slice(7, authorization.length),
				key,
				(err, result) => {
					if (err) throw err;
					const { exp, role, status } = result;
					// check if token is expired
					if (Date.now() >= exp * 1000) {
						res.status(401).json({ success: false, message: "Invalid token" });
					}
					req.user = { role, status };
					next();
				}
			);
		} else {
			res.status(401).json({ success: false, message: "Invalid credential" });
		}
	} catch (e) {
		res.json({
			success: false,
			message: `Something wrong with server, ${e.message}`,
		});
	}
};
const isAdmin = (req, res, next) => {
	if (req.user.role !== "admin" || req.user.status == "inactive") {
		return res
			.status(401)
			.json({ success: false, message: "You can't access this feature" });
	}
	next();
};
module.exports = {
	auth,
	isAdmin,
};
