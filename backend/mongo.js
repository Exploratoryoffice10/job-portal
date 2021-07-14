const jobSchema = new mongoose.Schema({
  title: String,
  date: Date,
  recruiter:{
    name:String,
    email:String
  }
  maxNoOf:{
    applications:Number,
    positions:Number
  }
  dateOfPosting: Date,
  deadline: Date,//dd/mm/yyyy hr min
  requiredSkillSets:String, //languages
  typeOfJob:String, //Full time, part time,WFH
  duration:String, //in months
  salary:String, //per month
  rating:Number //0-5
})

const Job = mongoose.model('Job', jobSchema)

if ( process.argv.length === 3){
  Job.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(job => {
      console.log(job.name, job.number)
    })
    mongoose.connection.close()
  })
}
else {
  const job = new Job({
    Title: `${name}`,
    salary: `${number}`,
  })

  job.save().then(() => {
    console.log(`added ${name} ${number} to job listings`)
    mongoose.connection.close()
  })
}