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
  useTheme
} from '@mui/material';
import axios from 'axios';
import PlaceBet from './PlaceBet';

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
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <Typography variant="h4" gutterBottom sx={{ color: theme.palette.text.primary }}>
        {race.session_name || 'Unnamed Race'}
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
        {formatDate(race.start_time)}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Track: {race.track?.track_name || 'Unknown Track'}
      </Typography>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ color: theme.palette.text.primary }}>
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
            seasonId={race.season_id}
            raceId={race.subsession_id}
            raceName={race.session_name}
            raceDate={formatDate(race.start_time)}
            trackName={race.track?.track_name}
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