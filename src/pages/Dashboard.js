import React, { useState } from 'react';
import Header from '../components/Header';
import RealNameSearch from '../components/RealNameSearch';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const handleMenuItemClick = (menuItem) => {
    if (menuItem === 'iRacing Name Search') {
      setActiveComponent('realNameSearch');
    } else {
      setActiveComponent('dashboard');
    }
  };

  return (
    <div>
      <Header onMenuItemClick={handleMenuItemClick} />
      <div style={{ paddingTop: '64px', padding: '20px' }}>
        {activeComponent === 'dashboard' && (
          <h1>Welcome to your Dashboard</h1>
        )}
        {activeComponent === 'realNameSearch' && (
          <RealNameSearch />
        )}
      </div>
    </div>
  );
};

export default Dashboard;