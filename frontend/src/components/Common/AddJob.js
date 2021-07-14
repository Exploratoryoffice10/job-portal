import React, { useState, useEffect } from 'react'
import dbService from '../../services/dbService'
import { useForm } from 'react-hook-form';

const Notification = ({message, flag}) => { //flag 0 -> error , 1-> success
  if (message === null) {
    return null
  }

  if(flag ===1){
    return (
      <div className="success">
        {message}
      </div>
    )
  }
  
  else {
   return (
      <div className="error">
        {message}
      </div>
    ) 
  }
}

const Filter = ({filterByTitle, handleFilterChange}) => {
  return(
    <div>
      Filter shown with : <input value={filterByTitle} onChange={handleFilterChange}/>
    </div>
  )
}

const Phonebook = ({addJob, newTitle, newSalary, handleTitleChange, handleSalaryChange}) => {
  return(
    <div>
      <h2>Add new</h2>
        <form onSubmit={addJob}>
          <div>
            title:
            <input 
              value={newTitle}
              onChange={handleTitleChange}/>
            salary:
            <input 
              value={newSalary}
              onChange={handleSalaryChange}/>
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
    </div>
    )
} 


const Salarys = ({jobs, deleteId}) => {
  return(
    <div>
      <h2>Salarys</h2>
      <ul> {jobs.filter( (job) => job
        ).map( (job, ind) => {
          return(
            <li key={job._id} >
              {job.title} {job.salary}
              <button type='button' onClick={() => deleteId(job._id, window.confirm(`delete ${job.title}?`))}>delete</button>
          </li>       
          )})
        }
      </ul>
    </div>
  )
}


const App = (props) => {
  const [ jobs, setJobs ] = useState([]) 
  const [ newJob, setNewJob ] = useState({})
  const [ message, setMessage] = useState(null)
  const [notifyFlag, setNotifyFlag ] = useState(0);
  const { register, handleSubmit, errors } = useForm();

  const hook = () => {
    console.log(props.user.user.email,'effect')
    
    dbService
      .getAll(props.user.user.email)
      .then(responseData => {
        console.log('promise fulfilled')
        setJobs(responseData)
      })
      .catch(error => console.log(error))
  } 

  useEffect(hook, [])

  const notify = (message, flag) =>{
    setNotifyFlag(flag)
    //console.log(notifyFlag)
    setMessage(message)
    setTimeout(() => setMessage(null) , 5000)
  }
  const addJob = (data) => {
    
    setNewJob(data)
    let titleObj = data
    

    titleObj.recruiter = { 
      name:props.user.user.name,
      email:props.user.user.email
    }

    console.log(titleObj)
    // const titleObj = {
    //   title: newTitle,
    //   recruiter:{ 
    //     name: props.user.user.name,
    //     email: props.user.user.email
    //   },
    //   maxNoOf:{
    //     applications:newMaxApplications,
    //     positions:newMaxPositions
    //   },
    //   deadline: newDeadline,
    //   requiredSkillSets:newSkills, 
    //   typeOfJob:newTypeOfJob, 
    //   duration:newDuration,  
    //   salary: newSalary
    // 
  // }
      dbService
        .create(titleObj)
        .then(responseData => {
          setJobs(jobs.concat(responseData))
          console.log(responseData)
          notify(`Added ${responseData.title}`, 1)

        })
        .catch(error => {
          notify(error.response.data.error,0)
          console.log(error.response.data.error)
        })
  }
  const updateId = (id, jobObj, confirmed) => {
    const jobTitle = jobs[jobs.map(job => job._id).indexOf(id)].title
    if (confirmed) {
      dbService.update(id, jobObj)
        .then(res => {
          setJobs(jobs.filter(job => job._id !== id).concat(jobObj))
          notify(`Updated ${jobObj.title}'s salary`, 1)
        })
        .catch(error => { 
          notify(error.response.data.error,0)
        })
    }
  }

  const deleteId = (id, confirmed) => {
    const jobTitle = jobs[jobs.map(job => job._id).indexOf(id)].title
    if (confirmed) {
      dbService.deleteObj(id)
        .then(res => {
          setJobs(jobs.filter(job => job._id !== id))
        })
        .catch(error => { 
          notify(`${jobTitle} was already removed`,0)
          setJobs(jobs.filter(job => job._id !== id))
        })
    }
  }

  const onSubmit = (data) =>{
    alert(JSON.stringify(data));
    console.log(errors);
    addJob(data);
  }
  
  return (
    <div>
      <h1 className="display-2 text-center" >Add new posting</h1>
      <br/><br/><br/>
      <form className="form-group text-center" onSubmit={handleSubmit(onSubmit)}>
      <input className="form-control" type="text" placeholder="Job title" name="title" ref={register({required: "This field is required", maxLength: 80})} />
      <p>{errors.title?.message}</p>
      <input className="form-control" type="number" placeholder="Max no. of applications" name="maxNoOf.applications" ref={register({required: "This field is required"})} />
      <p>{errors.maxNoOf?.message}</p>
      <input className="form-control" type="number" placeholder="Max. no. of positions" name="maxNoOf.positions" ref={register({required: "This field is required"})} />
      <p>{errors.maxNoOf?.message}</p>
      <input className="form-control" type="datetime-local" placeholder="Deadline" name="deadline" ref={register({required: "This field is required"})} />
      <p>{errors.deadline?.message}</p>
      <input className="form-control" type="text" placeholder="Required skills" name="requiredSkillSets" ref={register({required: "This field is required"})} />
      <p>{errors.requiredSkillSets?.message}</p>
      <select className="form-control" name="typeOfJob" ref={register({ required: "This field is required" })}>
        <option value="full-time">Full time</option>
        <option value="part-time">Part time</option>
        <option value="WFH">Work From Home</option>
      </select>
      <p>{errors.typeOfJob?.message}</p>
      <input className="form-control" type="number" placeholder="Duration" name="duration" ref={register({required: "This field is required"})} />
      <p>{errors.duration?.message}</p>
      <input className="form-control" type="number" placeholder="Salary" name="salary" ref={register({required: "This field is required"})} />
      <p>{errors.salary?.message}</p>
      <input className="form-control" type="submit" />
    </form>
    </div>
  )
}

export default App