import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"
import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/AddJob'
import Navbar from './components/templates/Navbar'
import Example from './components/templates/Example'
import RecruiterDashboard from './components/Users/RecruiterDashboard'
import ApplicantDashboard from './components/Users/ApplicantDashboard'
import MyApplications from './components/Users/MyApplications'
import SignIn from './components/templates/SignIn'
import SignUp from './components/templates/SignUp'
import UserService from './services/UserService'

const AuthRoute = ({ loggedIn, role, path, reloadHook, component: Component }) => (
  <Route
    exact path={path}
    render={props => (
      loggedIn ?
      <Redirect to='/' /> :
      <Component  reloadHook={reloadHook} {...props} />
    )}
  />
);

const PrivateRoute = ({ loggedIn, user, path, reloadHook, acomponent: AComponent, rcomponent: RComponent }) => (
  <Route
    exact path={path}
    render={ props => {
      if (loggedIn && user.user.role==='applicant')
        return <AComponent user={user} reloadHook={reloadHook} />
      else if (loggedIn)
      return <RComponent user={user} reloadHook={reloadHook}  />
      else return <Redirect to='/login' />
    }}
  />
);

const FourOFour = () =>{
  return(<><br/><br/><br/><br/><h2>404</h2></>)
}

const App =  () => {
 
  const [ user, setUser] = useState({
    loggedIn:false,
    user : {},
    role : {}
  })
  const [loading, setLoading] = useState(true)
 
    
  
  const reloadHook = () => {
    console.log('initialiser_rendering')
    UserService.checkLogin().then(r => {
      if(r.user){
        setUser({
          loggedIn:true,
          user: r.user,
          role: r.applicant ? r.applicant : r.recruiter
        })
      }
      else{
        setUser({
          loggedIn:false,
          user : {},
          role : {}
        })   
      }
      setLoading(false)
    })
  }   

  useEffect(reloadHook,[])

  if(!loading){ 
    return ( 
          <div >
          <Navbar loggedIn={user.loggedIn} user={user} reloadHook={reloadHook} />
          <Router>     
            <Switch>
              <AuthRoute loggedIn={user.loggedIn}   path="/register" user={user} reloadHook={reloadHook} component={SignUp}/>
              <AuthRoute loggedIn={user.loggedIn}   path="/login" user={user}  reloadHook={reloadHook}  component={SignIn}/>
              <AuthRoute loggedIn={user.loggedIn}   path="/dashboard" user={user}  component={Navbar}  />
              <PrivateRoute loggedIn={user.loggedIn} path="/myapplications" user={user}  acomponent={MyApplications} rcomponent={UsersList}  />
              <PrivateRoute  loggedIn={user.loggedIn} path="/createNew" user={user}  acomponent={ApplicantDashboard} rcomponent={Register}/>
              <PrivateRoute loggedIn={user.loggedIn}  path="/" user={user}  acomponent={ApplicantDashboard} rcomponent={RecruiterDashboard}/>
              <Route component={FourOFour}/>
            </Switch>
        </Router>
        </div>
      );
  }
  else return <h1>Loading...</h1>
}

export default App;
