import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../CSS/adminTaskPage.css';

const UserTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Low',
  });
  const navigate = useNavigate();
  
  // Function to decode the token and get user ID
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decodedToken = jwtDecode(token);
    return decodedToken.id; // Assumes user ID is stored in 'user.id'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://task-manager-application-1tfu.onrender.com/api/tasks/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchTasks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleInsertTask = async (e) => {
    e.preventDefault();
    const userId = getUserIdFromToken(); // Get the user ID from the token
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      // Assign task to the logged-in user
      const response = await axios.post(
        'https://task-manager-application-1tfu.onrender.com/api/tasks',
        { ...newTask, assignedUser: userId }, // Set the assignedUser as the logged-in user
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', dueDate: '', status: 'To Do', priority: 'Low' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://task-manager-application-1tfu.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

 

  return (
    <div className="user-container">
      <h2>My Tasks</h2>
      <button className="logout" onClick={handleLogout}>Logout</button>
<div style={{display:"flex",margin:"0% 5%"}}>


      {/* Form to assign a task to self */}
      <form onSubmit={handleInsertTask}>
        <h3>Create a New Task</h3>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Description:</label>
        <textarea
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
          required
        />
        <br />
        <label>Status:</label>
        <select name="status" value={newTask.status} onChange={handleInputChange}>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />
        <label>Priority:</label>
        <select name="priority" value={newTask.priority} onChange={handleInputChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br />
        <button type="submit">Create Task</button>
      </form>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id} className="task-item">
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>

            
              <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-task">No tasks assigned to you.</p>
      )}
    </div>
    </div>
  );
};

export default UserTaskPage;
