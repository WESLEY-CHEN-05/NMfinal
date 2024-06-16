import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import { Button, IconButton, CssBaseline, TextField, 
  Link, Paper, Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material/styles';
import taxiImg from '../img/taxi.png'
import { useApply } from '../utilities/apply';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Chwejislewd
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { theme } = usePage();
  const location = useLocation();
  const apply = useApply();
  const [errorMessage, setErrorMessage] = useState(' ');
  const [wrong, setWrong] = useState(false);
  const [forget, setForget] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = Object.fromEntries(data.entries());
    info.dueDate = selectedDate.format('YYYY-MM-DD');
    console.log(info)
    
    const {state, result, err } = await apply(info);
    if (state === 'success') {
      console.log(result)
      navigate(location?.state?.prevPath? location.state.prevPath : '/');
    }else {
      setErrorMessage(err);
      setWrong(true);
      console.error(err);
    }
  };  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>
      {/* main content */}
      <Snackbar open={forget} autoHideDuration={2000} onClose={() => setForget(false)}>
        <Alert onClose={() => setForget(false)} severity="info" sx={{ position: 'fixed', right: 15, bottom: 15 }}>
          The message has been sent to the developers. They may set and send a new password to you. 
        </Alert>
      </Snackbar>
      <Snackbar open={wrong} autoHideDuration={2000} onClose={() => setWrong(false)}>
        <Alert onClose={() => setWrong(false)} severity="error" sx={{ position: 'fixed', right: 15, bottom: 15 }}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <CssBaseline />
      <Grid container component="main" sx={{ height: '100vh', backgroundImage: `url(${taxiImg})`}} justifyContent='center' >
        <Grid item xs={12} sm={8} md={5} mt='30px' component={Paper} elevation={6} sx={{opacity:0.97}} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <IconButton 
              sx={{position: 'fixed', right:20, top: 20, boxShadow: 3, bgcolor: 'white', 
              '&:hover': {
                bgcolor: 'white',
                opacity: 0.8,
              }, }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon sx={{color: 'black'}}/>
            </IconButton>
            <Typography component="h1" variant="h5" mb="20px">
              VC Application Form 
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '80%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="DIDid"
                    label="DID id"
                    name="DIDid"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="licenseNumber"
                    label="license Number"
                    name="licenseNumber"
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker 
                      sx={{width: "100%"}}
                      label="license Due Date"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 , bgcolor:'primary.main'}}
              >
                Submit
              </Button>
              
              <Copyright sx={{ mt: 5 }} color={"text"}/>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}