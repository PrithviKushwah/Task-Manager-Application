import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Routes } from 'react-router-dom';
import Register from './components/Registeration';
import Login from './components/Login';
import AdminTaskPage from './components/AdminTaskPage';
import UserTaskPage from './components/UserTaskPage';
import UpdateTaskPage from './components/UpdateTaskPage';

function App() {
  return (
    <>


        <Routes>
        <Route  path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/admin/tasks" element={<AdminTaskPage />} />
        <Route path="/user/tasks" element={<UserTaskPage />} />
        <Route path="/admin/tasks/update/:id" element={<UpdateTaskPage />} />
        </Routes>
    </>
      
    
  );
}

export default App;
