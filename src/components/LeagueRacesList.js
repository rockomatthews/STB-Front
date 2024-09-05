import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

const LeagueRacesList = () => {
  console.log('LeagueRacesList component rendering');

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [races, setRaces] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openRoster, setOpenRoster] = useState(false);

  useEffect(() => {
    console.log('Fetching seasons effect running');
    const fetchSeasons = async () => {
      try {
        setLoading(true);
        console.log('Making API call to fetch seasons');
        const response = await axios.get('https://stb-back-etjo.onrender.com/api/league-seasons');
        console.log('Seasons response:', response.data);
        if (response.data && Array.isArray(response.data.seasons)) {
          setSeasons(response.data.seasons);
          if (response.data.seasons.length > 0) {
            setSelectedSeason(response.data.seasons[0].season_id.toString());
          }
        } else {
          console.error('Unexpected seasons data format:', response.data);
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
    console.log('Fetching races effect running, selectedSeason:', selectedSeason);
    const fetchRaces = async () => {
      if (selectedSeason) {
        try {
          setLoading(true);
          console.log('Making API call to fetch races');
          const response = await axios.get(`https://stb-back-etjo.onrender.com/api/league-subsessions?seasonId=${selectedSeason}`);
          console.log('Races response:', response.data);
          if (response.data && Array.isArray(response.data.sessions)) {
            setRaces(response.data.sessions);
          } else {
            console.error('Unexpected races data format:', response.data);
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

  const fetchRoster = async () => {
    try {
      setLoading(true);
      console.log('Making API call to fetch roster');
      const response = await axios.get('https://stb-back-etjo.onrender.com/api/league-roster');
      console.log('Roster response:', response.data);
      if (response.data && Array.isArray(response.data.roster)) {
        setRoster(response.data.roster);
        setOpenRoster(true);
      } else {
        console.error('Unexpected roster data format:', response.data);
        setError('Received unexpected data format for roster');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roster:', error);
      setError('Failed to load roster. Please try again later.');
      setLoading(false);
    }
  };

  const handleSeasonChange = (event) => {
    console.log('Season changed to:', event.target.value);
    setSelectedSeason(event.target.value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  console.log('Component state:', { loading, error, seasons, selectedSeason, races, roster });

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
        League Races
      </Typography>
      
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

      <Button onClick={fetchRoster} variant="contained" sx={{ mb: 2 }}>
        View Season Roster
      </Button>

      {races.length > 0 ? (
        <List>
          {races.map((race) => (
            <ListItem key={race.subsession_id}>
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

      <Dialog open={openRoster} onClose={() => setOpenRoster(false)}>
        <DialogTitle>Season Roster</DialogTitle>
        <DialogContent>
          {roster.map((driver) => (
            <Typography key={driver.cust_id}>
              {driver.display_name}
            </Typography>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoster(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeagueRacesList;