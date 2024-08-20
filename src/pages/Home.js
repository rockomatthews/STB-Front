import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';

const Home = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Speed Trap Bets
      </Typography>
      {showSignIn ? <SignIn /> : <SignUp />}
      <Button 
        onClick={() => setShowSignIn(!showSignIn)} 
        sx={{ mt: 2 }}
        color="primary"
      >
        {showSignIn ? "Need an account? Sign Up" : "Already have an account? Sign In"}
      </Button>
    </Container>
  );
};

export default Home;