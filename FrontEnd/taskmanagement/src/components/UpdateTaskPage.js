import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../CSS/adminTaskPage.css';

const UpdateTaskPage = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Low',
    assignedUser: '',
  });
  const [users, setUsers] = useState([]); // Store the list of users for assigning tasks
  const navigate = useNavigate();

  // Fetch the task and list of users when the page loads
  useEffect(() => {
    if(!localStorage.getItem('token')){
      navigate('/');
  }
    const fetchTaskAndUsers = async () => {
      try {
        // Fetch task details
        const taskResponse = await axios.get(`https://task-manager-application-1tfu.onrender.com/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTask(taskResponse.data);

        // Fetch users for the assigned user dropdown
        const userResponse = await axios.get('https://task-manager-application-1tfu.onrender.com/api/auth/allusers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(userResponse.data);
      } catch (err) {
        console.error(err);
        // Optionally redirect to an error page or show an error message
      }
    };
    fetchTaskAndUsers();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://task-manager-application-1tfu.onrender.com/api/tasks/${id}`, task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      navigate('/admin/tasks'); // Redirect to the task list after successful update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{width:"50%",marginInline:"auto"}}>
    <Link to={'../admin/tasks'}><button className='backButton'>Back</button></Link> 

      <h2>Update Task</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>Description:</label>
        <textarea
          name="description"
          value={task.description}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>Due Date:</label>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>Status:</label>
        <select
          name="status"
          value={task.status}
          onChange={handleInputChange}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <br />

        <label>Priority:</label>
        <select
          name="priority"
          value={task.priority}
          onChange={handleInputChange}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <br />

        <label>Assigned User:</label>
        <select
          name="assignedUser"
          value={task.assignedUser}
          onChange={handleInputChange}
        >
          <option value="">Select User</option>
          {users.length > 0 ? (
            users.map(user => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))
          ) : (
            <option value="">No users available</option>
          )}
        </select>
        <br />

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default UpdateTaskPage;
