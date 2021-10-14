const { Sequelize } = require("sequelize");

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize("db", "user", "password", {
	host: "localhost",
	dialect: "mysql",
	logging: false,
});

module.exports = db;
