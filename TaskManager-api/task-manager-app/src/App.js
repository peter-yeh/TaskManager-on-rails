import React, { Component } from 'react';
import './App.css';
import TasksContainer from './components/TasksContainer'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="header">
          <h1>Task List</h1>
        </div>
        <TasksContainer />
      </div>
    );
  }
}

export default App;
