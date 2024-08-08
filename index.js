const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')
const ejs = require("ejs");
const courseProjects = require("./models/projects.js");
const Course = require("./models/courses.js");
const bodyParser = require('body-parser')
const express = require("express");
const passport = require("passport");
const session = require('express-session')
const app = express();
const crypto = require('crypto');

const generateRandomString = (length) => {
	return crypto.randomBytes(Math.ceil(length / 2))
		.toString('hex') // convert to hexadecimal format
		.slice(0, length); // return required number of characters
};

const secretSessionKey = generateRandomString(32)

app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use(express.static("/public"));
app.use(express.urlencoded({ extended: true }))
const mongoDBConnectionString ="mongodb+srv://xabriel:CSH2024@cluster0.x02ddgh.mongodb.net/CS_Team?retryWrites=true&w=majority&appName=myAtlasClusterEDU";

// const oneDayMilliseconds = 24 * 60 * 60 * 1000


app.use(session({
	secret: secretSessionKey,
	resave: false,
	saveUninitialized: false,
	store: MongoStore.create({ mongoUrl: mongoDBConnectionString }),
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		// maxAge: 4 * oneDayMilliseconds, // last for 4 days
		// expires: new Date(Date.now() + 4 * oneDayMilliseconds),
	},
}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
	console.log(`${req.method}: ${req.path}`);
	next();
});



mongoose.connect(mongoDBConnectionString).then(() => {
	console.log("MongoDB connected...");
});






const courseRoutes = require(__dirname + '/routes/courseRoutes.js')
const projectRoutes = require(__dirname + '/routes/projectRoutes.js')
const teacherRoutes = require(__dirname + '/routes/teacherRoutes.js')
const {router: fileUploadRouter} = require(__dirname + '/routes/fileUploadRoutes.js')

app.use('/course', courseRoutes)
app.use('/project',projectRoutes)
app.use('/teacher',teacherRoutes)
app.use('/upload', fileUploadRouter)



app.use((req, res, next) => {
	console.log(`${req.method}: ${req.path}`);
	next();
});

app.get("/justhere", (req, res) => {
	res.sendFile(__dirname + "/public/home.html");
});

function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
}


app.get("/", (req, res) => {
	courseProjects
		.find({})
		.populate("coursePage")
		.then((data) => {
			const obj = { projects: shuffleArray(data) };

			res.render("home.ejs", obj);
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});





app.use((req, res, next) => {
	res.status(404).sendFile(__dirname + "/public/404.html")
});




app.listen("3000", (req, res) => {
	console.log("Sever RUNNING!!!");
});
