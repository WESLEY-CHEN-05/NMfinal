import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import ModeSwitch from './ModeSwitch';
import HomeIcon from '@mui/icons-material/Home';
import Account from './Account';
import { useNavigate } from 'react-router-dom'

const CustomizedAppBar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DID Taxi Service
        </Typography>
        <IconButton onClick={() => navigate('/')} color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>
        <ModeSwitch />
        <Account></Account>
      </Toolbar>
    </AppBar>
  )
}

export default CustomizedAppBar;