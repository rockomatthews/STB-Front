// src/pages/Home.js

import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  // Function to toggle between Sign In and Sign Up views
  const toggleView = () => {
    setShowSignIn((prevShowSignIn) => !prevShowSignIn);
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh' 
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Speed Trap Bets
      </Typography>
      {/* Conditionally render SignIn or SignUp component */}
      {showSignIn ? <SignIn /> : <SignUp />}
      <Button 
        onClick={toggleView} 
        sx={{ mt: 2 }}
        color="primary"
      >
        {showSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
      </Button>
    </Container>
  );
};

export default Home;
