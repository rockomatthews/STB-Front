import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const LeagueRacesList = () => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://stb-back-etjo.onrender.com/api/league-subsessions');
        setRaces(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching races:', err);
        setError('Failed to load races. Please try again later.');
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upcoming League Races
      </Typography>
      <List>
        {races.map((race) => (
          <ListItem key={race.subsession_id}>
            <ListItemText
              primary={race.session_name || 'Unnamed Race'}
              secondary={`${formatDate(race.start_time)} at ${race.track.track_name}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeagueRacesList;