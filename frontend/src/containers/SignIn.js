import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, IconButton, CssBaseline, TextField, FormControl, InputLabel, 
  Select, Link, Paper, Box, Grid, Typography, Snackbar, Alert, MenuItem } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from "../Theme";
import { usePage } from '../hooks/usePage';
import taxiImg from '../img/taxi.png'
import { useSignIn } from '../utilities/sign';
//import { usePassword } from '../Utilities/usePassword';

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

export default function SignIn() {
  const { identity, setIdentity, setSignedIn, setUserName } = usePage();
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  const [errorMessage, setErrorMessage] = useState(' ');
  const [wrong, setWrong] = useState(false);
  const [forget, setForget] = useState(false);
  const [emailField,setEmailField] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = {
      identity: data.get('identity'),
      email: data.get('email'),
      password: data.get('password')
    }
    const {state, name, err } = await signIn(info.identity, info.email, info.password);
    if (state === 'success') {
      // setUserEmail(data.get('email'));
      // setUserName(player.name);
      // setUserID(player.ID);
      // localStorage.setItem('userID', player.ID);
      // localStorage.setItem('userName', player.name);
      setIdentity(info.identity);
      setSignedIn(true);
      setUserName(name)
      navigate(location?.state?.prevPath? location.state.prevPath : '/');
    }else {
      setErrorMessage(err);
      setWrong(true);
      console.error(err);
    }
  };

  const handleForget = async() => {
    // console.log(emailField);
    //const {state,err, type, result} = await missPassword(emailField);
    // console.log(state, err, type, result);
    /*
    if(err&&type==='NOTFOUND-PLAYER'){
      setErrorMessage("Account not found!");
      setWrong(true);
      return null;
    }
    // console.log(type==='NOTFOUND-PLAYER')
    
    setForget(true);
    if(err)console.error(err);*/
  }
  // React.useEffect(()=>{

  // },[fpr])
  

  return (
    <ThemeProvider theme={localStorage.getItem('theme mode') === 'dark'? darkTheme : lightTheme}>
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
      <Grid container component="main" sx={{ height: '100vh', backgroundImage: `url(${taxiImg})` }} justifyContent='center' >
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} sx={{opacity:0.97}} square>
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '80%' }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Identity</InputLabel>
                <Select
                  labelId="select-label"
                  id="select"
                  name="identity"
                  label="Identity"
                  value={identity === "passenger" || identity === "driver" || identity === "issuer"? identity:''}
                  onChange={(event) => setIdentity(event.target.value)}
                >
                  <MenuItem value='passenger'>乘客</MenuItem>
                  <MenuItem value='driver'>司機</MenuItem>
                  <MenuItem value='issuer'>發政單位</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={emailField}
                onChange={e=>{setEmailField(e.target.value)}}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 , bgcolor:'primary.main'}}
              >
                Sign In
              </Button>
              <Grid container color='text'>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={handleForget} color="inherit">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item >
                  <Link href="./sign_up" variant="body2" color="inherit" >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} color={"text"}/>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}