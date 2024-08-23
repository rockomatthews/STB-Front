import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from '../supabaseClient'; // Updated import statement

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error fetching favorites:', error);
      } else {
        setFavorites(data);
      }
    }
  };

  const removeFavorite = async (id) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing favorite:', error);
    } else {
      setFavorites(favorites.filter(fav => fav.id !== id));
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '500px', margin: '20px auto' }}>
      <Typography variant="h5" gutterBottom>
        Favorite iRacing Names
      </Typography>
      {favorites.length === 0 ? (
        <Typography>You haven't added any favorites yet.</Typography>
      ) : (
        <List>
          {favorites.map((favorite) => (
            <ListItem key={favorite.id}>
              <ListItemText primary={favorite.name} secondary={`iRacing ID: ${favorite.iracing_id}`} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => removeFavorite(favorite.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default Favorites;