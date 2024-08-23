import React, { useState } from 'react';
import Header from '../components/Header';
import RealNameSearch from '../components/RealNameSearch';
import Favorites from '../components/Favorites';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const handleMenuItemClick = (menuItem) => {
    switch (menuItem) {
      case 'iRacing Name Search':
        setActiveComponent('realNameSearch');
        break;
      case 'Favorites':
        setActiveComponent('favorites');
        break;
      default:
        setActiveComponent('dashboard');
    }
  };

  const contentContainerStyle = {
    marginTop: '64px',
    padding: '20px',
    minHeight: 'calc(100vh - 64px)',
    boxSizing: 'border-box',
    backgroundColor: '#000000',
    overflowY: 'auto',
    color: '#FFFFFF', // Changed text color to white for better contrast
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuItemClick={handleMenuItemClick} />
      <div style={contentContainerStyle}>
        {activeComponent === 'dashboard' && (
          <div>
            <h1 style={{ marginTop: 0 }}>Welcome to your Dashboard</h1>
            <p>This is where you can view all your important information and stats.</p>
          </div>
        )}
        {activeComponent === 'realNameSearch' && (
          <div>
            <h2 style={{ marginTop: 0 }}>iRacing Name Search</h2>
            <RealNameSearch />
          </div>
        )}
        {activeComponent === 'favorites' && (
          <div>
            <h2 style={{ marginTop: 0 }}>Favorites</h2>
            <Favorites />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;