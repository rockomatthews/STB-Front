import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Divider } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import supabase from '../supabaseClient';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://stb-back-etjo.onrender.com';

const OfficialRacesList = () => {
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const fetchRaces = useCallback(async (refresh = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await axios.get(`${BACKEND_URL}/api/official-races`, {
        params: { page: refresh ? 1 : page, limit: 10 },
        headers: { Authorization: `Bearer ${user.access_token}` }
      });

      if (refresh) {
        setRaces(response.data);
        setPage(1);
      } else {
        setRaces(prevRaces => [...prevRaces, ...response.data]);
        setPage(prevPage => prevPage + 1);
      }
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

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <List>
        {races.map((race, index) => (
          <React.Fragment key={race.id}>
            <ListItem>
              <ListItemText
                primary={race.name}
                secondary={`Track: ${race.track} | Start Time: ${new Date(race.start_time).toLocaleString()}`}
              />
            </ListItem>
            {index < races.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {isLoading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}

      {!isLoading && races.length > 0 && (
        <Button
          fullWidth
          variant="outlined"
          onClick={handleLoadMore}
          sx={{ mt: 2 }}
        >
          Load More
        </Button>
      )}
    </Box>
  );
};

export default OfficialRacesList;