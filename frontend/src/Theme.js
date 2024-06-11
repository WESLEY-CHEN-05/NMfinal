import { createTheme } from '@mui/material/styles';
import { brown } from '@mui/material/colors'

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
      main: brown[700],
      light: brown[100],
      dark: brown[800],
    },
    secondary: {
      main: '#ad8339',
    },
    background: {
      default: '#fff9eb',
      paper: '#fff9eb',
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
      main: brown[700],
      light: brown[600],
      dark: brown[800],
    },
    secondary: {
      main: '#fff9eb',
    },
    background: {
      default: '#4f2f00',
      paper: '#4f2f00',
    },
    text: {
      primary: 'rgba(255,255,255,0.89)',
    },
  },
  typography
});

export {lightTheme, darkTheme };