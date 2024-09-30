import React, { useState } from 'react';
import axios from 'axios';

const CreateTask = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedUser: '',
    priority: 'Medium',
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get the token from local storage
      await axios.post('http://localhost:5000/api/tasks', taskData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      alert('Task created successfully');
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Task Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Task Description" onChange={handleChange} required />
      <input type="date" name="dueDate" onChange={handleChange} required />
      <input type="text" name="assignedUser" placeholder="Assigned User ID" onChange={handleChange} required />
      <select name="priority" onChange={handleChange} required>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">Create Task</button>
    </form>
  );
};

export default CreateTask;
