import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Button, Box, Drawer, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header = ({ onMenuItemClick }) => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleMenuItemClick = (text) => {
    onMenuItemClick(text);
    setIsDrawerOpen(false);
  };

const menuItems = [
  { text: 'Profile', icon: <PersonIcon sx={{ color: 'black' }} /> },
  { text: 'iRacing Name Search', icon: <SearchIcon sx={{ color: 'black' }} /> },
  { text: 'Search Official Races', icon: <FindInPageIcon sx={{ color: 'black' }} /> },
  { text: 'Bets', icon: <SportsMotorsportsIcon sx={{ color: 'black' }} /> },
  { text: 'Bet History', icon: <HistoryIcon sx={{ color: 'black' }} /> },
  { text: 'Favorites', icon: <StarIcon sx={{ color: 'black' }} /> },
  { text: 'Logout', icon: <ExitToAppIcon sx={{ color: 'black' }} /> },
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
          <ListItem button key={item.text} onClick={() => handleMenuItemClick(item.text)}>
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