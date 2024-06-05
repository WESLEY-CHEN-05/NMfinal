import { createTheme } from '@mui/material/styles';
import { deepPurple } from '@mui/material/colors'

const typography = {
  fontFamily: [
    '"Poppins"',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: deepPurple[700],
      light: deepPurple[100],
      dark: deepPurple[800],
    },
    secondary: {
      main: '#bd07f7',
    },
    background: {
      default: '#eaeaea',
      paper: '#fff',
    },
    text: {
      primary: 'rgba(0,0,0,0.89)',
    },
  },
  typography
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: deepPurple[700],
      light: deepPurple[600],
      dark: deepPurple[800],
    },
    secondary: {
      main: '#bd07f7',
    },
    background: {
      default: '#252030',
      paper: '#111',
    },
    text: {
      primary: 'rgba(255,255,255,0.89)',
    },
  },
  
  typography
});

export {lightTheme, darkTheme };