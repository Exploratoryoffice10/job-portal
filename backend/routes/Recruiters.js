var express = require("express");
var router = express.Router();
const { recruiterSchema } = require("../validation/Users")
// Load Recruiter model
const Recruiter = require("../models/Recruiters");

// GET request 
// Getting all the users
router.get("/", function(req, res) {
    console.log(req.session)
    Recruiter.find(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			res.json(users);
		}
	})
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db
router.post("/register", (req, res) => {
    
  const check_recruiter = req.body

  if(err = recruiterSchema.validate(check_recruiter, {abortEarly: false}).error){
    console.log(err.details)
    res.status(400).send(err);
  }

  else{
    const newUser = new User({
        name: req.body.user.name,
        email: req.body.user.email,
        password: req.body.user.password,
        role: "recruiter"
    });    
    newUser.save()
        .then(user => {
            const newRecruiter = new Recruiter({
              user: user,
              contactNumber: req.body.contactNumber,
              bio: req.body.bio
          });

          newRecruiter.save()
              .then(recruiter => {
                  req.session.user = newUser
                  req.session.recruiter = newRecruiter
                  req.session.save()
                  res.status(200).json(recruiter);
              }).catch(err => {
                  console.log(err)
                  res.status(400).send(err);
              });
              
        
        })
        .catch(err => {
                  console.log(err)
                  res.status(400).send(err);
              });
    }
});


// POST request 
// Login
router.post("/login", (req, res) => {
  

  const {email, password} = req.body
  User.findOne({ email }).then(user => {
      
    console.log(user)
    if (!user) {
      return res.status(404).json({
        error: "Email not found",
      });
    }
    else if (user && user.comparePasswords(password)) {
      Recruiter.findOne({"user": user._id})
      .then(recruiter => {
      req.session.user = user
      req.session.recruiter = recruiter     
      console.log(req.session)
      })

      return res.send(user);
    } 
    else {
          throw new Error('Invalid login credentials');
    }

  }).catch(error => {
      console.log(error)
       return res.status(400).send( { error : 'malformatted id' } )
    })
});


router.get('/:id', (request, response) => {
  Recruiter.findById(request.params.id)
    .then(job => {
      if(job) response.json(job)
      else response.status(404).end
    })
    .catch(error => {
      console.log(error)
      response.status(400).send( { error : 'malformatted id' } )
    })
})

router.put('/:id', (request, response, next) => {
  const body = request.body

  const job = {
    title: body.title,
    salary: body.salary,
    dateOfPosting: body.dateOfPosting
  }
  console.log(job)
  Recruiter.findByIdAndUpdate(request.params.id, job, { new: true, runValidators: true, context: 'query' })
    .then(updatedRecruiter => {
      console.log(updatedRecruiter)
      response.json(updatedRecruiter)
    })
    .catch(error => {
      console.log('failed')
      next(error)
    })


})


router.delete('/:id', (request, response, next) => {
  Recruiter.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

module.exports = router;