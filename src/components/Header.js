import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import StarIcon from '@mui/icons-material/Star';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header = () => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Profile', icon: <PersonIcon /> },
    { text: 'iRacing Name Search', icon: <SearchIcon /> },
    { text: 'Search Official Races', icon: <SportsMotorsportsIcon /> },
    { text: 'Favorites', icon: <StarIcon /> },
    { text: 'Logout', icon: <ExitToAppIcon /> },
  ];

  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <React.Fragment>
      <AppBar position="fixed" sx={{ backgroundColor: theme.palette.primary.main }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="menu" 
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: '#000000' }} />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="contained" 
            sx={{ 
              backgroundColor: '#000000', 
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Connect Wallet
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'white',
            color: 'black',
          },
        }}
      >
        {list()}
      </Drawer>
    </React.Fragment>
  );
};

export default Header;