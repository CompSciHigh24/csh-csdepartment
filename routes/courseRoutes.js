const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Course = require("../models/courses.js")




router.get("/", (req, res) => {
  Course.find({})
    .then((data) => {
      const obj = { courses: data };

      res.render("courses.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});



router.get("/admin/access", (req, res) => {
  Course.find({})
    .then((data) => {
      const obj = { courses: data };

      res.render("adminCourses.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete("/:id", (req, res) => {
  Course.deleteOne({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Course not found!" });
      } // if there no data found
      res.send({ message: "Course has been sucessfully deleted!" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});




router.post("/", (req, res) => {
  const newcourses = new Course({
    courseName: req.body.courseName,
    courseGrade: req.body.courseGrade,
    courseDescription: req.body.courseDescription,
    possibleCareerpath: req.body.possibleCareerpath
  });

  newcourses
    .save()
    .then((info) => {
      res.json(info);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.patch("/:id", (req, res) => {
  const filter = { _id: req.params.id };

  const update = {
    courseName: req.body.courseName,
    courseGrade: req.body.courseGrade,
    courseDescription: req.body.courseDescription,
    possibleCareerpath: req.body.possibleCareerpath,
    
  };

  Course.findOneAndUpdate(filter, update, { new: true })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "Course not found!" });
      }
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
