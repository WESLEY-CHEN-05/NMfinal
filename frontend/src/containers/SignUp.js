import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, IconButton, CssBaseline, TextField, FormControlLabel, MenuItem,
  Checkbox, Link, Box, Grid, Typography, Container, Snackbar, Alert, FormControl, InputLabel, Select } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from "../Theme";
import { useSignUp } from '../utilities/sign';

//import { useSignUp } from '../Utilities/sign';

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

export default function SignUp() {
  const signUp = useSignUp();
  const navigate = useNavigate();
  //const signUp = useSignUp();
  const [errorMessage, setErrorMessage] = useState('');
  const [wrong, setWrong] = useState(false);
  const [identity, setIdentity] = useState('');
  const [hasDIDField, setHasDIDField] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const info = Object.fromEntries(data.entries());
    if (info.identity === "passenger") info.DIDid = "unused";
    console.log(info)
    if (Object.values(info).some(value => value === "")) {
      setErrorMessage("All fields must be filled!")
      setWrong(true);
      return;
    }
    
    const { state, err } = await signUp(info);
    if (state === 'success') navigate('/sign_in');
    else {
      setErrorMessage(err);
      setWrong(true);
      console.error(err);  
    }
  };

  return (
    <ThemeProvider theme={localStorage.getItem('theme mode') === 'dark'? darkTheme : lightTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar open={wrong} autoHideDuration={2000} onClose={() => setWrong(false)}>
          <Alert onClose={() => setWrong(false)} severity="error" sx={{ position: 'fixed', right: 15, bottom: 15 }}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <Box
          sx={{
            marginTop: 8,
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Identity</InputLabel>
                  <Select
                    labelId="select-label"
                    id="select"
                    name="identity"
                    label="Identity"
                    value={identity}
                    onChange={(event) => {
                      setIdentity(event.target.value);
                      setHasDIDField(event.target.value === 'driver');
                    }}
                  >
                    <MenuItem value='passenger'>乘客</MenuItem>
                    <MenuItem value='driver'>司機</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              {hasDIDField && <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="DIDid"
                  label="DIDid"
                  name="DIDid"
                />
              </Grid>}
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="./sign_in" variant="body2" color="inherit">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}