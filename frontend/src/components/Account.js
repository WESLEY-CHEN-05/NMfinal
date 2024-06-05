import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { 
  Box, Typography, Button, Modal, IconButton, TextField, InputAdornment,
  Snackbar, Alert, 
} from '@mui/material';
import { usePage } from '../hooks/usePage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
//import { usePassword } from '../Utilities/usePassword';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function Account() {
  const { signedIn, userID, userName, userEmail, setOpen } = usePage();
  const [accountOpen, setAccountOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  const navigate = useNavigate();

  const handleOpen = () => {
    if (signedIn) {
      setAccountOpen(true);
      setPasswordOpen(false);
    } else{
      setOpen(false);
      navigate('/sign_in');
    }
  }
  const handleClose = () => {
    setAccountOpen(false);
    setOpen(false);
  }

  //const {changePassword: checkValidation} = usePassword();

  /*const changePassword = async () => {
    const {state, err, type} = await checkValidation({playerID: userID, password, newPassword});
    if (state === 'success') {
      setPasswordOpen(false);
      setSuccess(true);
    }
    else if (type === 'PASSWORD-ERROR') setWrongPassword(true);
    else console.error(err);
  }*/

  return (
    <>
      {signedIn? 
        <IconButton onClick={handleOpen}>
          <AccountCircleIcon />
        </IconButton>:
        <Button onClick={handleOpen} variant="contained" color="success" >Login</Button>
      }
      
      <Modal
        open={accountOpen}
        onClose={handleClose}
        aria-labelledby="account-modal-title"
        aria-describedby="account-modal-description"
      >
        <Box sx={style}>
          <Typography id="account-modal-title" variant="h6" component="h2" color="warning">
            Account
          </Typography>
          <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Password changed!
            </Alert>
          </Snackbar>
          <Snackbar open={wrongPassword} autoHideDuration={2000} onClose={() => setWrongPassword(false)}>
            <Alert onClose={() => setWrongPassword(false)} severity="error" sx={{ width: '100%' }}>
              Wrong password!
            </Alert>
          </Snackbar>
          <TextField
            id="input-name"
            label="Name"
            defaultValue={userName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
              readOnly: true
            }}
            variant="standard"
            sx={{my: 2, width: 280}}
          />
          <TextField
            id="input-email"
            label="Email"
            defaultValue={userEmail}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
              readOnly: true
            }}
            variant="standard"
            sx={{my: 2, width: 280}}
          />
          <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 5}}>  
            <Button color='warning' onClick={() => {
              setPasswordOpen(true);
            }}>change password</Button>
            {passwordOpen? <Button color='warning' onClick={() => setPasswordOpen(false)}>cancel</Button>: <></>}
          </Box>
          {passwordOpen? 
            <>
              <TextField
                id="input-old-password"
                label="Old Password"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                sx={{my: 2, width: 280}}
              />
              <TextField
                id="input-new-password"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={event => setNewPassword(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon />
                    </InputAdornment>
                  ),
                }}
                variant="standard"
                sx={{my: 2, width: 280}}
              /> 
              <Button color='primary' variant='contained' >Submit</Button>
            </>
            : <></>
          }
        </Box>
      </Modal>
    </>
  );
}