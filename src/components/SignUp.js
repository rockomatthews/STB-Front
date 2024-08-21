import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Container, Typography, Snackbar, Alert } from '@mui/material';
import Google from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Ensure this path is correct

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        try {
          // Fetch the user's data
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('username')
            .eq('id', session.user.id)
            .single();

          if (fetchError) throw fetchError;

          // If the user doesn't exist in the users table, insert them
          if (!userData) {
            const { error: insertError } = await supabase
              .from('users')
              .insert([
                {
                  id: session.user.id,
                  username: session.user.user_metadata.full_name || session.user.email.split('@')[0],
                  email: session.user.email,
                  iracing_name: '',
                }
              ]);

            if (insertError) throw insertError;
          }

          setSnackbarMessage('Successfully signed in!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);

          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        } catch (error) {
          console.error('Error updating user data:', error.message);
          setSnackbarMessage(error.message || 'An error occurred while updating user data.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) throw error;

      // The onAuthStateChange listener will handle the rest
    } catch (error) {
      console.error('Error during sign up:', error.message);
      setSnackbarMessage(error.message || 'An error occurred during sign up.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) throw error;

      // The onAuthStateChange listener will handle the rest
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setSnackbarMessage(error.message || 'An error occurred during Google sign in.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
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
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing Up...' : 'Sign Up'}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<Google />}
          onClick={handleGoogleSignIn}
          sx={{ mb: 2 }}
          disabled={isSubmitting}
        >
          Sign in with Google
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignUp;