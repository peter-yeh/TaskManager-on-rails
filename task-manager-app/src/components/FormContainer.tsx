import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'

import { Button, MenuItem, Snackbar, TextField } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import { ITask } from './ITask'


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

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const getCurrDateInLocale = () => moment().format("YYYY-MM-DDTkk:mm");

const convertToUtc = (date: string) => moment(date).utc().format("YYYY-MM-DDTkk:mm");

const convertToLocale = (date: string) => moment(date).format("YYYY-MM-DDTkk:mm");

type MyProps = {
  task?: ITask,
  updateTaskList: Function
};
type MyState = {
  id: number,
  showSnackBar: boolean,
  inputName: string,
  inputDescription: string,
  inputDue: string,
  inputPriority: number,
  inputTag: string,
  inputDone: boolean,
};
class FormContainer extends Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);
    this.state = props.task !== undefined ? {
      showSnackBar: false,
      id: props.task.id,
      inputName: props.task.name,
      inputDescription: props.task.description,
      inputDue: convertToLocale(props.task.due),
      inputPriority: props.task.priority,
      inputTag: props.task.tag,
      inputDone: props.task.done
    } : {
        showSnackBar: false,
        id: -1,
        inputName: '',
        inputDescription: '',
        inputDue: getCurrDateInLocale(),
        inputPriority: 2,
        inputTag: '',
        inputDone: false,
      };
  }

  handleNameChange = (e: React.ChangeEvent<any>) => {
    this.setState({
      inputName: e.target.value
    });
  }

  handleDescriptionChange = (e: React.ChangeEvent<any>) => {
    this.setState({
      inputDescription: e.target.value
    });
  }

  handleDueChange = (e: React.ChangeEvent<any>) => {
    this.setState({
      inputDue: e.target.value
    });
  }

  handlePriorityChange = (e: React.ChangeEvent<any>) => {
    this.setState({
      inputPriority: e.target.value
    });
  }

  handleTagChange = (e: React.ChangeEvent<any>) => {
    this.setState({
      inputTag: e.target.value
    });
  }

  handleDoneChange = (e: React.ChangeEvent<any>) => {
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
        due: convertToUtc(this.state.inputDue),
        priority: this.state.inputPriority,
        tag: this.state.inputTag,
        done: this.state.inputDone
      }
    })
      .then(response => {
        console.log("The due is: " + this.state.inputDue);
        this.setState({
          showSnackBar: true,
          inputName: '',
          inputDescription: '',
          inputDue: getCurrDateInLocale(),
          inputPriority: 2,
          inputTag: '',
          inputDone: false
        })
        this.props.updateTaskList();
      })
      .catch(error => console.log(error))

  }

  updateTask = () => {
    axios.put(`/api/v1/tasks/${this.state.id}`, {
      task: {
        name: this.state.inputName,
        description: this.state.inputDescription,
        due: convertToUtc(this.state.inputDue),
        priority: this.state.inputPriority,
        tag: this.state.inputTag,
        done: this.state.inputDone
      }
    })
      .then(response => {
        this.setState({
          id: -1,
          showSnackBar: true,
          inputName: '',
          inputDescription: '',
          inputDue: getCurrDateInLocale(),
          inputPriority: 2,
          inputTag: '',
          inputDone: false
        })
        this.props.updateTaskList();
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <div>

        <div className="header">
          {this.props.task !== undefined
            ? <h1>Edit Task</h1>
            : <h1>Add a new Task</h1>
          }
        </div>

        <form
          noValidate autoComplete="off">

          <div className='fieldContainer'>
            <TextField
              className='field'
              label="Name"
              value={this.state.inputName}
              onChange={this.handleNameChange}
              error={this.state.inputName.length === 0}
              helperText={this.state.inputName.length === 0 ? 'Name cannot be empty' : ''}
              variant="filled" />
          </div>

          <div className='fieldContainer'>
            <TextField
              className='field'
              label="Description"
              value={this.state.inputDescription}
              onChange={this.handleDescriptionChange}
              variant="filled" />
          </div>

          <div className='fieldContainer'>
            <TextField
              className='field'
              id="filled-basic-due"
              label="Due date"
              type="datetime-local"
              InputLabelProps={{ shrink: true, }}
              value={this.state.inputDue}
              onChange={this.handleDueChange} />
          </div>

          <div className='fieldContainer'>
            <TextField
              className='field'
              select label="Priority"
              value={this.state.inputPriority}
              variant="filled"
              onChange={this.handlePriorityChange} >
              {priorities.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className='fieldContainer'>
            <TextField
              className='field'
              id="filled-basic-tag"
              label="Tag"
              value={this.state.inputTag}
              onChange={this.handleTagChange}
              variant="filled" />
          </div>

          <div className='fieldContainer'>
            <TextField
              className='field'
              select label="done"
              value={+!!this.state.inputDone}
              variant="filled"
              onChange={this.handleDoneChange}>
              {dones.map((option) => (
                <MenuItem key={+!!option.value} value={+!!option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </form>

        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={this.state.id < 0
            ? this.createTask
            : this.updateTask}
          disabled={this.state.inputName.length === 0 ? true : false} >
          Save
        </Button>

        {/* TODO Snackbar should slide up */}
        <Snackbar
          autoHideDuration={1000}
          open={this.state.showSnackBar}
          onClose={this.handleClose}
        // TransitionComponent={() => <Slide  direction='up' />}
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
