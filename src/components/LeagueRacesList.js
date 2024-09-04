import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const LeagueRacesList = () => {
  const dummyRaces = [
    { id: 1, name: "Sunday Night Sprint", date: "2024-09-08", track: "Daytona International Speedway" },
    { id: 2, name: "Midweek Madness", date: "2024-09-11", track: "Circuit de Spa-Francorchamps" },
    { id: 3, name: "Friday Night Lights", date: "2024-09-13", track: "Bristol Motor Speedway" },
    { id: 4, name: "Endurance Challenge", date: "2024-09-15", track: "Nürburgring" },
  ];

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upcoming League Races
      </Typography>
      <List>
        {dummyRaces.map((race) => (
          <ListItem key={race.id}>
            <ListItemText
              primary={race.name}
              secondary={`${race.date} at ${race.track}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LeagueRacesList;