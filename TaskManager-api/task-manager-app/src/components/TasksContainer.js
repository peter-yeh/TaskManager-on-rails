import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import { TextField } from '@material-ui/core';
import EnhancedTable from './EnhancedTable';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      inputSearchValue: '',
    };
  }

  getTasks() {
    axios.get('/api/v1/tasks')
      .then(response => {
        this.setState({ tasks: response.data })
      })
      .catch(error => console.log(error))
  }

  handleSearchChange = (e) => {
    this.setState({ inputSearchValue: e.target.value });
  }

  updateTask = (isDone, id) => {
    axios.put(`/api/v1/tasks/${id}`, { task: { done: isDone } })
      .then(response => {
        const taskIndex = this.state.tasks.findIndex(x => x.id === response.data.id)
        console.log("The isDone is: " + isDone);
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

  render() {
    return (
      <div>

        {/* Add a icon for sorting by diff values */}
        <TextField className='matList'
          label="Find anything in this table..."
          value={this.state.inputSearchValue}
          onChange={this.handleSearchChange}
          variant="outlined"
          fullWidth />


        <EnhancedTable
          taskList={this.state.tasks}
          deleteTask={this.deleteTask.bind(this)}
          updateTask={this.updateTask.bind(this)} />


        {/* <div className="inputContainer">
          <input className="taskInput" type="text"
            placeholder="Find anything in this table..." maxLength="50"
            onKeyPress={this.createTask}
            value={this.state.inputSearchValue}
            onChange={this.handleSearchChange} />
        </div> */}

        {/* <div className="listWrapper">
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
        </div> */}

      </div >
    )
  }
}


export default TasksContainer