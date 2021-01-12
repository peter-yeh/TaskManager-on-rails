import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

// Material UI
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done'

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';



// import { AddIcon } from '@material-ui/icons/Add';
// import { Button, Fab, TextField, MenuItem } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles'
// import { DateTimePicker, KeyboardDateTimePicker } from "@material-ui/pickers";



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

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      inputValue: '',
      showFormComponent: false
    };
    this.onFabClick = this.onFabClick.bind(this);

  }

  getTasks() {
    axios.get('/api/v1/tasks')
      .then(response => {
        this.setState({ tasks: response.data })
      })
      .catch(error => console.log(error))
  }

  handleChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  createTask = (e) => {
    if (e.key === 'Enter') {
      axios.post('/api/v1/tasks', { task: { name: e.target.value } })
        .then(response => {
          const tasks = update(this.state.tasks, {
            $splice: [[0, 0, response.data]]
          })
          this.setState({
            tasks: tasks,
            inputValue: ''
          })
        })
        .catch(error => console.log(error))
    }
  }

  updateTask = (e, id) => {
    axios.put(`/api/v1/tasks/${id}`, { task: { done: e.target.checked } })
      .then(response => {
        const taskIndex = this.state.tasks.findIndex(x => x.id === response.data.id)
        const tasks = update(this.state.tasks, {
          [taskIndex]: { $set: response.data }
        })
        this.setState({
          tasks: tasks
        })
      })
      .catch(error => console.log(error))
  }

  deleteTask = (id) => {
    axios.delete(`/api/v1/tasks/${id}`)
      .then(response => {
        const taskIndex = this.state.tasks.findIndex(x => x.id === id)
        const tasks = update(this.state.tasks, {
          $splice: [[taskIndex, 1]]
        })
        this.setState({
          tasks: tasks
        })
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTasks()
  }

  onFabClick() {
    if (this.state.showFormComponent) {
      this.setState({ showFormComponent: false, });
    } else {
      this.setState({ showFormComponent: true, });
    }
  }

  render() {
    return (
      <div>
        {this.state.showFormComponent
          ? <FormComponent />
          : <div>

            <div className="inputContainer">
              <input className="taskInput" type="text"
                placeholder="Add a task" maxLength="50"
                onKeyPress={this.createTask}
                value={this.state.inputValue}
                onChange={this.handleChange} />
            </div>

            <div className="listWrapper">
              <ul className="taskList">
                {this.state.tasks.map((task) => {
                  return (
                    <li className="task" task={task} key={task.id}>
                      <input className="taskCheckbox"
                        type="checkbox"
                        checked={task.done}
                        onChange={(e) => this.updateTask(e, task.id)} />

                      <label className="taskLabel">{task.name}</label>

                      <span className="deleteTaskBtn" onClick={(e) => this.deleteTask(task.id)}>x</span>

                    </li>
                  )
                })}
              </ul>
            </div>
          </div>}


        <div>
          <Fab color="primary"
            aria-label="add"
            onClick={this.onFabClick}
            sytle={{ bottom: 1, right: 3 }}>
            {this.state.showFormComponent ?
              <DoneIcon /> : <AddIcon />}

          </Fab>
        </div>

      </div >


    )
  }
}

class FormComponent extends Component {

  render() {
    return (
      <div makeStyles>

        <h1>Add a new Task</h1>

        <form noValidate autoComplete="off">
          <TextField id="filled-basic-name" label="Name" variant="filled" fullWidth />

          <TextField id="filled-basic-description" label="Description" variant="filled" fullWidth />

          <TextField id="filled-basic-tag" label="Tag" variant="filled" fullWidth />

          <TextField id="filled-select-priority" select label="Priority" value={2} variant="filled" helperText="Please select your priority"
            onChange={this.handleChange}          >
            {/* {priorities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
              {option.label}
              </MenuItem>
            ))} */}

            <MenuItem value="1">Name1</MenuItem>
            <MenuItem value="2">Name2</MenuItem>
            <MenuItem value="3">Name3</MenuItem>
          </TextField>

          <TextField id="filled-select-done" select label="done" value={false} variant="filled" helperText="Task is done?"
            onChange={this.handleChange}>
            {dones.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
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

      </div>
    );
  }
}

export default TasksContainer