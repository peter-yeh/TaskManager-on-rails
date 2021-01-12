import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

// Material UI
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class TasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      inputValue: '',
      doneValue: false,
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
    this.setState({ inputValue: e.target.value, doneValue: e.target.selected });
  }

  createTask = (e) => {
    if (e.key === 'Enter') {
      axios.post('/api/v1/tasks', { task: { name: e.target.value, done: e.target.selected } })
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
        {this.state.showFormComponent ?
          <FormComponent />
          : <div>
            {/* <div className="inputContainer">
          <input className="taskInput" type="text"
          placeholder="Add a task" maxLength="50"
          onKeyPress={this.createTask}
          value={this.state.inputValue}
          onChange={this.handleChange} />
        </div> */}

            <form onSubmit={this.createTask}>
              <input className="taskInput" type="text"
                placeholder="Add a task" maxLength="50"
                // onKeyPress={this.createTask}
                value={this.state.inputValue}
                onChange={this.handleChange} />

              <label>
                <select value={this.state.doneValuevalue}
                  onChange={this.handleChange}>
                  <option selected value="not done">Not Done</option>
                  <option value="done">Done</option>
                </select>

                <select>
                  <option value="1">Low</option>
                  <option selected value="2">Medium</option>
                  <option value="3">High</option>
                </select>
              </label>
            </form>



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
            <AddIcon />
          </Fab>
        </div>

      </div >


    )
  }
}

class FormComponent extends Component {

  render() {
    return (
      <div>
        <Button variant="contained" color="primary">Hello World</Button>
      </div>
    );
  }
}

export default TasksContainer
