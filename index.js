const mongoose = require("mongoose");
const ejs = require("ejs");



const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
	console.log(`${req.method}: ${req.path}`);
	next();
});

const mongoDBConnectionString =
	"mongodb+srv://xabriel:CSH2024@cluster0.x02ddgh.mongodb.net/CS_Team?retryWrites=true&w=majority&appName=myAtlasClusterEDU";

mongoose.connect(mongoDBConnectionString).then(() => {
	console.log("MongoDB connected...");
});

app.use(express.json());
app.use(express.static("/public"));




const courseRoutes = require(__dirname + '/routes/courseRoutes.js')
const projectRoutes = require(__dirname + '/routes/projectRoutes.js')
const teacherRoutes = require(__dirname + '/routes/teacherRoutes.js')

app.use('/course', courseRoutes)
app.use('/project',projectRoutes)
app.use('/teacher',teacherRoutes)



app.use((req, res, next) => {
	console.log(`${req.method}: ${req.path}`);
	next();
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/home.html");
});





app.use((req, res, next) => {
	res.status(404).sendFile(__dirname + "/public/404.html")
});




app.listen("3000", (req, res) => {
	console.log("Sever RUNNING!!!");
});
