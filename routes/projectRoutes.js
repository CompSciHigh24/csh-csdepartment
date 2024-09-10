const express = require("express");
const router = express.Router();
const courseProjects = require("../models/projects.js");
const Course = require("../models/courses.js");
const path = require("path");
const { upload } = require('./fileUploadRoutes');
const fileUploadRoutes = require('./fileUploadRoutes');
const { error } = require("console");
const mongoose = require('mongoose')
const ObjectId  = mongoose.Types.ObjectId;
const projectsPerPage = 8;

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/project/admin/login');
};

router.get("/", (req, res) => {
  const courseId = req.query.courseId;
  const page = parseInt(req.query.page) || 1; // Get the page number from query params, default to 1
  
  if (!courseId) {
    return res.status(404).sendFile(path.join(__dirname, "../public/noCourseID.html"))
  }
  

  let query={ coursePage : new ObjectId(courseId) }

  Promise.all([
    courseProjects
      .find(query)
      .sort({ _id: -1 })  // Sort by _id in descending order
      .skip((page - 1) * projectsPerPage)
      .limit(projectsPerPage)
      .populate("coursePage"),
    courseProjects.countDocuments(query),
    Course.find({}),
    courseProjects.find(query).populate("coursePage")
  ])
  .then(([projects, totalProjects, courses, allProjects]) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);

    const courseName = projects[0]?.coursePage?.courseName;
    const courseDescription = projects[0]?.coursePage?.courseDescription;

    if (allProjects.length == 0) {
      return res.status(404).sendFile(path.join(__dirname, "../public/noProjects.html"));
    }

    
    const obj = {
      projects: projects,
      courseId: courseId,
      courseName: courseName,
      courseDescription: courseDescription,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages
    };
    res.render("projects.ejs", obj)
  })
  .catch((err) => {
    console.error("Error:", err);
    res.status(404).sendFile(path.join(__dirname, "../public/noProjects.html" ))
  });
});

router.get("/admin/login", (req, res) => {
  res.render('adminLoginPage.ejs')
});

router.get('/admin/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).send('Failed to log out!')
    }
    res.redirect('/project/admin/login')
  })
})

router.post("/admin/login/Check", (req, res) => {
  const { password } = req.body // getting the password from the body

  const adminPassword = "csDepAdmin!"

  if(password === adminPassword ){
    req.session.isAuthenticated = true
    res.status(200).json({success: true})



  }else{
    req.session.isAuthenticated = false
    res.status(200).json({success: false})
  }


});

router.get("/view", (req, res) => {
  const projectId = req.query.projectId;
  courseProjects
    .findById(projectId)
    .populate("coursePage")
    .then((data) => {
      // console.log("Testing: ", data);
      const obj = { project: data };

      res.render("viewProject.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});



router.get("/admin/access", isAuthenticated, (req, res) => {
  const page = parseInt(req.query.page) || 1; // this will get the page number from the query param , but it will default to the first page
  const courseId = req.query.courseId;

  let query = {};

  if (courseId) {
    query.coursePage = new ObjectId(courseId);
  }

  Promise.all([
    courseProjects
      .find(query)
      .sort({ _id: -1 }) // Sort by _id in descending order
      .populate("coursePage")
      .skip((page - 1) * projectsPerPage)
      .limit(projectsPerPage)
      .exec(),
    courseProjects.countDocuments(query),
    Course.find({}),
    courseProjects
      .find(query)
      .sort({ _id: -1 })
      .populate("coursePage")
      
  ])
  .then(([paginatedProjects, totalProjects, courses, allProjects]) => {
    const totalPages = Math.ceil(totalProjects / projectsPerPage);
    const reverseProjects= allProjects.reverse()

    res.render("adminProject.ejs", {
      projects: paginatedProjects,
      courses,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages,
      courseId: courseId,
      allProjects: reverseProjects
    });
  })
  .catch((err) => {
    res.status(500).send("Error: " + err.message);
  });
});






  
 
router.delete("/:id", isAuthenticated, (req, res) => {
  courseProjects
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      if(data.deletedCount === 0){
        if (!data) {
          return res.status(404).send({ message: "Project not found!" });
        } // if there no data found
      }
      res.send({ message: "Project has been sucessfully deleted!" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


router.delete("/deleteMany/:ids", isAuthenticated, (req, res) => {
  
  
  const ids = req.params.ids.split(',')

  // console.log(ids)

  

  

  if(ids.length === 0 ){
    return res.status(400).json({ message: "Invalid projectsIds provided" })
  }


  courseProjects
    .deleteMany({ _id: { $in: ids } })
    .sort({ _id: -1 })
    .then((data) => {
      console.log("Delete result:", data)
      if (data.deletedCount === 0) {
        return res.status(404).json({ message: "No projects were found to delete" });
      }

      res.status(200).json({ message: "Projects have been successfully deleted!" });
    })
    .catch((err) => {
      console.error("Error deleting projects: ", err);
      res.status(500).json({ message: "Failed to delete projects", error: err.toString() });
    });
});


router.post("/", isAuthenticated, fileUploadRoutes.upload.single('projectImg'),(req, res) => {
  const imageBuffer = req.file ? req.file.buffer : req.body.projectImg;
  const base64Image = imageBuffer ? imageBuffer.toString('base64') : null;


  const newProject = new courseProjects({
    projectName: req.body.projectName,
    studentName: req.body.studentName,
    grade: req.body.grade, 
    yearMade: req.body.yearMade, 
    projectDescription: req.body.projectDescription,
    projectImg: base64Image,
    projectURL: req.body.projectURL,
    coursePage: req.body.coursePage,
    madeUsing: req.body.madeUsing,

  });

  newProject
    .save()
    .then((json) => {
      res.json(json);
    })

    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/multi", fileUploadRoutes.upload.single('projectImg'), (req, res) => {
  const projects = req.body;
  console.log("Projects received:", projects);

  if (!Array.isArray(projects)) {
    return res.status(400).json({ error: "Expected an array of projects" });
  }

  const projectDocs = projects.map(project => ({
    projectName: project.projectName,
    studentName: project.studentName,
    grade: project.grade,
    yearMade: project.yearMade,
    projectDescription: project.projectDescription,
    projectImg: project.projectImg,
    projectURL: project.projectURL,
    coursePage: project.coursePage,
    madeUsing: project.madeUsing,
  }));

  courseProjects.insertMany(projectDocs)
    .then(savedProjects => {
      console.log('All projects saved successfully:', savedProjects.length);
      res.json(savedProjects);
    })
    .catch(err => {
      console.error("Error saving projects:", err);
      res.status(500).json({ error: "Failed to save projects", details: err.message });
    });
});



router.patch("/:projectId", isAuthenticated,fileUploadRoutes.upload.single('projectImg'),(req, res) => {
  const filter = { _id: req.params.projectId }; // by using the project id we can have access to the specifi project we are trying to change

  const imageBuffer = req.file ? req.file.buffer : req.body.projectImg;
  const base64Image = imageBuffer ? imageBuffer.toString('base64') : null;




  const update = {
    projectName: req.body.projectName,
    studentName: req.body.studentName,
    grade: req.body.grade, //dropdown list
    yearMade: req.body.yearMade, //dropdown list
    projectDescription: req.body.projectDescription,
    projectURL: req.body.projectURL,
    coursePage: req.body.coursePage,
    projectImg: base64Image,
    madeUsing: req.body.madeUsing,

  };

  courseProjects
    .findOneAndUpdate(filter, update, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Project not found!" });
      }
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
