import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Complaint from './Complaint';
import ComplaintList from './ComplaintList';
import Dashboard from './Dashboard';
import UserList from './UserList'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/complaint/:userId" element={<Complaint />} />
          <Route path="/complaint-list/:department" element={<ComplaintList />} />
          <Route path="/dashboard/:userId" element={<Dashboard />} />
          <Route path="/UserList/:userId" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;