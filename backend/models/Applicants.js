const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
//Profile Sec on Details with edi ng op on [5 marks] -
// ○ Name, Email ID
// ○ Educa on - Each educa on instance contains the following
// ■ Institution Name - A textbox for the college/ school they studied in.
// ■ Start Year (YYYY) - compulsory, and End Year (YYYY) - (not compulsory)
// Job Applicants must be able to add mul ple educa on instances with the start
// and end year(if applicable) for each.
// ○ Skills
// ■ A list of languages they are comfortable in. They should be able to add
// addi onal language not already present.
// ○ Ra ng (0-5) - Should be dynamic
// ○ Upload Resume / CV PDF ( Bonus - 2.5 marks )
// ■ An upload bu on asking them to submit a pdf.
// ○ Profile Image Upload ( Bonus - 2.5 marks )
// ■ An image upload op on for profile photo
const institutionSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  startYear:{
    type: Number,
    required: true
  },
  endYear:{
    type: Number,
    required: false,
  }
})

const applicantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  education: [institutionSchema],
});




module.exports = Applicant = mongoose.model('Applicants', applicantSchema)