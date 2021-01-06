
var TaskApplication = React.createClass({
  getInitialState: function() {
    return { tasks: [] };
  },
  componentDidMount: function() {
    this.getDataFromApi();
  },
  getDataFromApi: function() {
    var self = this;
    $.ajax({
      url: '/api/tasks',
      success: function(data) {
        self.setState({ tasks: data });
      },
      error: function(xhr, status, error) {
        alert('Cannot get data from API: ', error);
      }
    });
  },
  render: function() {
    return(
      <div className="container">
        <div className="jumbotron">
          <h1>ReactJS Tutorial</h1>
          <p>by Piotr Jaworski</p>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TaskTable tasks={this.state.tasks} />
          </div>
        </div>
      </div>
    )
  }
});