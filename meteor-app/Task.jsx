// _g.Components.Task component - represents a single todo item
_g.Components.Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired
  },

  getInitialState () {
    return {
      renderedMarkdown: ''
    }
  },

  toggleChecked () {
    // Set the checked property to the opposite of its current value
    Meteor.call('setChecked', this.props.task._id, !this.props.task.checked)
  },

  deleteThisTask () {
    Meteor.call('removeTask', this.props.task._id)
  },

  togglePrivate () {
    Meteor.call('setPrivate', this.props.task._id, !this.props.task.private)
  },

  addClassName (propsAndCssValueList) {
    var cssList = []
    propsAndCssValueList.forEach(function (item) {
      var property = item[0]
      var cssValue = item[1]

      if (property) {
        cssList.push(cssValue)
      }
    })

    return cssList.join(' ')
  },

  componentDidMount () {
    this.renderMarkDown(this.props.task.text)
  },

  render () {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add 'checked' and/or 'private' to the className when needed
    const taskClassName = this.addClassName([
      [this.props.task.checked, 'checked'],
      [this.props.task.private, 'private']
    ])

    return (
      <li className={taskClassName}>
        <button className='delete' onClick={this.deleteThisTask}>
          x
        </button>

        <input
          type='checkbox'
          readOnly
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />

        { this.props.showPrivateButton ? (
          <button className='toggle-private' onClick={this.togglePrivate}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className='text'>
          <strong>{this.props.task.username}</strong>:
          <div dangerouslySetInnerHTML={ {__html: this.props.task.text} } />
        </span>
      </li>
    )
  }
})
