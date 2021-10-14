const { DataTypes } = require("sequelize");
const db = require("../connection/db");

const Category = db.define("category", {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		primaryKey: true,
		autoIncrement: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	counter: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 0,
	},
});

module.exports = Category;
