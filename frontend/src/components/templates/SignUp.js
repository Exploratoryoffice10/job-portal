import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import UserService from '../../services/UserService'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ExtraForm = ({
  newRole,
  newInstitute,
  newStartYr,
  newEndYr,
  newBio,
  newContactNo,
  setNewInstitute,
  setNewStartYr,
  setNewEndYr,
  setNewBio,
  setNewContactNo
}) => {

    if(newRole==="applicant")
    {   
      return(
        <>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="institute"
            label="College name"
            id="institute"
            value ={newInstitute}
            onChange={e => setNewInstitute(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="startYear"
            label="Start Year"
            id="startYear"
            value ={newStartYr}
            onChange={e => setNewStartYr(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            name="endYear"
            label="End Year"
            id="endYear"
            value ={newEndYr}
            onChange={e => setNewEndYr(e.target.value)}
          />
        </Grid>
      </>);
    }
    
    else if(newRole==="recruiter")
    {
    
      return ( 
        <>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="contactNumber"
              label="Contact number"
              id="contactNumber"
              value ={newContactNo}
              onChange={e => setNewContactNo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              name="bio"
              label="Bio"
              id="bio"
              value ={newBio}
              onChange={e => setNewBio(e.target.value)}
            />
          </Grid>
        </>);
    }  

  return <></>
}

const SignUp = (props) => {

  const [ newName, setNewName ] = useState('')
  const [ newPass, setNewPass ] = useState('')
  const [ newMail, setNewMail ] = useState('')
  const [ newRole, setNewRole ] = useState('')
  const [ newForm, setNewForm ] = useState('')
  const [ newStartYr, setNewStartYr ] = useState('')
  const [ newEndYr, setNewEndYr ] = useState('')
  const [ newContactNo, setNewContactNo ] = useState('')
  const [ newBio, setNewBio ] = useState('')
  const [ newInstitute, setNewInstitute ] = useState('')

  

  const handleSubmit = (event) => {
    event.preventDefault()
    let newUser ={}
    if(newRole==='applicant'){
      newUser = {
        user:{
          name:newName,
          email:newMail,
          password:newPass,
          role:newRole
        },
        education:[{
          name:newInstitute,
          startYear:newStartYr,
          endYear:newEndYr
        }]
      }
    }
    else{ 
      newUser ={
        user:{
          name:newName,
          email:newMail,
          password:newPass,
          role:newRole
        },
        contactNumber:newContactNo,
        bio:newBio 
      }
    }
    UserService.register(newUser)
    .then(r => props.reloadHook())
    .catch(err => console.error(err))

  }
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form}
              onSubmit = {handleSubmit}
        noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                value ={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value ={newMail}
                onChange={e => setNewMail(e.target.value)}
              />
              
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value ={newPass}
                onChange={e => setNewPass(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="role"
                label="Role"
                type="role"
                id="role"
                value={newRole}
                onChange={e => {
                  setNewRole(e.target.value)             
                  }
                }
              select>
              <MenuItem value="applicant">Job Applicant</MenuItem>
              <MenuItem value="recruiter">Job Recruiter</MenuItem>
            </TextField>
            </Grid>
            <ExtraForm
                newRole={newRole}
                newInstitute={newInstitute}
                newStartYr={newStartYr}
                newEndYr={newEndYr}
                newBio={newBio}
                newContactNo={newContactNo}
                setNewInstitute={setNewInstitute}
                setNewStartYr={setNewStartYr}
                setNewEndYr={setNewEndYr}
                setNewBio={setNewBio}
                setNewContactNo={setNewContactNo}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
      </Box>
    </Container>
  );
}

export default SignUp;