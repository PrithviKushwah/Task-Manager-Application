const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const router = express.Router();

// Create a new task (Admin only)
router.post('/', verifyToken, async (req, res) => {
  const { title, description, dueDate, status, assignedUser, priority } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      status,
      assignedUser,
      priority,
    });

    const task = await newTask.save();
    res.status(201).json(task); // Return the created task with a 201 status
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ msg: 'Server error while creating task' });
  }
});

// Get all tasks (Admin only)
router.get('/', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'email'); // Populate assigned user
    res.json(tasks); // Return all tasks
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ msg: 'Server error while fetching tasks' });
  }
});

// Get tasks assigned to the logged-in user (User only)
router.get('/me', verifyToken, checkRole(['user']), async (req, res) => {
  try {
    const tasks = await Task.find({ assignedUser: req.user.id }).populate('assignedUser', 'email');
    res.json(tasks); // Return tasks assigned to the user
  } catch (err) {
    console.error('Error fetching user tasks:', err);
    res.status(500).json({ msg: 'Server error while fetching user tasks' });
  }
});

// Get a single task by ID (Admin only)
router.get('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedUser', 'email'); // Populate assigned user

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' }); // Return 404 if task not found
    }

    res.json(task); // Return the task
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ msg: 'Server error while fetching task' });
  }
});

// Update a task (Admin only)
router.put('/:id', verifyToken, checkRole(['admin']), async (req, res) => {
  const { title, description, dueDate, status, assignedUser, priority } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, {
      title,
      description,
      dueDate,
      status,
      assignedUser,
      priority,
    }, { new: true, runValidators: true }); // Ensure validators run on update

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' }); // Return 404 if task not found
    }

    res.json(task); // Return the updated task
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ msg: 'Server error while updating task' });
  }
});

// Delete a task (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: 'Task not found' }); // Return 404 if task not found
    }

    res.json({ msg: 'Task deleted successfully' }); // Confirmation message for deletion
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ msg: 'Server error while deleting task' });
  }
});



module.exports = router;
