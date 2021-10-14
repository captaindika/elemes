const { DataTypes } = require("sequelize");
const db = require("../connection/db");

const Course = db.define("course", {
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
	price: {
		type: DataTypes.INTEGER,
		allowNull: false,
		validate: {
			min: 0,
			max: 500000,
		},
	},
	thumbnail: {
		type: DataTypes.STRING,
		allowNull: true,
	},
});

module.exports = Course;
