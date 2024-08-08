const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Course = require("../models/courses.js")

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/course/admin/login');
};

router.get("/admin/login", (req, res) => {
  res.render('adminLoginCourses.ejs')
});

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

router.get('/admin/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).send('Failed to log out!')
    }
    res.redirect('/course/admin/login')
  })
})





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




router.get("/admin/access", isAuthenticated,(req, res) => {
  Course.find({})
    .then((data) => {
      const obj = { courses: data };

      res.render("adminCourses.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.delete("/:id", isAuthenticated,(req, res) => {
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




router.post("/", isAuthenticated,(req, res) => {
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

router.patch("/:id", isAuthenticated, (req, res) => {
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
