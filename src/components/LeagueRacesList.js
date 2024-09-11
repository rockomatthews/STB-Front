import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Box, 
  CircularProgress, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import axios from 'axios';

const LeagueRacesList = ({ onRaceSelect }) => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://stb-back-etjo.onrender.com/api/league-seasons');
        if (response.data && Array.isArray(response.data.seasons)) {
          setSeasons(response.data.seasons);
          if (response.data.seasons.length > 0) {
            setSelectedSeason(response.data.seasons[0].season_id.toString());
          }
        } else {
          setError('Received unexpected data format for seasons');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seasons:', error);
        setError('Failed to load seasons. Please try again later.');
        setLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  useEffect(() => {
    const fetchRaces = async () => {
      if (selectedSeason) {
        try {
          setLoading(true);
          const response = await axios.get(`https://stb-back-etjo.onrender.com/api/league-subsessions?seasonId=${selectedSeason}`);
          if (response.data && Array.isArray(response.data.sessions)) {
            setRaces(response.data.sessions);
          } else {
            setError('Received unexpected data format for races');
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching races:', error);
          setError('Failed to load races. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchRaces();
  }, [selectedSeason]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  const handleRaceClick = (race) => {
    onRaceSelect(race);
  };

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
      {seasons.length > 0 ? (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="season-select-label">Select Season</InputLabel>
          <Select
            labelId="season-select-label"
            id="season-select"
            value={selectedSeason}
            label="Select Season"
            onChange={handleSeasonChange}
          >
            {seasons.map((season) => (
              <MenuItem key={season.season_id} value={season.season_id.toString()}>
                {season.season_name || `Season ${season.season_id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography>No seasons available.</Typography>
      )}

      {races.length > 0 ? (
        <List>
          {races.map((race) => (
            <ListItem 
              key={race.subsession_id} 
              button 
              onClick={() => handleRaceClick(race)}
              sx={{ 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                mb: 1,
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                color: '#000000' // Ensure text is visible on light background
              }}
            >
              <ListItemText
                primary={race.session_name || 'Unnamed Race'}
                secondary={`${formatDate(race.start_time)} at ${race.track?.track_name || 'Unknown Track'}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No races found for this season.</Typography>
      )}
    </Box>
  );
};

export default LeagueRacesList;