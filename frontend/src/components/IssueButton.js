import * as React from 'react';
import { useState, useEffect} from "react";
import { Box, Button, TextField, Typography, Modal, Snackbar, Alert, Grid } from '@mui/material'
import { usePage } from '../hooks/usePage';
import { useBackend } from '../hooks/useBackend';
import { v4 as uuidv4 } from 'uuid';
import { WebsiteProvider, useWebsite } from '../hooks/WebsiteContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  justifyContent:'center',
  width: '500px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  outline: 'none', // 移除預設框線
};

export default function BasicModal({ issuerDID, subjectDID, name, licenseNumber, dueDate, email }) {
  const { userDID, userKey } = usePage();
  const [open, setOpen] = useState(false);
  const [passengerOpen, setPassengerOpen] = useState(false);
  const [jwtKeyID, setJwtKeyID] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const { issueVC, challenge } = useBackend();
  const { credentialJwt, setCredentialJwt, presentationJwt, nonce, setNonce } = useWebsite();

  const downloadJSON = (data, fileName) => {
    const downdata = new Blob([JSON.stringify(data)], {type : 'application/json'});
    const url = URL.createObjectURL(downdata);
    const link = document.createElement('a');
    link.href = url;
    // link.download = `${fileName}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  const handleIssue = (event) => {
    event.preventDefault();
    const _issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";
    const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
    const _privateKey = "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8";
    const _name = "Wesley Chen";
    const data = new FormData(event.currentTarget);
    const info = {
      issuerDID: data.get("issuerDIDid"),
      subjectDID: data.get("subjectDIDid"),
      jwkPrivateKey: data.get("JwtKey"),
      subjectInfo: {
        name: data.get("name"),
        licenseNumber: data.get("licenseNumber"),
        licenseDueDate: data.get("dueDate"),
        email: data.get("email")
      }
    }
    console.log("INFO", info);

    issueVC(info);

    setOpen(false);
  };

  // const handleVP = () => {
  //   const _nonce = uuidv4();
  //   const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
  //   const _subjectPrivateKey = "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg";
  //   const _credentialJwtString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmI2tleS0xIiwidHlwIjoiSldUIiwiYWxnIjoiRWREU0EifQ.eyJpc3MiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmIiwibmJmIjoxNzE4MDg5NDIyLCJqdGkiOiJodHRwczovL3d3dy50YWl3YW50YXhpLmNvbS50dy8iLCJzdWIiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlIiwidmMiOnsiQGNvbnRleHQiOiJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJUYXhpRHJpdmVyQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJsaWNlbnNlIjoiQ2VydGlmaWVkIFRheGkgRHJpdmVyIiwibmFtZSI6Ildlc2xleSBDaGVuIn19fQ.ib8RFBKr6Ydd_BM_25oJ_y42Rz1B0p63nQjL3xDP0EGnV7zqILThDax2VDUQT7CgctxDUUR1mFih4LA8BlFPCQ";

  //   challenge(_nonce, _subjectDID, _subjectPrivateKey, _credentialJwtString);
  // }

  // const handleVerify = () => {
  //   const _nonce = uuidv4();
  //   const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
  //   setNonce(_nonce);
  //   console.log(_nonce);
  //   setPassengerOpen(false);
  // };

  useEffect(() => {
    console.log("Updated credentialJwt:", credentialJwt);
    if (credentialJwt.startsWith("ERROR")) console.log("YOU FUCK UP");
    else if (credentialJwt !== "") {
      const object = {
        credentialJwt,
      }
      downloadJSON(credentialJwt, "credential.json");
    }
    setCredentialJwt("");
  }, [credentialJwt]);

  
  // useEffect(() => {
  //   console.log("Updated presentationJwt:", presentationJwt);
  //   console.log(presentationJwt);
  // }, [presentationJwt]);

  const handleCloseSnackbar = (event, reason) => {
     if (reason === 'clickaway') {
      return;
     }
     setOpenSnackbar(false);
  };

  return (
    <div>
      <Button variant="contained" style={{ backgroundColor: '#D2B48C', color: '#000' }} onClick={handleOpen}>
        Issue
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box component="form" noValidate onSubmit={handleIssue} sx={{ mt: 1, width: '80%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5" component="h2" marginBottom={2} align='center' sx={{ fontWeight: 600 }}>
                  Issue Credential
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="issuerDIDid"
                  label="Issuer's DID id"
                  name="issuerDIDid"
                  defaultValue={userDID}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="JwtKey"
                  label="JwtKey"
                  name="JwtKey"
                  defaultValue={userKey}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" component="h2" marginBottom={2} >
                  Subject's Info (read only):
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="subjectDIDid"
                  label="DID id"
                  name="subjectDIDid"
                  defaultValue={subjectDID}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  defaultValue={name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="licenseNumber"
                  label="license Number"
                  name="licenseNumber"
                  defaultValue={licenseNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="dueDate"
                  label="license Due Date"
                  name="dueDate"
                  defaultValue={dueDate}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  defaultValue={email}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 , bgcolor:'primary.main'}}
              >
                Issue
              </Button>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ position: 'fixed'}}>
         Issue Successfully!
        </Alert>
      </Snackbar>
    </div>
  );
}