import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const RacersList = ({ numberOfRacers }) => {
  // Generate dummy names
  const generateDummyNames = (count) => {
    const names = [];
    for (let i = 1; i <= count; i++) {
      names.push(`Racer ${i}`);
    }
    return names;
  };

  const racers = generateDummyNames(numberOfRacers);

  // Calculate the number of columns needed (10 names per column)
  const numberOfColumns = Math.ceil(racers.length / 10);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Racers ({racers.length})
      </Typography>
      <Grid container spacing={2}>
        {[...Array(numberOfColumns)].map((_, columnIndex) => (
          <Grid item xs={12} sm={6} md={4} key={columnIndex}>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
              {racers.slice(columnIndex * 10, (columnIndex + 1) * 10).map((racer, index) => (
                <li key={index}>
                  <Typography variant="body2">{racer}</Typography>
                </li>
              ))}
            </ul>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RacersList;