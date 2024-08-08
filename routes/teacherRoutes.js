const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const staffModel = require("../models/teachers.js")
const { upload } = require('./fileUploadRoutes');
const fileUploadRoutes = require('./fileUploadRoutes');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }else{
    res.redirect('/teacher/admin/login');
  }
  
};



router.post("/admin/login/Check", (req, res) => {
  const { password } = req.body;
  const adminPassword = "csDepAdmin!";

  if (password === adminPassword) {
    req.session.isAuthenticated = true;
    res.status(200).json({ success: true });
  } else {
    req.session.isAuthenticated = false;
    res.status(200).json({ success: false });
  }
});

router.get('/admin/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      return res.status(500).send('Failed to log out!')
    }
    res.redirect('/teacher/admin/login')
  })
})

router.get("/", (req, res) => {
  staffModel
    .find({})
    .then((data) => {
      const obj = { Staffinfo: data };

      res.render("staff.ejs", obj);
      // res.json(data)
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/admin/login", (req, res) => {
  res.render('adminLoginTeachers.ejs');
});

router.get("/admin/access", isAuthenticated,(req, res) => {
  staffModel
    .find({})
    .then((data) => {
      const obj = { Staffinfo: data };

      res.render("adminStaff.ejs", obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
router.delete("/:id", isAuthenticated, (req, res) => {
  staffModel
    .deleteOne({ _id: req.params.id })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Staff not found!" });
      } // if there no data found
      res.send({ message: "Staff has been sucessfully deleted!" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/", isAuthenticated,fileUploadRoutes.upload.single('staffImg') ,(req, res) => {
  const imageBuffer = req.file ? req.file.buffer : req.body.staffImg;
  const base64Image = imageBuffer ? imageBuffer.toString('base64') : null;
  
  const newStaff = new staffModel({
    staffName: req.body.staffName.trim(),
    staffTitle: req.body.staffTitle.trim(),
    staffBio: req.body.staffBio.trim(),
    staffImg: base64Image,
  });

  

  newStaff
    .save()
    .then((info) => {
      res.json(info);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.patch("/:id", isAuthenticated, fileUploadRoutes.upload.single('staffImg') ,(req, res) => {
 
  const filter = { _id: req.params.id }; 
  
  const imageBuffer = req.file ? req.file.buffer : req.body.staffImg;
  const base64Image = imageBuffer ? imageBuffer.toString('base64') : null;
  

  const update = {
    staffName: req.body.staffName.trim(),
    staffTitle: req.body.staffTitle.trim(),
    staffBio: req.body.staffBio.trim(),
    staffImg: base64Image,
  };

  staffModel
    .findOneAndUpdate(filter, update, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Staff not found!" });
      }
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
