import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import TextField from '@material-ui/core/TextField';
// import MenuItem from '@material-ui/core/MenuItem';
// import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
// import Snackbar from '@material-ui/core/Snackbar';
import { Button, Snackbar, Slide } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const priorities = [
  {
    value: '1',
    label: 'LOW',
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

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      inputName: ''
    };
  }

  handleChange = (e) => {
    this.setState({ inputName: e.target.value });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  createTask = () => {
    axios.post('/api/v1/tasks', { task: { name: this.state.inputName } })
      .then(response => {
        this.setState({
          isOpen: true,
          inputName: ''
        })
        console.log("Creating tasks succeed")
      })
      .catch(error => console.log(error))

  }

  render() {
    return (
      <div>

        <h1>Add a new Task</h1>

        <form noValidate autoComplete="off">
          <TextField
            id="filled-basic-name"
            label="Name"
            value={this.state.inputName}
            onChange={this.handleChange}
            variant="filled" fullWidth />

          {/* <TextField id="filled-basic-description" label="Description" variant="filled" fullWidth />
  
            <TextField id="filled-basic-tag" label="Tag" variant="filled" fullWidth /> */}

          {/* <TextField id="filled-select-priority" select label="Priority" value={2} variant="filled" helperText="Please select your priority"
              onChange={this.handleChange}          >
               {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                {option.label}
                </MenuItem>
              ))}
            </TextField> */}

          {/* <TextField id="filled-select-done" select label="done" value={false} variant="filled" helperText="Task is done?"
              onChange={this.handleChange}>
              {dones.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField> */}
        </form>

        {/* <DateTimePicker
            variant="inline"
            label="Basic example"
          // value={selectedDate}
          // onChange={handleDateChange}
          /> */}

        {/* <KeyboardDateTimePicker
            variant="inline"
            ampm={false}
            label="With keyboard"
            // value={selectedDate}
            // onChange={handleDateChange}
            onError={console.log}
            disablePast
            format="yyyy/MM/dd HH:mm"
          /> */}


        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={this.createTask} >
          Save
        </Button>



        {/* Snackbar should slide up and the words inside shoudl align center */}
        <Snackbar
          className="successSnackbar"
          autoHideDuration={1000}
          open={this.state.isOpen}
          onClose={this.handleClose}
        // TransitionComponent={() => () => <Slide direction="up"  />}
        >
          <Alert onClose={this.handleClose} severity="success">
            Saved Successfully!
            </Alert>
        </Snackbar>


      </div>
    );
  }
}

export default FormContainer
