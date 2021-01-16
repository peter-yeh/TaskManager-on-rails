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
      originalTasks: [],
      inputSearchValue: '',
    };
  }

  getTasks() {
    axios.get('/api/v1/tasks')
      .then(response => {
        this.setState({ tasks: response.data, originalTasks: response.data })
      })
      .catch(error => console.log(error))
  }

  handleSearchChange = (e) => {
    this.setState({ inputSearchValue: e.target.value });

    if (e.target.value.trim() !== '') {
      const tasks = this.state.originalTasks.filter(task =>
        task.name.includes(e.target.value)
        || this.nullableInclude(task.description, e.target.value)
        || this.nullableInclude(task.due, e.target.value)
        || this.nullableInclude(task.tag, e.target.value)
        || this.nullableInclude(task.done, e.target.value)
        || this.nullableInclude(task.priority, e.target.value))

      this.setState({
        tasks: tasks
      })
    }

    else {
      this.setState({
        tasks: this.state.originalTasks
      })
    }
  }

  // a may be null
  nullableInclude = (a, b) => {
    if (a != null) {
      return a.toString().includes(b);
    } else {
      return false;
    }
  }

  updateTask = (isDone, id) => {
    axios.put(`/api/v1/tasks/${id}`, { task: { done: isDone } })
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

  render() {
    return (
      <div>

        {/* Add a icon for sorting by diff values */}
        <div className='fieldContainer'>
          <TextField className='field'
            label="Find anything in this table..."
            value={this.state.inputSearchValue}
            onChange={this.handleSearchChange}
            variant="outlined"
            fullWidth />
        </div>

        <EnhancedTable
          taskList={this.state.tasks}
          deleteTask={this.deleteTask.bind(this)}
          updateTask={this.updateTask.bind(this)} />

      </div >
    )
  }
}

export default TasksContainer
