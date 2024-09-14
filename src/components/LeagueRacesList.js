import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  Typography, 
  Box, 
  CircularProgress, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  useTheme,
  Button
} from '@mui/material';
import axios from 'axios';

const LeagueRacesList = ({ onRaceSelect }) => {
  const theme = useTheme();
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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Date not available';
    }
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'UTC'
    };
    return date.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
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
          <InputLabel id="season-select-label" sx={{ color: theme.palette.text.primary }}>Select Season</InputLabel>
          <Select
            labelId="season-select-label"
            id="season-select"
            value={selectedSeason}
            label="Select Season"
            onChange={handleSeasonChange}
            sx={{ 
              color: theme.palette.text.primary,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.primary,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            {seasons.map((season) => (
              <MenuItem key={season.season_id} value={season.season_id.toString()}>
                {season.season_name || `Season ${season.season_id}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Typography sx={{ color: theme.palette.text.primary }}>No seasons available.</Typography>
      )}

      {races.length > 0 ? (
        <List>
          {races.map((race) => (
            <ListItem key={race.subsession_id} sx={{ padding: 0, marginBottom: 1 }}>
              <Button
                onClick={() => handleRaceClick(race)}
                fullWidth
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                  textAlign: 'left',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                <Box>
                  <Typography variant="body1" component="div">
                    {formatDate(race.start_time)}
                  </Typography>
                  <Typography variant="body2" component="div">
                    {race.track?.track_name || 'Track not available'}
                  </Typography>
                </Box>
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography sx={{ color: theme.palette.text.primary }}>No upcoming races found for this season.</Typography>
      )}
    </Box>
  );
};

export default LeagueRacesList;