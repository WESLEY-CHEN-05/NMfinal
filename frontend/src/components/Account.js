import * as React from 'react';
import { useState } from 'react';
import { 
  Box, Typography, Button, Modal, IconButton, TextField, InputAdornment,
  Snackbar, Alert, 
} from '@mui/material';
import { usePage } from '../hooks/usePage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import SaveAsIcon from '@mui/icons-material/SaveAs';

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
  const { userDID, setUserDID, userKey, setUserKey } = usePage();
  const [accountOpen, setAccountOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOpen = () => {
    setAccountOpen(true);
  }
  const handleClose = () => {
    setAccountOpen(false);
  }
  const setInfo = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setUserDID(data.get("DIDid"));
    setUserKey(data.get("privateKey"));
    console.log(data.get("DIDid"));
    localStorage.setItem("userDID", data.get("DIDid"));
    localStorage.setItem("userKey", data.get("privateKey"));
    setSuccess(true)
  }

  return (
    <>
      <IconButton onClick={handleOpen}>
        <SaveAsIcon sx={{color: "#FFF"}}/>
      </IconButton>
      <Modal
        open={accountOpen}
        onClose={handleClose}
        aria-labelledby="account-modal-title"
        aria-describedby="account-modal-description"
      >
        <Box component="form" noValidate onSubmit={setInfo} sx={style}>
          <Typography id="account-modal-title" variant="h6" component="h2" color="warning">
            Local Storage
          </Typography>
          <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Info saved!
            </Alert>
          </Snackbar>
          <TextField
            id="DIDid"
            label="DID id"
            name="DIDid"
            defaultValue={userDID}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
            variant="standard"
            sx={{my: 2, width: 280}}
          />
          <TextField
            id="privateKey"
            label="private key"
            defaultValue={userKey}
            name="privateKey"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              )
            }}
            variant="standard"
            sx={{my: 2, width: 280}}
          />
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 5}}>  
            <Button type="submit" color='primary' variant="contained">save</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}