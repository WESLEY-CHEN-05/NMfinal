import * as React from 'react';
import { useState } from 'react';
import { 
  Box, Typography, Button, Modal, IconButton, TextField, InputAdornment,
  Snackbar, Alert, Input,
  FormControl, InputLabel
} from '@mui/material';
import { usePage } from '../hooks/usePage';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import base64decoder from '../utilities/base64decoder';

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
  const { userDID, setUserDID, userKey, setUserKey, VC, setVC, VCFileName, setVCFileName } = usePage();
  const [accountOpen, setAccountOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [VPgenerated, setVPgenerated] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());


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

  const clear = () => {
    setUserDID("");
    setUserKey("");
    setVCFileName("");
    setVC("");
    localStorage.removeItem("userDID");
    localStorage.removeItem("userKey");
    localStorage.removeItem("VCFileName");
    localStorage.removeItem("VC");
    setFormKey(Date.now());
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file?.name) {
      console.log(file.name); // Check if the file name is captured
      localStorage.setItem("VCFileName", file.name)
      setVCFileName(file.name);
      setVPgenerated(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        // remove " "
        setVC(e.target.result.slice(1, -1));
        localStorage.setItem("VC", e.target.result.slice(1, -1))
        console.log(VC);
        console.log(base64decoder(e.target.result.slice(1, -1)));
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
      };
      reader.readAsText(file);
    } 
  }
  const downloadDIDDocument = () => {
    if (!userDID || userDID === '') {
      setError(true);
      setErrorMessage("ERROR: DID id is empty!")
    }
  }

  const generateVP = () => {
    if (!VC || VC === '') {
      setError(true);
      setErrorMessage("ERROR: No VC file found!")
    }
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
        <Box key={formKey} component="form" noValidate onSubmit={setInfo} sx={style}>
          <Typography id="account-modal-title" variant="h6" component="h2" color="warning">
            Local Storage
          </Typography>
          <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Info saved!
            </Alert>
          </Snackbar>
          <Snackbar open={error} autoHideDuration={2000} onClose={() => () => setError(false)}>
            <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
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
          <Box sx={{display: 'flex', width: "100%"}}>  
            <Button color='primary' variant="contained" onClick={downloadDIDDocument} sx={{ width: "100%"}}>Download DID Document</Button>
          </Box>
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
          <FormControl fullWidth variant="standard" sx={{my: 2, width: 280}}>
            <InputLabel htmlFor="file-upload-field">VC</InputLabel>
            <Input
              type="text"
              placeholder="No file chosen"
              label="VC"
              value={VCFileName}
              readOnly
              fullWidth
              startAdornment={
                <InputAdornment position="start">
                  <InsertDriveFileIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end" >
                  <Button
                    variant="contained"
                    component="label"
                    size="small"
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </InputAdornment>
              }
            />
          </FormControl>
          <Box sx={{display: 'flex', width: "100%"}}>  
            <Button color='primary' variant="contained" onClick={generateVP} sx={{ width: "100%"}}>Generate VP from VC</Button>
          </Box>
          <Box sx={{display: 'flex', justifyContent: 'space-between', width: "100%", mt: 5}}> 
            <Button onClick={clear} color='secondary' variant="contained">clear all</Button> 
            <Button type="submit" color='secondary' variant="contained">save</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}