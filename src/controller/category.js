const Category = require("../model/category");
const addCategory = async (req, res) => {
	try {
		const { name } = req.body;
		const category = await Category.create({ name, counter: 0 });
		res.json({
			success: true,
			message: `Category ${category.name} created successfully`,
		});
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};

const getCategory = async (req, res) => {
	try {
		const listCategory = await Category.findAll();
		res.json(listCategory);
	} catch (e) {
		res.status(500).json({ status: false, message: e.message });
	}
};

module.exports = {
	addCategory,
	getCategory,
};
