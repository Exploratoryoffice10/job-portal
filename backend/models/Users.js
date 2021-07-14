const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const bcryptjs = require('bcryptjs')

// ● Profile sec on details with editing option [5 marks] -
// ○ Name, Email ID, Contact Number, Bio (max 250 words)

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    dropDups: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type: String,
    enum: ["applicant","recruiter"],
    required: true
  }
},{ timestamps: true });

userSchema.plugin(uniqueValidator, { message: `Error: That {PATH} already exists.` });


userSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = bcryptjs.hashSync(this.password, 10);
  }
});
userSchema.statics.doesNotExist = async  function (field) {
  return await this.where(field).countDocuments() === 0;
};
userSchema.methods.comparePasswords =  function (password)  {
  return bcryptjs.compareSync(password, this.password);
};

module.exports = User = mongoose.model('Users', userSchema);