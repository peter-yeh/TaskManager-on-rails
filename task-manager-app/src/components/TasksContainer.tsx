import React, { Component } from 'react'
import axios from 'axios'
import update from 'immutability-helper'

import { TextField } from '@material-ui/core';
import EnhancedTable from './EnhancedTable';
import FormContainer from './FormContainer';
import { ITask } from './ITask';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


type MyProps = {
};
type MyState = {
  tasks: Array<ITask>,
  originalTasks: Array<ITask>,
  inputSearchValue: string,
  editTask?: ITask,
  showFormComponent: boolean,
}
class TasksContainer extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tasks: [],
      originalTasks: [],
      inputSearchValue: '',
      editTask: undefined,
      showFormComponent: false,
    };
    this.onFabClick = this.onFabClick.bind(this);
  }

  getTasks() {
    axios.get('/api/v1/tasks')
      .then(response => {
        this.setState({ tasks: response.data, originalTasks: response.data })
      })
      .catch(error => console.log(error))
  }

  handleSearchChange = (e: React.ChangeEvent<any>) => {
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

  nullableInclude = (nullableA: any, b: string) => {
    if (nullableA != null) {
      return nullableA.toString().includes(b);
    } else {
      return false;
    }
  }

  updateTask = (isDone: boolean, id: number) => {
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

  updateTaskList = () => {
    // Calls axiox to update the tasks in this component, since it's updated in Form
    this.getTasks();
  }

  deleteTask = (id: number) => {
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

  editTask = (id: number) => {
    const taskIndex = this.state.tasks.findIndex(x => x.id === id)
    const task = this.state.originalTasks[taskIndex];
    this.setState({
      editTask: task,
      showFormComponent: true
    })
  }

  componentDidMount() {
    this.getTasks()
  }

  onFabClick() {
    this.setState({ showFormComponent: !this.state.showFormComponent, editTask: undefined });
  }

  render() {
    return (
      <div>
        {this.state.showFormComponent
          ? <FormContainer
            task={this.state.editTask}
            updateTaskList={this.updateTaskList.bind(this)} />
          :
          <div>
            <div className='fieldContainer'>
              <TextField
                label="Find anything in this table..."
                value={this.state.inputSearchValue}
                onChange={this.handleSearchChange}
                variant="outlined"
                fullWidth />
            </div>

              <EnhancedTable
                taskList={this.state.tasks}
                deleteTask={this.deleteTask.bind(this)}
                updateTask={this.updateTask.bind(this)}
                editTask={this.editTask.bind(this)} />
          </div>
        }

        <Fab
          color="primary"
          aria-label="add"
          onClick={this.onFabClick}
          style={{ position: 'fixed', bottom: 20, right: 20 }} >
          {
            this.state.showFormComponent
              ? <ArrowBackIcon />
              : <AddIcon />
          }
        </Fab>

      </div >
    )
  }
}

export default TasksContainer
