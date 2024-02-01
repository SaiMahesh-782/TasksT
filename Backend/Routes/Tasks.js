const express = require('express');
const router = express.Router();
const loginUser = require('../middleware/loginUser');
const Task = require('../models/Tasks');
const User=require('../Models/User')// Adjust the path based on your project structure



router.get('/getTasks', loginUser, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tasks = await Task.find({ assignedto: user.name }).populate('assignee', 'name').lean();
    
    // Now, tasks will have the `assignee` field populated with user names
    res.json(tasks);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


// Add Task
router.post('/addTask', loginUser, async (req, res) => {
  try {
    const { title, description, assignedto, deadline } = req.body;
    const assignee = req.user.userId;

    const task = new Task({
      title,
      description,
      assignedto,
      assignee,
      deadline,
    });

    const savedTask = await task.save();
    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update Task
// server.js
// Update Task
router.post('/updateTask/:taskId', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      { $set: req.body }, // Update task fields based on the request body
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete Task
router.delete('/deleteTask/:taskId', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
