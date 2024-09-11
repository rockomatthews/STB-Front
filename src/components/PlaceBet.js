import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, TextField, Button } from '@mui/material';
import axios from 'axios';

const PlaceBet = ({ leagueId, seasonId, raceId, raceName, raceDate, trackName, drivers }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const odds = 2.0; // Fixed odds for now, can be made dynamic later

  const handlePlaceBet = async () => {
    try {
      const response = await axios.post('https://stb-back-etjo.onrender.com/api/place-bet', {
        userId: 'user-id', // Replace with actual user ID
        leagueId,
        seasonId,
        raceId,
        selectedDriverId: selectedDriver,
        betAmount: parseFloat(betAmount),
        odds
      });

      console.log('Bet placed successfully:', response.data);
      // Handle successful bet placement (e.g., show success message, update UI)
    } catch (error) {
      console.error('Error placing bet:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Place a Bet</Typography>
      <Typography variant="body1" gutterBottom>{raceName}</Typography>
      <Typography variant="body2" gutterBottom>{raceDate} at {trackName}</Typography>
      <Select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        displayEmpty
      >
        <MenuItem value="" disabled>Select a driver</MenuItem>
        {drivers.map((driver) => (
          <MenuItem key={driver.cust_id} value={driver.cust_id}>
            {driver.display_name}
          </MenuItem>
        ))}
      </Select>
      <TextField
        type="number"
        label="Bet Amount (USDC)"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography sx={{ mb: 2 }}>Odds: {odds}</Typography>
      <Button 
        variant="contained" 
        onClick={handlePlaceBet} 
        disabled={!selectedDriver || !betAmount}
        fullWidth
      >
        Place Bet
      </Button>
    </Box>
  );
};

export default PlaceBet;