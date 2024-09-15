import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Paper,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import axios from 'axios';
import PlaceBet from './PlaceBet';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloudIcon from '@mui/icons-material/Cloud';

const RaceDetails = ({ race }) => {
  const theme = useTheme();
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openBetDialog, setOpenBetDialog] = useState(false);

  useEffect(() => {
    const fetchRoster = async () => {
      try {
        const rosterResponse = await axios.get('https://stb-back-etjo.onrender.com/api/league-roster');
        if (rosterResponse.data && Array.isArray(rosterResponse.data.roster)) {
          setRoster(rosterResponse.data.roster);
        } else {
          setError('Received unexpected data format for roster');
        }
      } catch (error) {
        console.error('Error fetching roster:', error);
        setError('Failed to load roster. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, []);

  const handleOpenBetDialog = () => {
    setOpenBetDialog(true);
  };

  const handleCloseBetDialog = () => {
    setOpenBetDialog(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
    return new Date(dateString).toLocaleString(undefined, options);
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
    <Box sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, backgroundColor: theme.palette.background.paper }}>
        <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
          Race Details
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                {formatDate(race.launch_at)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                {race.track.track_name} ({race.track.config_name})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsMotorsportsIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                {race.entry_count || 0} Drivers Registered
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
                Race Format
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Practice: {race.practice_length} minutes
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Qualifying: {race.qualify_length} minutes
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Race: {race.race_laps > 0 ? `${race.race_laps} laps` : `${race.race_length} minutes`}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            Weather
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CloudIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              {race.weather.temp_value}°F, 
              {race.weather.skies === 1 ? ' Clear' : 
               race.weather.skies === 2 ? ' Partly Cloudy' : 
               race.weather.skies === 3 ? ' Mostly Cloudy' : ' Overcast'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            Eligible Cars
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {race.cars.map((car) => (
              <Chip
                key={car.car_id}
                icon={<DirectionsCarIcon />}
                label={car.car_name}
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.text.secondary,
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1 }}>
            Registered Drivers
          </Typography>
          <List>
            {roster.map((driver) => (
              <ListItem key={driver.cust_id}>
                <ListItemText 
                  primary={driver.display_name} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      color: theme.palette.text.primary 
                    } 
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleOpenBetDialog}
          sx={{ 
            mt: 4,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Place Bet
        </Button>
      </Paper>

      <Dialog 
        open={openBetDialog} 
        onClose={handleCloseBetDialog}
        PaperProps={{
          style: {
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>Place a Bet</DialogTitle>
        <DialogContent>
          <PlaceBet
            leagueId={11489} // Your league ID
            seasonId={race.league_season_id}
            raceId={race.subsession_id}
            raceName={race.session_name || "Upcoming Race"}
            raceDate={formatDate(race.launch_at)}
            trackName={race.track.track_name}
            drivers={roster}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseBetDialog}
            sx={{ 
              color: theme.palette.text.secondary,
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RaceDetails;