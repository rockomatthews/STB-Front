// src/components/SignIn.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Container, Typography } from '@mui/material';
import Google from '@mui/icons-material/Google';
import supabase from '../supabaseClient';


const SignIn = () => {
  // State variables to hold the email and password input by the user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // useNavigate hook to allow for navigation to different routes
  const navigate = useNavigate();

  // Function to handle form submission for signing in with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('Sign in successful:', data);
      navigate('/dashboard');
    }
  };
  
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  
    if (error) {
      console.error('Error signing in with Google:', error.message);
    } else {
      console.log('Google sign in successful:', data);
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {/* Email input field */}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {/* Password input field */}
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Submit button to sign in */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        {/* Google Sign-In button */}
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          sx={{ mb: 2 }}
        >
          Sign in with Google
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
