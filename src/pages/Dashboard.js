import React from 'react';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <div>
      <Header />
      <div style={{ paddingTop: '64px', padding: '20px' }}>
        {/* Content of your Dashboard will go here */}
        <h1>Welcome to your Dashboard</h1>
      </div>
    </div>
  );
};

export default Dashboard;
