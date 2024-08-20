import React from 'react';
import { AppBar, Toolbar, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';

const Header = () => {
  const theme = useTheme();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon sx={{ color: '#000000' }} />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" sx={{ backgroundColor: '#000000', color: theme.palette.primary.main }}>
          Connect Wallet
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
