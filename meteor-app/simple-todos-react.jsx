// Define a collection to hold our tasks
_g.Collections.Tasks = new Mongo.Collection('tasks')

if (Meteor.isClient) {
  // This code is executed on the client only
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY'
  })

  Meteor.subscribe('tasks')

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<_g.Components.App />, document.getElementById('render-target'))
  })
}

if (Meteor.isServer) {
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('tasks', function () {
    return _g.Collections.Tasks.find({
      $or: [
        { private: { $ne: true } },
        { owner: this.userId }
      ]
    })
  })
}

Meteor.methods({
  addTask (text) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    _g.Collections.Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    })
  },

  removeTask (taskId) {
    const task = _g.Collections.Tasks.findOne(taskId)
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized')
    }

    _g.Collections.Tasks.remove(taskId)
  },

  setChecked (taskId, setChecked) {
    const task = _g.Collections.Tasks.findOne(taskId)
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized')
    }

    _g.Collections.Tasks.update(taskId, { $set: { checked: setChecked } })
  },

  setPrivate (taskId, setToPrivate) {
    const task = _g.Collections.Tasks.findOne(taskId)

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized')
    }

    _g.Collections.Tasks.update(taskId, { $set: { private: setToPrivate } })
  }
})
