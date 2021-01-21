import React, { Component } from 'react';
import './App.css';
import TasksContainer from './components/TasksContainer';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: green[500],
    },
    background: {
      default: purple[500],
    },
  },
  overrides: {
    MuiInputBase: {
      input: {
        background: "#fff",
        borderRadius: "5px"
      },
    },
  },
});

class App extends Component {
  constructor(props: string) {
    super(props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="container">
          <div className="header">
            <h1>Tasks Manager</h1>
          </div>
          <TasksContainer />

        </div>
      </ThemeProvider>
    );
  }
}

export default App;
