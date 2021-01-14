import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import { Button, MenuItem, Snackbar, Slide, TextField, useTheme } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import MuiAlert from '@material-ui/lab/Alert'
import { withStyles } from '@material-ui/core/styles';


const priorities = [
  {
    value: '1',
    label: 'Low',
  },
  {
    value: '2',
    label: 'Medium',
  },
  {
    value: '3',
    label: 'High',
  },
];

const dones = [
  {
    value: false,
    label: 'not done',
  },
  {
    value: true,
    label: 'done',
  },
];

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function SlideUp() {
  return <Slide direction='up' />;
}

const useStyles = theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 500
    },
  },
});


class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSnackBar: false,
      inputName: '',
      inputDescription: '',
      inputDue: '',
      inputPriority: 2,
      inputTag: '',
      inputDone: false,
      isTagCorrect: false
    };
  }

  handleNameChange = (e) => {
    this.setState({
      inputName: e.target.value
    });
  }

  handleDescriptionChange = (e) => {
    this.setState({
      inputDescription: e.target.value
    });
  }

  handleDueChange = (e) => {
    this.setState({
      inputDue: e.target.value
    });
  }

  handlePriorityChange = (e) => {
    this.setState({
      inputPriority: e.target.value
    });
  }

  handleTagChange = (e) => {
    this.setState({
      inputTag: e.target.value
    });

    if (e.target.value.match(Regex)) {
      this.setState({ isTagCorrect: true })
    } else {
      this.setState({ isTagCorrect: false })
    }
  }

  handleDoneChange = (e) => {
    this.setState({
      inputDone: e.target.value
    });
  }

  handleClose = () => {
    this.setState({ showSnackBar: false });
  }

  createTask = () => {
    axios.post('/api/v1/tasks', {
      task: {
        name: this.state.inputName,
        description: this.state.inputDescription,
        due: this.state.inputDue,
        priority: this.state.inputPriority,
        tag: this.state.inputTag,
        done: this.state.inputDone
      }
    })
      .then(response => {
        this.setState({
          showSnackBar: true,
          inputName: '',
          inputDescription: '',
          // inputDue: new Date(),
          inputPriority: 2,
          inputTag: '',
          inputDone: false
        })
      })
      .catch(error => console.log(error))

  }

  render() {
    const { classes } = this.props;
    return (
      <div>

        <h1>Add a new Task</h1>

        <form
          className={classes.root}
          noValidate autoComplete="off">

          <TextField
            label="Name"
            value={this.state.inputName}
            onChange={this.handleNameChange}
            error={this.state.inputName.length === 0}
            helperText={this.state.inputName.length === 0 ? 'Name cannot be empty' : ''}
            variant="filled" />

          <TextField
            label="Description"
            value={this.state.inputDescription}
            onChange={this.handleDescriptionChange}
            variant="filled" />
          <TextField
            id="filled-basic-due"
            label="Due date"
            type="datetime-local"
            InputLabelProps={{ shrink: true, }}
            value={this.state.inputDue}
            onChange={this.handleDueChange} />

          <TextField
            select label="Priority"
            value={this.state.inputPriority}
            variant="filled"
            helperText="Please select your priority"
            onChange={this.handlePriorityChange} >
            {priorities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="filled-basic-tag"
            label="Tag"
            value={this.state.inputTag}
            onChange={this.handleTagChange}
            error={this.state.isTagCorrect}
            helperText={this.state.isTagCorrect ? '' : 'Tag should be separated by ; and not space'}
            variant="filled" />

          <TextField
            id="filled-select-done"
            select label="done"
            value={this.state.inputDone}
            variant="filled"
            helperText="Task is done?"
            onChange={this.handleDoneChange}>
            {dones.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

        </form>


        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={this.createTask}
          // check also if the tag is in the right format before enabling the tag
          disabled={this.state.inputName.length === 0 ? true : false} >
          Save
        </Button>

        {/* TODO Snackbar should slide up */}
        <Snackbar
          autoHideDuration={1000}
          open={this.state.showSnackBar}
          onClose={this.handleClose}
        // TransitionComponent={SlideUp}
        >
          <Alert onClose={this.handleClose} severity="success">
            Saved Successfully!
            </Alert>
        </Snackbar>


      </div>
    );
  }
}

export default withStyles(useStyles)(FormContainer)
