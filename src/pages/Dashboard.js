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

  // Define the styles for the content container
  const contentContainerStyle = {
    marginTop: '64px', // This should match the height of your Header
    padding: '20px',
    minHeight: 'calc(100vh - 64px)', // This ensures the content area takes up the full height of the viewport minus the header height
    boxSizing: 'border-box', // This ensures padding is included in the height calculation
    backgroundColor: '#000000', // Light grey background, you can adjust this as needed
    overflowY: 'auto', // In case the content is taller than the viewport
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuItemClick={handleMenuItemClick} />
      <div style={contentContainerStyle}>
        {activeComponent === 'dashboard' && (
          <div>
            <h1 style={{ marginTop: 0, color: '#333' }}>Welcome to your Dashboard</h1>
            <p>This is where you can view all your important information and stats.</p>
            {/* Add more dashboard content here */}
          </div>
        )}
        {activeComponent === 'realNameSearch' && (
          <div>
            <h2 style={{ marginTop: 0, color: '#333' }}>iRacing Name Search</h2>
            <RealNameSearch />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;