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

  const fetchRaces = useCallback(async (refresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/official-races`, {
        params: { page: refresh ? 1 : page, limit: 10 },
        withCredentials: true
      });

      const { races: newRaces, total } = response.data;

      if (refresh) {
        setRaces(newRaces);
        setPage(1);
      } else {
        setRaces(prevRaces => [...prevRaces, ...newRaces]);
        setPage(prevPage => prevPage + 1);
      }
      setTotalRaces(total);
    } catch (err) {
      setError('Failed to fetch races. Please try again.');
      console.error('Error fetching races:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  const handleRefresh = () => {
    fetchRaces(true);
  };

  const handleLoadMore = () => {
    fetchRaces();
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
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
                  Track: ${race.track} | 
                  Start Time: ${new Date(race.start_time).toLocaleString()} | 
                  Duration: ${race.duration} | 
                  License Level: ${race.license_level} | 
                  Drivers: ${race.current_drivers}/${race.max_drivers}
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