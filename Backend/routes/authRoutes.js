const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/auth');
const Task = require('../models/Task');


// Register route
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      email,
      password: hashedPassword, 
      role, 
    });

    await user.save();

    const payload = {
      id: user._id,
      role: user.role, 
    };

    const token = jwt.sign(payload, 'Secret', { expiresIn: '1h' });

    // Send back the token and role
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log("login");
  const { email, password } = req.body;

  try {
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    bcrypt.compare(password, user.password, function(err, result) {
      if(result==false) return res.status(400).json({ msg: 'Invalid credentials' });
  });
  

    const payload = {
      id: user._id,
      role: user.role, 
    };

    const token = jwt.sign(payload,'Secret', { expiresIn: '1h' });

    // Send back the token and role
    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get all users (Admin only)
router.get('/allusers', verifyToken, checkRole(['admin']), async (req, res) => {
  console.log('Fetching users...');
  try {
    const users = await User.find(); 
// return console.log('Users fetched:', users);
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ msg: 'Server error while fetching users' });
  }
});

// get report
router.get('/tasks/report', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedUser', 'email'); 
    const headers = ['Title', 'Description', 'Due Date', 'Status', 'Priority', 'Assigned User'];
    
   
    let csvData = tasks.map(task => [
      task.title,
      task.description,
      new Date(task.dueDate).toLocaleDateString(),
      task.status,
      task.priority,
      task.assignedUser?.email || 'Unassigned'
    ]);
    
    csvData.unshift(headers); 
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment;filename=tasks_report.csv');
    res.send(csvString);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
});
module.exports = router;
