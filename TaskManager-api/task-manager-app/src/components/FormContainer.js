import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import { Button, MenuItem, Snackbar, Slide, TextField, useTheme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save'
import MuiAlert from '@material-ui/lab/Alert';

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

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
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

    if (e.target.value.match(phoneRegex)) {
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
    this.setState({ isOpen: false });
  }

  createTask = () => {
    axios.post('/api/v1/tasks', {
      task: {
        name: this.state.inputName,
        description: this.state.inputDescription,
        // due: this.state.inputDue,
        priority: this.state.inputPriority,
        tag: this.state.inputTag,
        done: this.state.inputDone
      }
    })
      .then(response => {
        this.setState({
          isOpen: true,
          inputName: '',
          inputDescription: '',
          inputDue: '',
          inputPriority: 2,
          inputTag: '',
          inputDone: false
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
            className='matList'
            id="filled-basic-name"
            label="Name"
            value={this.state.inputName}
            onChange={this.handleNameChange}
            error={this.state.inputName.length === 0 ? 'Name cannot be empty' : ''}
            variant="filled" fullWidth />

          <TextField
            className='matList'
            id="filled-basic-description"
            label="Description"
            value={this.state.inputDescription}
            onChange={this.handleDescriptionChange}
            variant="filled" fullWidth />

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

          <TextField
            className='matList'
            id="filled-select-priority"
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
            className='matList'
            id="filled-basic-tag"
            label="Tag"
            value={this.state.inputTag}
            onChange={this.handleTagChange}
            errorText={this.state.isTagCorrect ? '' : 'Tag should be separated by ; and not space'}
            variant="filled" fullWidth />

          <TextField
            className='matList'
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


        {/* if the compuslory things are not filled up, dont' proceed */}
        <Button
          className='matList'
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={this.createTask}
          disabled={this.state.inputName.length === 0 ? true : false} >
          Save
        </Button>

        {/* TODO Snackbar should slide up */}
        <Snackbar
          autoHideDuration={1000}
          open={this.state.isOpen}
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

export default FormContainer
