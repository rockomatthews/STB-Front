import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { getSession } from '../authService';

// Use the backend URL defined in environment variables, or fall back to localhost during development.
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const OfficialRacesList = () => {
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalRaces, setTotalRaces] = useState(0);

  const fetchRaces = useCallback(async (pageToFetch, isRefresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching races: page ${pageToFetch}, limit 10`);

      const session = await getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await axios.get(`${BACKEND_URL}/api/official-races`, {
        params: { page: pageToFetch, limit: 10 },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        },
        withCredentials: true
      });

      console.log('Response received:', response.data);
      const { races: newRaces, total } = response.data;

      if (isRefresh) {
        setRaces(newRaces);
      } else {
        setRaces(prevRaces => [...prevRaces, ...newRaces]);
      }
      setTotalRaces(total);
      console.log(`Updated races. Total: ${total}, Current page: ${pageToFetch}`);
    } catch (err) {
      console.error('Error fetching races:', err);
      setError('An unexpected error occurred while fetching races. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRaces(1, true);
  }, [fetchRaces]);

  const handleRefresh = useCallback(() => {
    console.log('Refreshing races');
    setPage(1);
    fetchRaces(1, true);
  }, [fetchRaces]);

  const handleLoadMore = useCallback(() => {
    console.log('Loading more races');
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRaces(nextPage);
  }, [page, fetchRaces]);

  const formatTime = (timeString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      timeZoneName: 'short' 
    };
    return new Date(timeString).toLocaleString(undefined, options);
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
        <Button onClick={handleRefresh} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Official Races</Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      <List>
        {races.map((race, index) => (
          <React.Fragment key={`${race.series_id}_${race.start_time}`}>
            <ListItem>
              <ListItemText
                primary={race.title}
                secondary={
                  <React.Fragment>
                    <Typography component="span" variant="body2" color="text.primary">
                      {race.state}
                    </Typography>
                    {` | Track: ${race.track_name}`}
                    <br />
                    {`Start Time: ${formatTime(race.start_time)}`}
                    <br />
                    {`License Level: ${race.license_level} | Car Class: ${race.car_class}`}
                    <br />
                    {`Racers: ${race.number_of_racers}`}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < races.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />}

      {!isLoading && races.length < totalRaces && (
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLoadMore}
          sx={{ mt: 2 }}
        >
          Load More
        </Button>
      )}

      {!isLoading && races.length === 0 && (
        <Typography sx={{ mt: 2 }}>No official races found.</Typography>
      )}
    </Box>
  );
};

export default OfficialRacesList;