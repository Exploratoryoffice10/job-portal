require('dotenv').config()
const express = require("express");
const router = express.Router();
const joi = require("joi")
// Load Applicant model
const Applicant = require("../models/Applicants");
const Recruiter = require("../models/Recruiters");
const User = require("../models/Users");
// GET request 
// Getting all the users
router.get("/", (req, res) => {
    res.send(req.session);
});

router.post("/login", (req, res) => {
  const user = req.body.user;
  // Find user by email
  User.findOne({ "email":req.body.email }).then(user => {
      
      
    console.log(user)
    if (!user) {
      return res.status(404).json({
        error: "Email not found",
      });
        }
        else{
          Applicant.findOne({"user": user._id}).
          then(applicant => {
            console.log(applicant)
            req.session.user = user
            req.session.applicant = applicant
            req.session.save()
            res.send(req.session);
            return applicant;
          })
            
        }
  });
});

router.delete("", ({ session }, res) => {
  try {
    const user = session.user;
    if (user) {
      session.destroy(err => {
        if (err) throw (err);
        res.clearCookie(process.env.SESS_NAME);
        res.send(user);
      });
    } else {
      throw new Error('Something went wrong');
    }
  } catch (err) {
    res.status(422).send(err);
  }
});

router.get('/:id', (request, response) => {
  User.findById(request.params.id)
    .then(user => {
      if(user) response.json(job)
      else response.status(404).end
    })
    .catch(error => {
      console.log(error)
      response.status(400).send( { error : 'malformatted id' } )
    })
})

module.exports = router;