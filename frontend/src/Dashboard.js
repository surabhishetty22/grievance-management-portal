import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const userId = window.location.pathname.split('/').pop();

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <p className="user-greeting">Hello User!</p>
        <Link to={`/complaint/${userId}`}>
          <button>Raise Complaint</button>
        </Link>
        <Link to={`/userlist/${userId}`}>
          <button>View Complaint</button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
