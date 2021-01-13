import React, { Component } from 'react';
import './App.css';
import TasksContainer from './components/TasksContainer'
import FormContainer from './components/FormContainer'

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DoneIcon from '@material-ui/icons/Done'

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

        <Fab color="primary"
          aria-label="add"
          onClick={this.onFabClick}
          sytle={{ bottom: 1, right: 1 }}>

          {
            this.state.showFormComponent
              ? <DoneIcon />
              : <AddIcon />
          }
        </Fab>

      </div>
    );
  }
}

export default App;
