const express = require("express");
const app = express();
const port = 3000;
const db = require("./src/connection/db");
const { relation } = require("./src/model/relation");
const user = require("./src/route/user");
const cors = require("cors");
const { runSeed } = require("./src/model/seeder");

db.authenticate()
	.then(async () => {
		console.log("Database connected");
		relation();
		await db.sync({ force: false });
		await runSeed();
	})
	.catch((err) => console.log("Fail to connect DB: ", err.message));

app.use(cors());
app.use(express.json());
app.use(user);
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
