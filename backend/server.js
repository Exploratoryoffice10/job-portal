require('dotenv').config()
const Job = require('./models/Jobs')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('post-data', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  Job.estimatedDocumentCount( (error, count) => {
    if(!error)  response.send(`<div>Job portal has info for ${count} jobs<div><div>${new Date()}</div>`)
  })
})

app.get('/api/jobs', (request, response) => {
  Job.find({}).then(jobs => {
    response.json(jobs.map(job => job.toJSON()))
  })
})

app.get('/api/jobs/:id', (request, response) => {
  Job.findById(request.params.id)
    .then(job => {
      if(job) response.json(job)
      else response.status(404).end
    })
    .catch(error => {
      console.log(error)
      response.status(400).send( { error : 'malformatted id' } )
    })
})

app.post('/api/jobs', (request, response, next) => {
  const body = request.body

  if(!body) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  else if(!body.title) {
    return response.status(400).json({
      error: 'Name is missing'
    })
  }

  else if(!body.salary) {
    return response.status(400).json({
      error: 'Number is missing'
    })
  }

  //console.log(jobs.find((title) => title == body.title))
  const job = new Job({
    title: body.title,
    salary: body.salary,
    dateOfPosting: new Date()
  })

  job.save()
    .then(savedJob => {
      response.json(savedJob.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/jobs/:id', (request, response, next) => {
  const body = request.body

  const job = {
    title: body.title,
    salary: body.salary,
    dateOfPosting: body.dateOfPosting
  }
  console.log(job)
  Job.findByIdAndUpdate(request.params.id, job, { new: true, runValidators: true, context: 'query' })
    .then(updatedJob => {
      console.log(updatedJob)
      response.json(updatedJob)
    })
    .catch(error => {
      console.log('failed')
      next(error)
    })


})


app.delete('/api/jobs/:id', (request, response, next) => {
  Job.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      next(error)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.title === 'CastError')
    return response.status(400).send({ error: 'malformed id' })

  else if (error.title === 'ValidationError')
    return response.status(400).json({ error: error.message })

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})