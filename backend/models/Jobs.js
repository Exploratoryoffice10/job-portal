const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  title: String,
  recruiter:{
    name:String,
    email:String
  },
  maxNoOf:{
    applications:Number,
    positions:Number
  },
  dateOfPosting: {
    type:Date,
    default:Date.now()
  },
  deadline: Date,
  requiredSkillSets:[{type:String}], 
  typeOfJob:String, 
  duration:Number, 
  salary:String, 
  rating:Number,
  applications:[
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
      },
      sop:String,
      rating:Number,
      status:{ 
        type:String,
        default:"Applied"
      }
    }
  ]
});



module.exports = Job = mongoose.model('Jobs', jobSchema)