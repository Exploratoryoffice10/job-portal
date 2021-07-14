import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dialog from './Apply.js'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import dbService from '../../services/dbService'

const Filter = ({filterByTitle, handleFilterChange, jobs}) => {
    return(
        <div>
        <Autocomplete
            id="combo-box-demo"
            options={jobs}
            getOptionLabel={(option) => option.title}
            style={{ width: 300 }}
            onInputChange={handleFilterChange} 
            renderInput={(params) => <TextField {...params}  label="Select Job" variant="outlined" />}
        />
        </div>
    )
  }

const useStyles = makeStyles((theme) => ({

    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    }

}));
    
const JobsList = (props) => {
    const classes = useStyles();
    const [jobs, setJobs] = useState([])
    const [sortedJobs, setSortedJobs] = useState([])
    const [sortName, setSortName] = useState(true)
    const [filterByTitle, setFilterByTitle] = useState('')

    const loadHook= () => {
        axios.get('/api/jobs')
             .then(response => {
                //  console.log(response);
                setJobs(response.data)
                setSortedJobs(response.data)
             })
             .catch(function(error) {
                 console.log(error);
                //  console.log("errorrrr");
             })
    }
    useEffect(loadHook, [])

    const sortChange = () => {
/**
 *      Note that this is sorting only at front-end.
 */
        let array = jobs;
        let flag = sortName;
        array.sort(function(a, b) {
            if(a.date != undefined && b.date != undefined){
                return (1 - flag*2) * (new Date(a.date) - new Date(b.date));
            }
            else{
                return 1;
            }
          });
        setJobs(array)
        setSortName(!sortName)
    }

    const renderIcon = () =>{
        if(sortName){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    const applyButton = (button, job, user) =>{
        if(sortName){
            return(
                <Dialog button={button} job={job} user={user}/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }


    const handleFilterChange = (event, value) => {
        //setFilterByTitle(event.target.value);
        setFilterByTitle(value)
    }
    
    
    return (
        <div>
            <div className={classes.heroContent}>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    Job Listings
                </Typography>
            </Container>
            </div>
            <Grid container>
            <Grid item xs={12} md={3} lg={3}>
                <List component="nav" aria-label="mailbox folders">
                    <ListItem >
                                    <h3>Filters</h3>
                    </ListItem>
                </List>
            </Grid>
            
            </Grid>
            <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">

                        <ListItem button>
                            <form noValidate autoComplete="off">
                                <label>Salary</label>
                                <TextField id="MinSalary" label="Enter Min" fullWidth={true} />
                                <TextField id="MaxSalary" label="Enter Max" fullWidth={true}/>
                            </form>                                                                
                        </ListItem>
                        <Divider />
                        <ListItem button divider>
                        <Filter filterByTitle={filterByTitle} handleFilterChange={handleFilterChange} jobs ={jobs} />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={9} lg={9}>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell> <Button onClick={sortChange}>{renderIcon()}</Button>Deadline</TableCell>
                                        <TableCell>Recruiter</TableCell>
                                        <TableCell>Salary</TableCell>
                                        <TableCell>Rating</TableCell>
                                        <TableCell>Duration</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                jobs.filter( (job) => job.title.toLowerCase().includes(filterByTitle.toLowerCase())
                                ).map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>{new Date(job.deadline).toLocaleString()}</TableCell>
                                        <TableCell>{job.recruiter.name}</TableCell>
                                        <TableCell>{job.salary}</TableCell>
                                        <TableCell>{job.rating}</TableCell>
                                        <TableCell>{job.duration} months</TableCell>
                                        <TableCell>{applyButton("Apply",job,props.user.user)}</TableCell>
                                    </TableRow>
                            ))
                            }
                            </TableBody>
                        </Table>
                    </Paper>               
                </Grid>    
            </Grid>            
        </div>
    )
}


export default JobsList;
