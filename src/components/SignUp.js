// src/components/SignUp.js

import React, { useState } from 'react';
import { TextField, Button, Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import Google from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const SignUp = () => {
  // State variables for handling user inputs and feedback
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // useNavigate hook from react-router-dom for navigation
  const navigate = useNavigate();

  // Function to handle the sign-up form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the user's password before sending it to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // The second parameter "10" is the salt rounds, which controls the complexity of the hash.
    
    // Attempt to sign up the user using Supabase Authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    // Handle any errors that occur during sign-up
    if (authError) {
      console.error('Error signing up:', authError.message);
      return;
    }

    console.log('Sign up successful:', authData);

    // If sign-up is successful, proceed to insert the user's data into the custom Users table
    if (authData.user) {
      const { user } = authData;

      // Insert user data into the custom Users table with the hashed password
      const { data: userData, error: userError } = await supabase
        .from('Users')
        .insert([
          {
            id: user.id,  // Use the user's auth ID from Supabase
            username: username,
            iracing_name: '',  // Initially empty
            email: email,
            password_hash: hashedPassword,  // Store the hashed password
          },
        ]);

      // Handle any errors that occur during the insertion
      if (userError) {
        console.error('Error inserting user data:', userError.message);
      } else {
        console.log('User data inserted successfully:', userData);
      }
    }

    // Show the success message and keep the user on the sign-up page
    setSnackbarOpen(true);

    // Optionally redirect to sign-in or stay on the sign-up page
    setTimeout(() => {
      navigate('/signin');  // Redirect to sign-in page
    }, 3000);  // 3-second delay for Snackbar to display
  };

  // Function to handle Google sign-in
  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    // Handle any errors that occur during Google sign-in
    if (error) {
      console.error('Error signing in with Google:', error.message);
    } else {
      console.log('Google sign in successful:', data);
      navigate('/dashboard');  // Redirect to dashboard
    }
  };

  // Function to close the Snackbar
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

      {/* Snackbar to show success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Successfully signed up! Please check your email to verify your account.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;