const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const courseProjects = require("../models/projects.js");
const Course = require("../models/courses.js")
const { error } = require("console");

router.get("/", (req, res) => {
  const courseId = req.query.courseId;
  
  

  if (!courseId) {
    return res.status(404).send("Course Id not given! ");
  }
  courseProjects
    .find({})
    .populate("coursePage")
    .then((data) => {
      // console.log("testing:", data);

      const project = data.find(
        (project) => project.coursePage && project.coursePage._id.toString() === courseId
      );
     
      const courseName = project.coursePage.courseName;
      const courseDescription = project.coursePage.courseDescription;
      const obj = {
        projects: data,
        courseId: courseId,
        courseName: courseName,
        courseDescription: courseDescription
      };

      res.render("projects.ejs", obj);
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(404).send("<h1>This course has no projects currently</h1>");
    });
});

router.get("/view", (req, res) => {
  const projectId = req.query.projectId;
  courseProjects
    .findById(projectId)
    .populate("coursePage")
    .then((data) => {
      console.log("Testing: ", data);
      const obj = { project: data };

      res.render("viewProject.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/admin/access", (req, res) => {
  courseProjects
    .find({})
    .populate("coursePage")
    .then((projects) => {
      Course.find({})
        .then((courses)=>{
          res.render("adminProject.ejs", {projects, courses})
        })
      .catch((err)=>{
        res.status(500).send(err)
      })

    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete("/:id", (req, res) => {
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

router.post("/", (req, res) => {
  const newProject = new courseProjects({
    projectName: req.body.projectName,
    studentName: req.body.studentName,
    grade: req.body.grade, //dropdown list
    yearMade: req.body.yearMade, //dropdown list
    projectDescription: req.body.projectDescription,
    projectImg: req.body.projectImg,
    projectURL: req.body.projectURL,
    coursePage: req.body.coursePage,
    madeUsing: req.body.madeUsing
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

router.patch("/:projectId", (req, res) => {
  const filter = { _id: req.params.projectId }; // by using the project id we can have access to the specifi project we are trying to change

  const update = {
    projectName: req.body.projectName,
    studentName: req.body.studentName,
    grade: req.body.grade, //dropdown list
    yearMade: req.body.yearMade, //dropdown list
    projectDescription: req.body.projectDescription,
    projectImg: req.body.projectImg,
    projectURL: req.body.projectURL,
    coursePage: req.body.coursePage,
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
