import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

class TasksContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      inputValue: ''
    }
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

  render() {
    return (
      <div>


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


      </div>
    )
  }
}

export default TasksContainer
