const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // Import task routes
const app = express();


app.use(cors()); 
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://dbUser:lA3kRGbRksWSGL1D@cluster0.youkfon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Auth routes
app.use('/api/auth', authRoutes);

// Task routes
app.use('/api/tasks', taskRoutes); // Add task routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
