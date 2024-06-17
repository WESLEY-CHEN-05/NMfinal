import * as React from 'react';
import { CssBaseline, Box, Button, Card, CardContent, Typography,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import IssueButton from '../components/IssueButton'
import { v4 as uuidv4 } from 'uuid';
import { useBackend } from '../hooks/useBackend';
import { useWebsite } from '../hooks/WebsiteContext';
import RandomDriver from '../components/RandomDriver';

const columns = [
  { field: 'DIDid', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'name',
    width: 150,
  },
  {
    field: 'age',
    headerName: 'age',
    type: 'number',
    width: 150,
    headerAlign: 'left',
    align:'left'
  },
  {
    field: 'time',
    headerName: 'issued time',
    type: 'date',
    width: 110,
  },
  {
    field: 'issued',
    headerName: '發行',
    renderCell: () => (
      <IssueButton issuerDID={'did1'} subjectDID={'did2'}></IssueButton>
    ),
  },
];

const rows = [
  { id: 1, name: '陳奕安', age: 21, time: new Date(2024, 6, 12) },
  { id: 2, name: 'Cersei', age: 31, time: new Date(2013, 2, 1) },
  { id: 3, name: 'Jaime', age: 31, time: new Date(2013, 3, 1) },
  { id: 4, name: 'Arya', age: 11, time: new Date(2013, 12, 1) },
  { id: 5, name: 'Daenerys', age: null, time: new Date(2013, 2, 11) },
  { id: 6, name: null, age: 150, time: new Date(2013, 6, 7) },
  { id: 7, name: 'Ferrara', age: 44, time: new Date(2013, 3, 1) },
  { id: 8, name: 'Rossini', age: 36, time: new Date(2013, 2, 1) },
  { id: 9, name: 'Harvey', age: 65, time: new Date(2013, 2, 1) },
];

export default function DriverData() {
  const { theme } = usePage();
  const { challenge, validateVP } = useBackend();

  const [index, setIndex] = React.useState(1);
  const [object, setObject] = React.useState(rows.find((element) => (element.id === index)));
  const [name, setName] = React.useState(object.name);
  const [issuer, setIssuer] = React.useState(object.index);
  const [issueDate, setIssueDate] = React.useState(object.time.toLocaleDateString());

  const [verificationStatus, setVerificationStatus] = React.useState('unverified');
  const [warningDialog, setWarningDialog] = React.useState(false);
  const [driverIsComing, setDriverIsComing] = React.useState(false);

  const [receivedVP, setReceivedVP] = React.useState('');
  const [receivedFileName, setReceivedFileName] = React.useState('');

  const { presentationJwt, nonce, setNonce, VPValid, setVPValid } = useWebsite();

//   const handleClickOpen = () => {
//     setWarningDialog(true);
//   };

  React.useEffect(() => {
    const newNonce = uuidv4();
    setNonce(newNonce);
  }, [setNonce]);

  const verifyVP = async () => {
    setVerificationStatus('fail to verify');
    validateVP(nonce, receivedVP);
  };

  const handleClose = () => {
    setWarningDialog(false);
  };

  React.useEffect(() => {
    if (VPValid){
      setVerificationStatus('verified');
      setVPValid(false);
    }
  }, [VPValid, setVPValid])

  const book = () => {
    if (verificationStatus !== 'verified') setWarningDialog(true);
    else setDriverIsComing(true);
  }

  const changeDriver = () => {
    setVerificationStatus('unverified');
    if (index === 9) setIndex(1);
    else setIndex(index + 1);
    setObject(rows.find((element) => (element.id === index)));
    setName(object.name);
    setIssuer(object.issuer);
    setIssueDate(object.time.toLocaleDateString());
  }

  const copyToClipboard = () => {
    console.log(nonce);
    navigator.clipboard.writeText(nonce);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setReceivedFileName(file.name); 
    setVerificationStatus('unverified');
    const reader = new FileReader();
    reader.onload = (e) => {
      // remove " "
      setReceivedVP(e.target.result.slice(1, -1));
    };
    reader.onerror = (e) => {
      console.error("Error reading file:", e);
    };
    reader.readAsText(file);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>
      {/* main content */}
      <Container sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

        <Dialog open={warningDialog} onClose={handleClose}>
        <DialogTitle style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)', fontSize: 24, fontWeight: 'bold' }}>Warning</DialogTitle>
        <DialogContent>
            <DialogContentText style={{margin: 25}}>
            You did not verify the driver information, please verify it first.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
        </Dialog>

      <Card sx={{
          width: '80%',
          maxWidth: 600,
          minHeight: 300,
          padding: 4,
          textAlign: 'center',
          boxShadow: 10,
        }}>
          <CardContent>
            <RandomDriver></RandomDriver>
            

            {/* nonce generation */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', textAlign: "left" }}> {"Nonce (send to the driver):"}<br /> {nonce}</Typography>
                <Button 
                    onClick={copyToClipboard} 
                    color="secondary" 
                    variant="contained"
                    size="small"
                    sx={{ marginLeft: 2 }}
                >
                    Copy
                </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
              <Typography variant="body1" style={{ fontSize: '1.2rem' }}>Received VP:</Typography>
              <Button variant="contained" component="label" color="secondary" size="small" sx={{ marginLeft: 2 }}>
                Upload JSON
                <input type="file" hidden accept=".json" onChange={handleFileUpload} />
              </Button>
              <Typography variant="body2" sx={{ marginLeft: 2 }}>
                {receivedFileName}
              </Typography>
            </Box>

            <Typography
              sx={{ marginTop: 2, color: verificationStatus === 'unverified' ? 'grey' : verificationStatus === 'verified' ? 'green' : 'red' }}
            >
              {verificationStatus}
            </Typography>
            {driverIsComing ? 
                <Typography
                    sx={{ fontSize: 18, marginTop: 2, color: verificationStatus === 'unverified' ? 'grey' : verificationStatus === 'verified' ? 'green' : 'red' }}
                >
                    The driver is coming!! Please wait for the driver...
                </Typography>
                :
               <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', gap: '3rem' }}>
                    <Button onClick={verifyVP} color="primary" variant="contained">
                        Verify Info
                    </Button>
                    { 
                        (verificationStatus === 'fail to verify') ? 
                            <Button onClick={changeDriver} color="secondary" variant="contained">
                                Change driver
                            </Button>
                        :
                            <Button onClick={book} color="secondary" variant="contained">
                                Book !
                            </Button>
                    }
                </Box>
            }
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}



// JUNK
// ============== TODO ====================
// const _nonce = "475a7984-1bb5-4c4c-a56f-822bccd46440";
// const _subjectDID = "did:iota:tst:0xae010b9df3261a233ac572246ca98bd098f415cd1b9611129606f17a0111f62e";
// const _subjectPrivateKey = "Q3O9gmepFS6KAl5GpYs2CzZLeacfpZFdKU8JYPdf4Yg";
// const _credentialJwtString = "eyJraWQiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmI2tleS0xIiwidHlwIjoiSldUIiwiYWxnIjoiRWREU0EifQ.eyJpc3MiOiJkaWQ6aW90YTp0c3Q6MHhmZGEyOGJiZjg2MmM5ZWZjYjY3ZDE2Y2E5ODBiMzcwM2QzZWVlODI3ZTgyZDUyZDZhOTc3YTU0NWVjYjJlZjVmIiwibmJmIjoxNzE4MDg5NDIyLCJqdGkiOiJodHRwczovL3d3dy50YWl3YW50YXhpLmNvbS50dy8iLCJzdWIiOiJkaWQ6aW90YTp0c3Q6MHhhZTAxMGI5ZGYzMjYxYTIzM2FjNTcyMjQ2Y2E5OGJkMDk4ZjQxNWNkMWI5NjExMTI5NjA2ZjE3YTAxMTFmNjJlIiwidmMiOnsiQGNvbnRleHQiOiJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSIsInR5cGUiOlsiVmVyaWZpYWJsZUNyZWRlbnRpYWwiLCJUYXhpRHJpdmVyQ3JlZGVudGlhbCJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJsaWNlbnNlIjoiQ2VydGlmaWVkIFRheGkgRHJpdmVyIiwibmFtZSI6Ildlc2xleSBDaGVuIn19fQ.ib8RFBKr6Ydd_BM_25oJ_y42Rz1B0p63nQjL3xDP0EGnV7zqILThDax2VDUQT7CgctxDUUR1mFih4LA8BlFPCQ";

// challenge(_nonce, _subjectDID, _subjectPrivateKey, _credentialJwtString);

// if (check) setVerificationStatus('verified');
// else setVerificationStatus('fail to verify');