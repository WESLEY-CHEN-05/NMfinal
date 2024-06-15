import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { usePage } from '../hooks/usePage';
import { useBackend } from '../hooks/useBackend';
import { v4 as uuidv4 } from 'uuid';
import { WebsiteProvider, useWebsite } from '../hooks/WebsiteContext';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
  outline: 'none', // 移除預設框線
};

export default function BasicModal({ issuerDID, subjectDID, name }) {
  const [open, setOpen] = React.useState(false);
  const [passengerOpen, setPassengerOpen] = React.useState(false);
  const [jwtKeyID, setJwtKeyID] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handlePassengerOpen = () => setPassengerOpen(true);


  const { issueVC, sendNonce, challenge } = useBackend();
  const { credentialJwt, presentationJwt, nonce, setNonce } = useWebsite();
  

  const { identity } = usePage();

  const handleIssue = () => {
    console.log(`Issuer: ${issuerDID}, Subject: ${subjectDID}, Name: ${name}, JwtKeyID: ${jwtKeyID}`);
    // issueVC(issuerDID, subjectDID, name, jwtKeyID);
    const _issuerDID = "did:iota:tst:0xfda28bbf862c9efcb67d16ca980b3703d3eee827e82d52d6a977a545ecb2ef5f";
    const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
    const _privateKey = "paL-Ja24J4py_-xzvXXS3mVu53fJSc9VZPSViOTU-p8";
    const _name = "Wesley Chen";
    issueVC(issuerDID, subjectDID, name, jwtKeyID);
    setOpen(false);
  };

  const handleVP = () => {
    const _nonce = uuidv4();
    const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
    const _subjectPrivateKey = "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg";
    const _credentialJwtString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmI2tleS0xIiwidHlwIjoiSldUIiwiYWxnIjoiRWREU0EifQ.eyJpc3MiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmIiwibmJmIjoxNzE4MDg5NDIyLCJqdGkiOiJodHRwczovL3d3dy50YWl3YW50YXhpLmNvbS50dy8iLCJzdWIiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlIiwidmMiOnsiQGNvbnRleHQiOiJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJUYXhpRHJpdmVyQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJsaWNlbnNlIjoiQ2VydGlmaWVkIFRheGkgRHJpdmVyIiwibmFtZSI6Ildlc2xleSBDaGVuIn19fQ.ib8RFBKr6Ydd_BM_25oJ_y42Rz1B0p63nQjL3xDP0EGnV7zqILThDax2VDUQT7CgctxDUUR1mFih4LA8BlFPCQ";

    challenge(_nonce, _subjectDID, _subjectPrivateKey, _credentialJwtString);
  }

  const handleVerify = () => {
    const _nonce = uuidv4();
    const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
    setNonce(_nonce);
    console.log(_nonce);
    setPassengerOpen(false);
  };


  // React.useEffect(() => {
  //   console.log("Nonce:", nonce);
  //   if (identity !== "issuer") setDriverOpen(true);
  // }, [nonce]);

  React.useEffect(() => {
    console.log("Updated credentialJwt:", credentialJwt);
    if (credentialJwt !== "") setOpenSnackbar(true);
    if (identity === "issuer");
    console.log(openSnackbar);
  }, [credentialJwt]);

  
  React.useEffect(() => {
    console.log("Updated presentationJwt:", presentationJwt);
    console.log(presentationJwt);
  }, [presentationJwt]);
  const handleCloseSnackbar = (event, reason) => {
     if (reason === 'clickaway') {
      return;
     }
     setOpenSnackbar(false);
  };

  return (
    <div>
      {identity === 'issuer' ? (
        <Button variant="contained" style={{ backgroundColor: '#D2B48C', color: '#000' }} onClick={handleOpen}>
          Issue
        </Button>
      ) : <></>}
      {/* {identity === 'passenger' ? (
        <Button variant="contained" style={{ backgroundColor: '#D2B48C', color: '#000' }} onClick={handlePassengerOpen}>
          Verify
        </Button>
      ) : <></>} */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2" marginBottom={2} sx={{ fontWeight: 600 }}>
            Issue Credential
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2} sx={{ fontSize: '18px', fontWeight: 400, wordWrap: 'break-word'}}>
            Issuer DID: {issuerDID}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={2} sx={{ fontSize: '18px', fontWeight: 400, wordWrap: 'break-word'}}>
            Subject DID: {subjectDID}
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2" marginBottom={3} sx={{ fontSize: '18px', fontWeight: 400}}>
            Subject Name: {name}
          </Typography>

          { (identity === 'issuer') ?
            <>
              <TextField
                label="JwtKey"
                variant="outlined"
                fullWidth
                value={jwtKeyID}
                onChange={(e) => setJwtKeyID(e.target.value)}
                margin="normal"
                style={{ marginBottom: '24px' }} // 增加更多空間
              />
              <Button variant="contained" color="secondary" onClick={handleIssue} fullWidth>
                Issue
              </Button> 
            </>
            :
            <></>
          }
          {/* { (identity === 'driver') ?
            <Button variant="contained" color="secondary" onClick={handleVP} fullWidth>
              Generate VP
            </Button> 
            :
            <></>
          }
          { (identity === 'passenger') ?
            <Button variant="contained" color="secondary" onClick={handleVerify} fullWidth>
              Verify
            </Button> 
            :
            <></>
          } */}
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