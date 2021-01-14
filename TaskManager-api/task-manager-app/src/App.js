import React, { Component } from 'react';
import './App.css';
import TasksContainer from './components/TasksContainer'
import FormContainer from './components/FormContainer'

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showFormComponent: false
    };
    this.onFabClick = this.onFabClick.bind(this);
  }

  onFabClick() {
    if (this.state.showFormComponent) {
      this.setState({ showFormComponent: false, });
      console.log("The value has been brought from child: " + this.state.inputValue);
    } else {
      this.setState({ showFormComponent: true, });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="header">
          <h1>TaskManager</h1>
        </div>

        {
          this.state.showFormComponent
            ? <FormContainer />
            : <TasksContainer />
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

      </div>
    );
  }
}

export default App;
