import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminTaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'To Do',
    priority: 'Low',
    assignedUser: '',
  });
  const [users, setUsers] = useState([]); // Store the list of users for assigning tasks
  const navigate = useNavigate();

  useEffect(() => {
    
    if(!localStorage.getItem('token')){
        navigate('/');
    }
    const fetchTasks = async () => {
      try {
        const response = await axios.get('https://task-manager-application-1tfu.onrender.com/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const userResponse = await axios.get('https://task-manager-application-1tfu.onrender.com/api/auth/allusers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(userResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
    fetchUsers();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`https://task-manager-application-1tfu.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get('https://task-manager-application-1tfu.onrender.com/api/auth/tasks/report', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks_report.csv'); 
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('Error downloading report:', err);
    }
  };

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
    try {
      const response = await axios.post('https://task-manager-application-1tfu.onrender.com/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks([...tasks, response.data]); 
      setNewTask({ title: '', description: '', dueDate: '', status: 'To Do', priority: 'Low', assignedUser: '' }); // Reset form
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <h2>All Tasks (Admin View)</h2>
      <button className="logout" onClick={handleLogout}>Logout</button>

      {/* Download Report Button */}
      <button className="download-report" onClick={handleDownloadReport}>Download Report</button>
<div className='main'>
      {/* Insert Task Form */}
      <form style={{ maxWidth: "max-content", padding: "5%" }} onSubmit={handleInsertTask}>

        <h3>Insert New Task</h3>
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
        <select
          name="status"
          value={newTask.status}
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
          value={newTask.priority}
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
          value={newTask.assignedUser}
          onChange={handleInputChange}
          required
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.email}
            </option>
          ))}
        </select>
        <br />

        <button style={{width:"80%"}} type="submit">Insert Task</button>
      </form>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <p>Assigned User: {task.assignedUser?.email}</p>
            <button onClick={() => handleDelete(task._id)}>Delete</button>
            <Link to={`/admin/tasks/update/${task._id}`}>
              <button>Update</button>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default AdminTaskPage;
