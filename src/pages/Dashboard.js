import React, { useState } from 'react';
import Header from '../components/Header';
import RealNameSearch from '../components/RealNameSearch';
import Favorites from '../components/Favorites';
import LeagueRacesList from '../components/LeagueRacesList';
import RaceDetails from '../components/RaceDetails';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [selectedRace, setSelectedRace] = useState(null);

  const handleMenuItemClick = (menuItem) => {
    switch (menuItem) {
      case 'iRacing Name Search':
        setActiveComponent('realNameSearch');
        break;
      case 'Favorites':
        setActiveComponent('favorites');
        break;
      case 'League Races':
        setActiveComponent('leagueRaces');
        break;
      default:
        setActiveComponent('dashboard');
    }
    setSelectedRace(null); // Reset selected race when changing menu items
  };

  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    setActiveComponent('raceDetails');
  };

  const contentContainerStyle = {
    marginTop: '64px',
    padding: '20px',
    minHeight: 'calc(100vh - 64px)',
    boxSizing: 'border-box',
    backgroundColor: '#000000',
    overflowY: 'auto',
    color: '#FFFFFF',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onMenuItemClick={handleMenuItemClick} />
      <div style={contentContainerStyle}>
        {activeComponent === 'dashboard' && (
          <div>
            <h1>Welcome to your Dashboard</h1>
            <p>This is where you can view all your important information and stats.</p>
          </div>
        )}
        {activeComponent === 'realNameSearch' && (
          <div>
            <h2>iRacing Name Search</h2>
            <RealNameSearch />
          </div>
        )}
        {activeComponent === 'favorites' && (
          <div>
            <h2>Favorites</h2>
            <Favorites />
          </div>
        )}
        {activeComponent === 'leagueRaces' && (
          <div>
            <h2>League Races</h2>
            <LeagueRacesList onRaceSelect={handleRaceSelect} />
          </div>
        )}
        {activeComponent === 'raceDetails' && selectedRace && (
          <div>
            <h2>Race Details</h2>
            <RaceDetails race={selectedRace} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;