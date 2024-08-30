import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFF00',
    },
    secondary: {
      main: '#000000', // Black color for text
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#000000', // Black color for text in cards
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#000000',
          backgroundColor: '#FFFF00',
          '&:hover': {
            backgroundColor: '#CCCC00',
          },
        },
      },
    },
  },
});

export default theme;