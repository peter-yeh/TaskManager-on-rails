
var Event = React.createClass({
    propTypes: {
      name: React.PropTypes.string,
      task_date: React.PropTypes.string,
      place: React.PropTypes.string,
      description: React.PropTypes.string
    },
    render: function() {
      var task = this.props.task;
      return(
        <tr>
          <td>{task.name}</td>
          <td>{task.task_date}</td>
          <td>{task.place}</td>
          <td>{task.description}</td>
        </tr>
      )
    }
  });
