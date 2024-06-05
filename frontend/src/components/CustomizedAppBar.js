import { AppBar, Toolbar, Typography} from '@mui/material';
import ModeSwitch from './ModeSwitch';
import Account from './Account';

const CustomizedAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DID Taxi Service
        </Typography>
        <ModeSwitch />
        <Account></Account>
      </Toolbar>
    </AppBar>
  )
}

export default CustomizedAppBar;