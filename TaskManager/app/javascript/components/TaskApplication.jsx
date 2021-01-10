import React, { Component } from 'react';

const sampleJson = {
  "string": "Pluralslgiht",
  "string2": "pluralsight2"
}

class TaskApplication extends Component {
  render() {
    const task = 'Welcome to React';

    return (
      <div>TaskApplication
        <Task task={task} />
      </div>
    );
  }
}

class Task extends Component {
  render() {

    return <h1>{this.props.task}</h1>;
  }
}
export default TaskApplication;
