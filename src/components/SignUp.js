import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import Google from '@mui/icons-material/Google';
import supabase from '../supabaseClient';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sign up the user using Supabase Authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (authError) {
      console.error('Error signing up:', authError.message);
      return;
    }

    console.log('Sign up successful:', authData);

    // If sign-up is successful, save the user info to the custom Users table
    const { user } = authData;
    const { data: userData, error: userError } = await supabase
      .from('Users')
      .insert([
        {
          auth_user_id: user.id,
          username: username,
          email: email,
        },
      ]);

    if (userError) {
      console.error('Error inserting user data:', userError.message);
    } else {
      console.log('User data inserted successfully:', userData);
    }

    // Show success message
    setSnackbarOpen(true);
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
    } else {
      console.log('Google sign in successful:', data);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
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

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Successfully signed up! Please check your email to verify that you have one...
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;
