const User = require("./user");
const category = require("./category");
const course = require("./course");

const relation = () => {
	category.hasMany(course, { foreignKey: "category_id", as: "category" });
	course.belongsTo(category, { foreignKey: "category_id", as: "category" });
};

module.exports = {
	relation,
};
