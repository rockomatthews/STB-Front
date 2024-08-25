import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

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
      const response = await axios.get(`${BACKEND_URL}/api/official-races`, {
        params: { page: pageToFetch, limit: 10 },
        withCredentials: true
      });

      console.log('Response received:', response.data); // Add this log to see the response from the backend
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
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.details || err.message || 'An unexpected error occurred while fetching races. Please try again.');
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
          <React.Fragment key={race.id}>
            <ListItem>
              <ListItemText
                primary={race.name}
                secondary={`
                  Track: ${race.track_name} | 
                  Start Time: ${new Date(race.start_time).toLocaleString()} | 
                  End Time: ${new Date(race.end_time).toLocaleString()} | 
                  License Group: ${race.license_group}
                `}
              />
            </ListItem>
            {index < races.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

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
