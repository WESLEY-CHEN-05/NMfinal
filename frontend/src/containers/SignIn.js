import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, Button, IconButton, CssBaseline, TextField, FormControlLabel, 
  Checkbox, Link, Paper, Box, Grid, Typography, Snackbar, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from "../Theme";
import { usePage } from '../hooks/usePage';
//import { useSignIn } from '../Utilities/sign';
//import { usePassword } from '../Utilities/usePassword';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignInSide() {
  const { setUserName, setUserID, setSignedIn, setUserEmail } = usePage();
  const navigate = useNavigate();
  const location = useLocation();
  ///const signIn = useSignIn();
  const [errorMessage, setErrorMessage] = useState(' ');
  const [wrong, setWrong] = useState(false);
  const [forget, setForget] = useState(false);
  const [emailField,setEmailField] = useState("");

  //const {missPassword} = usePassword();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    /*
    const {state, player, err, type} = await signIn(data.get('email'), data.get('password'));
    if (state === 'success') {
      setUserEmail(data.get('email'));
      setUserName(player.name);
      setUserID(player.ID);
      localStorage.setItem('userID', player.ID);
      localStorage.setItem('userName', player.name);
      setSignedIn(true);
      navigate(location?.state?.prevPath? location.state.prevPath : '/homepage');
    }else if (type === 'NOTFOUND-PLAYER') {
      setErrorMessage("Account not found!");
      setWrong(true);
    }else if (type === 'PASSWORD-ERROR') {
      setErrorMessage('Wrong password!');
      setWrong(true);
    }else console.error(err);*/
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
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
              sx={{position: 'fixed', right:20, top: 20, boxShadow: 3 }}
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" onClick={handleForget}>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="./sign_up" variant="body2">
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