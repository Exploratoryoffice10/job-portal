import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import dbService from '../../services/dbService'

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [SOP, setSOP] = React.useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleSubmit = () => {
    
    
    let updatedJob =props.job
    updatedJob.applications.push({
      user: props.user._id,
      sop: SOP,
      status:"Applied"
    })
    dbService.submitSOP(updatedJob._id, updatedJob).then(() => {
      alert("Submitted successfully");
      setOpen(false);
    }).catch(error => console.log(error))
  };

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
        {props.button}
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Statement of Purpose
            </Typography>
            <Button autoFocus variant="outlined" color="inherit" onClick={handleSubmit}>
              Submit
            </Button>
          </Toolbar>
         
        </AppBar>
        <DialogTitle id="form-dialog-title">Application for {props.job.title} position</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please submit a State of Purpose, not more than 250 words to let us know why would you like to work with us
          </DialogContentText>
          <TextField
            multiline
            autoFocus
            margin="dense"
            id="sop"
            label="SOP"
            type="textaera"
            value={SOP}
            onChange={e => setSOP(e.target.value)}
            fullWidth
          />
        </DialogContent>
        
      </Dialog>
    </div>
  );
}