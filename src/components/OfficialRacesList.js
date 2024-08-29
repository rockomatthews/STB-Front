import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemText, Chip, Paper, useTheme } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import { getSession } from '../authService';
import RacersList from './RacersList';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('REACT_APP_BACKEND_URL is not set. Please configure this environment variable.');
}

const OfficialRacesList = function() {
  const theme = useTheme();
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalRaces, setTotalRaces] = useState(0);
  const [expandedRace, setExpandedRace] = useState(null);
  const [racers, setRacers] = useState({});

  const fetchRaces = useCallback(async function(pageToFetch, isRefresh = false) {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching races: page ' + pageToFetch + ', limit 10');

      const session = await getSession();
      if (!session) {
        throw new Error('No active session');
      }

      if (!BACKEND_URL) {
        throw new Error('Backend URL is not configured');
      }

      const response = await axios.get(BACKEND_URL + '/api/official-races', {
        params: { page: pageToFetch, limit: 10 },
        headers: {
          Authorization: 'Bearer ' + session.access_token
        },
        withCredentials: true
      });

      console.log('Raw response data:', response.data);

      const newRaces = response.data.races;
      const total = response.data.total;

      console.log('Parsed races:', newRaces);
      console.log('Total races:', total);

      if (isRefresh) {
        setRaces(newRaces);
      } else {
        setRaces(function(prevRaces) {
          return [...prevRaces, ...newRaces];
        });
      }
      setTotalRaces(total);
    } catch (err) {
      console.error('Error fetching races:', err);
      setError('An unexpected error occurred while fetching races. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(function() {
    fetchRaces(1, true);
  }, [fetchRaces]);

  const handleRefresh = useCallback(function() {
    console.log('Refreshing races');
    setPage(1);
    fetchRaces(1, true);
  }, [fetchRaces]);

  const handleLoadMore = useCallback(function() {
    console.log('Loading more races');
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRaces(nextPage);
  }, [page, fetchRaces]);

  const formatTime = function(timeString) {
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

  const getStateColor = function(state) {
    switch (state) {
      case 'Qualifying':
        return 'primary';
      case 'Practice':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const fetchRacers = useCallback(async function(subsessionId) {
    try {
      const session = await getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await axios.get(BACKEND_URL + '/api/race-racers', {
        params: { subsessionId: subsessionId },
        headers: {
          Authorization: 'Bearer ' + session.access_token
        },
        withCredentials: true
      });

      setRacers(function(prevRacers) {
        return {
          ...prevRacers,
          [subsessionId]: response.data
        };
      });
    } catch (err) {
      console.error('Error fetching racers:', err);
      setError('An unexpected error occurred while fetching racers. Please try again.');
    }
  }, []);

  const handleExpand = useCallback(function(raceId, subsessionId) {
    if (expandedRace === raceId) {
      setExpandedRace(null);
    } else {
      setExpandedRace(raceId);
      if (!racers[subsessionId]) {
        fetchRacers(subsessionId);
      }
    }
  }, [expandedRace, racers, fetchRacers]);

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
        {races.map(function(race) {
          return (
            <Paper 
              key={race.series_id + '_' + race.start_time} 
              elevation={3} 
              sx={{ 
                mb: 2, 
                overflow: 'hidden',
                backgroundColor: theme.palette.background.card
              }}
            >
              <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" color={theme.palette.text.secondary}>{race.title || 'Unknown Series'}</Typography>
                      <Chip 
                        label={race.state || 'Unknown State'} 
                        color={getStateColor(race.state)} 
                        size="small" 
                      />
                    </Box>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color={theme.palette.text.secondary}>
                        Track: {race.track_name || 'Unknown Track'}
                      </Typography>
                      <br />
                      <Typography variant="body2" color={theme.palette.text.secondary}>
                        Start Time: {formatTime(race.start_time) || 'Unknown'}
                        <br />
                        License Level: {race.license_level || 'Unknown'} | Car Class: {race.car_class_name || 'Unknown'} ({race.car_class || 'Unknown'})
                        <br />
                        Racers: {race.number_of_racers || 0}
                        <br />
                        Available Cars: {race.available_cars ? race.available_cars.join(', ') : 'Unknown'}
                      </Typography>
                    </React.Fragment>
                  }
                />
                <Button
                  fullWidth
                  endIcon={expandedRace === race.series_id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={function() { handleExpand(race.series_id, race.subsession_id); }}
                  sx={{ mt: 1 }}
                >
                  {expandedRace === race.series_id ? 'Collapse' : 'Expand'}
                </Button>
                {expandedRace === race.series_id && (
                  <RacersList 
                    racers={racers[race.subsession_id] || []} 
                    isLoading={!racers[race.subsession_id]}
                  />
                )}
              </ListItem>
            </Paper>
          );
        })}
      </List>

      {isLoading && (
        <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />
      )}

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