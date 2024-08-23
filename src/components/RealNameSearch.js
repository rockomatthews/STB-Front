import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress, Paper, IconButton } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import supabase from '../supabaseClient'; // Updated import statement

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://stb-back-etjo.onrender.com';

const RealNameSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setIsFavorite(false);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/search-iracing-name?name=${encodeURIComponent(searchTerm)}`);
      
      if (response.data.exists) {
        setSearchResult({ name: response.data.name, id: response.data.id, exists: true });
        checkIfFavorite(response.data.id);
      } else {
        setSearchResult({ name: searchTerm, exists: false });
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkIfFavorite = async (iracingId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('iracing_id', iracingId)
        .single();

      if (error) {
        console.error('Error checking favorite:', error);
      } else {
        setIsFavorite(!!data);
      }
    }
  };

  const toggleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && searchResult) {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('iracing_id', searchResult.id);

        if (error) {
          console.error('Error removing favorite:', error);
        } else {
          setIsFavorite(false);
        }
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            name: searchResult.name,
            iracing_id: searchResult.id
          });

        if (error) {
          console.error('Error adding favorite:', error);
        } else {
          setIsFavorite(true);
        }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search iRacing Real Name
      </Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter a real name"
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isLoading || !searchTerm.trim()}
          sx={{ ml: 1 }}
        >
          Search
        </Button>
      </Box>
      
      {isLoading && <CircularProgress />}
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      {searchResult && (
        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
          {searchResult.exists ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ flexGrow: 1 }}>{searchResult.name}</Typography>
              <IconButton onClick={toggleFavorite}>
                {isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
              </IconButton>
            </Box>
          ) : (
            <Typography>
              {searchResult.name} has not created an iRacing account yet.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default RealNameSearch;