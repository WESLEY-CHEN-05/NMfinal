import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import ModeSwitch from './ModeSwitch';
import HomeIcon from '@mui/icons-material/Home';
import Account from './Account';
import { useNavigate } from 'react-router-dom'

const CustomizedAppBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{flexGrow:1 }}>
          <Box 
            component="img" 
            src="logo.png" 
            alt="TrustRide Logo" 
            sx={{ 
              height: '5vh',
              width: 'auto',
            }}
          />
        </Box>
        <Account></Account>
        <IconButton onClick={() => navigate('/')} color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>
        <ModeSwitch />
      </Toolbar>
    </AppBar>
  )
}

export default CustomizedAppBar;