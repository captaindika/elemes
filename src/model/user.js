const { DataTypes } = require("sequelize");
const db = require("../connection/db");

const User = db.define(
	"user",
	{
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
		status: {
			type: DataTypes.ENUM(["active", "inactive"]),
			defaultValue: "active",
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				min: 8,
			},
		},
		role: {
			type: DataTypes.ENUM(["admin", "user"]),
			allowNull: false,
			defaultValue: "user",
		},
	},
	{
		tableName: "user",
		timestamps: false,
	}
);

module.exports = User;
