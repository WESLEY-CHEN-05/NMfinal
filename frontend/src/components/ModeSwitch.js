import { usePage } from '../hooks/usePage';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Switch } from '@mui/material';


const ModeSwitch = () => {
  const { themeMode, setThemeMode } = usePage();
  const changeTheme = () => {
    setThemeMode(() => themeMode === 'dark'? 'light' : 'dark');
  }
  return (
    <Switch 
      color="secondary" 
      onChange={changeTheme}
      checked={themeMode === 'dark'}
      icon={<LightModeIcon />} 
      checkedIcon={<Brightness2Icon />}
      sx={{
        width: 80,
        height: '50%',
        '& .MuiSwitch-switchBase': {
          alignItems: 'center',
          height: '100%',
          paddingLeft: '15px', 
          // When checked
          '&.Mui-checked': {
            transform: 'translateX(26px)', 
          },
          '&.Mui-checked + .MuiSwitch-track': {
            paddingLeft: 0, 
          },
        },
        '& .MuiSwitch-track': {
          borderRadius: 11,
          height: 27,
        },
      }}
    />
  );
}

export default ModeSwitch;