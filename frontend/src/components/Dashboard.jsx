import React, { useState, useEffect } from 'react'
import dbService from './services/dbService'

const Notification = ({message, flag}) => { //flag 0 -> error , 1-> success
  if (message === null) {
    return null
  }

  if(flag ===1){
    return (
      <div classTitle="success">
        {message}
      </div>
    )
  }
  
  else {
   return (
      <div classTitle="error">
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


const Salarys = ({jobs, deleteId, filterByTitle}) => {
  return(
    <div>
      <h2>Salarys</h2>
      <ul> {jobs.filter( (job) => job.title.toLowerCase().includes(filterByTitle.toLowerCase())
        ).map( (job, ind) => {
          return(
            <li key={job.title} >
              {job.title} {job.salary}
              <button type='button' onClick={() => deleteId(job.id, window.confirm(`delete ${job.title}?`))}>delete</button>
          </li>       
          )})
        }
      </ul>
    </div>
  )
}


const App = () => {
  const [ jobs, setJobs ] = useState([]) 
  const [ newTitle, setNewTitle ] = useState('')
  const [ newSalary, setNewSalary ] = useState('')
  const [ filterByTitle, setFilterByTitle ] = useState('')
  const [ message, setMessage] = useState(null)
  const [notifyFlag, setNotifyFlag ] = useState(0);
  
  const hook = () => {
    console.log('effect')
    dbService
      .getAll()
      .then(responseData => {
        console.log('promise fulfilled')
        setJobs(responseData)
      })
  } 

  useEffect(hook, [])

  const notify = (message, flag) =>{
    setNotifyFlag(flag)
    //console.log(notifyFlag)
    setMessage(message)
    setTimeout(() => setMessage(null) , 5000)
  }
  const addJob = (event) => {
    event.preventDefault()
    const titleObj = {title: newTitle, salary: newSalary}
    let jobFound = jobs.find( job => job.title.toLowerCase() === newTitle.toLowerCase())
    if(jobFound!==undefined){    
      console.log(newSalary, jobFound)
      if(newSalary === jobFound.salary) alert(`${newTitle} is already added to phonebook with same ph.salary`);
      else {
        updateId(jobFound.id, titleObj, window.confirm(`${newTitle} is already added to phonebook, replace the old salary with a new one?`))
        
      }    
    }
    else {
      dbService
        .create(titleObj)
        .then(responseData => {
          setJobs(jobs.concat(responseData))
          console.log(responseData)
          notify(`Added ${responseData.title}`, 1)
          setNewTitle('')
          setNewSalary('')
        })
        .catch(error => {
          notify(error.response.data.error,0)
          console.log(error.response.data.error)
        })

    }

    setNewTitle('');
    setNewSalary('');
  }
  const updateId = (id, jobObj, confirmed) => {
    const jobTitle = jobs[jobs.map(job => job.id).indexOf(id)].title
    if (confirmed) {
      dbService.update(id, jobObj)
        .then(res => {
          setJobs(jobs.filter(job => job.id !== id).concat(jobObj))
          notify(`Updated ${jobObj.title}'s salary`, 1)
        })
        .catch(error => { 
          notify(error.response.data.error,0)
        })
    }
  }

  const deleteId = (id, confirmed) => {
    const jobTitle = jobs[jobs.map(job => job.id).indexOf(id)].title
    if (confirmed) {
      dbService.deleteObj(id)
        .then(res => {
          setJobs(jobs.filter(job => job.id !== id))
        })
        .catch(error => { 
          notify(`${jobTitle} was already removed`,0)
          setJobs(jobs.filter(job => job.id !== id))
        })
    }
  }

  const handleTitleChange = (event) => setNewTitle(event.target.value);
  
  const handleSalaryChange = (event) => setNewSalary(event.target.value);
  
  const handleFilterChange = (event) => setFilterByTitle(event.target.value);


  return (
    <div>
      <h1>Job Listings</h1>
      <Notification message={message} flag={notifyFlag}/>
      <Filter filterByTitle={filterByTitle} handleFilterChange={handleFilterChange}/>
      <Phonebook 
        addJob={addJob} 
        newTitle={newTitle} 
        newSalary={newSalary} 
        handleTitleChange={handleTitleChange} 
        handleSalaryChange={handleSalaryChange}
      />
      <Salarys jobs={jobs} deleteId={deleteId} filterByTitle={filterByTitle}/>
    </div>
  )
}

export default App