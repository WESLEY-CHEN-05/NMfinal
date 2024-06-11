import * as React from 'react';
import { CssBaseline, Box, Button, Card, CardContent, Typography,
    Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import IssueButton from '../components/IssueButton'
import { v4 as uuidv4 } from 'uuid';

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
  { id: 1, name: 'Jofffn', age: 14, time: new Date(2013, 2, 1) },
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

  const [index, setIndex] = React.useState(1);
  const [object, setObject] = React.useState(rows.find((element) => (element.id === index)));
  const [name, setName] = React.useState(object.name);
  const [issuer, setIssuer] = React.useState(object.index);
  const [issueDate, setIssueDate] = React.useState(object.time.toLocaleDateString());

  const [verificationStatus, setVerificationStatus] = React.useState('unverified');
  const [warningDialog, setWarningDialog] = React.useState(false);
  const [driverIsComing, setDriverIsComing] = React.useState(false);

//   const handleClickOpen = () => {
//     setWarningDialog(true);
//   };

  const handleClose = () => {
    setWarningDialog(false);
  };

  const verifyVP = async () => {
    // ============== TODO ====================
    const nonce = uuidv4();

    // send nonce to the server and then get the corresponding jwkString,
    const jwkString = "DD";

    // const check = await validate(nonce, jwkString);
    const check = true;
    // ============== TODO ====================
    
    if (check) setVerificationStatus('verified');
    else setVerificationStatus('fail to verify');
  };

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
            <Typography variant="h5" gutterBottom style={{ fontSize: '2rem' }}>Driver Info</Typography>
            <Typography variant="body1" style={{ fontSize: '1.2rem' }}>Name: {name}</Typography>
            <Typography variant="body1" style={{ fontSize: '1.2rem' }}>Issuer: {issuer}</Typography>
            <Typography variant="body1" style={{ fontSize: '1.2rem' }}>Issue Date: {issueDate}</Typography>
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