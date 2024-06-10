const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const staffModel = require("../models/teachers.js")

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
router.get("/admin/access", (req, res) => {
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
router.delete("/:id", (req, res) => {
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

router.post("/", (req, res) => {
  const newStaff = new staffModel({
    staffName: req.body.staffName.trim(),
    staffTitle: req.body.staffTitle.trim(),
    staffBio: req.body.staffBio.trim(),
    staffImg: req.body.staffImg.trim(),
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

router.patch("/:staffName", (req, res) => {
 
  const filter = { staffName: req.params.staffName.trim() }; // this encodes the spaces so that it has % signs Fix it!!!
  

  const update = {
    staffName: req.body.staffName.trim(),
    staffTitle: req.body.staffTitle.trim(),
    staffBio: req.body.staffBio.trim(),
    staffImg: req.body.staffImg.trim(),
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
