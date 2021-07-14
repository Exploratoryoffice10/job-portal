const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// ● Profile sec on details with editing option [5 marks] -
// ○ Name, Email ID, Contact Number, Bio (max 250 words)

const recruiterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  contactNumber:{
    type: Number,
    required: true
  },
  bio :{
    type: String,
    required: false
  }
  
});


module.exports = Recruiter = mongoose.model('Recruiters', recruiterSchema)