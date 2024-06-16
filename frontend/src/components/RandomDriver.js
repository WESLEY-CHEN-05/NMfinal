import { useState, useEffect} from "react";
import { GET_RANDOM_DRIVER } from "../graphql/query";
import { useQuery } from "@apollo/client";
import { Button, IconButton, CssBaseline, TextField, 
  Link, Paper, Box, Grid, Typography, Snackbar, Alert } from '@mui/material';

const RandomDriver = () => {
  const { loading, error, data } = useQuery(GET_RANDOM_DRIVER);
  const [driverInfo, setDriverInfo] = useState({});
  useEffect(() => {
    console.log(data?.getRandomDriver);
    if (data?.getRandomDriver) setDriverInfo(data?.getRandomDriver);
  }, [data])
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
          <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <Typography variant="h5" component="h2" marginBottom={2} >
                  Driver's Info
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="subjectDIDid"
                  label="DID id"
                  name="subjectDIDid"
                  value={driverInfo.DIDid}
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
                  value={driverInfo.name}
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
                  value={driverInfo.licenseNumber}
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
                  value={driverInfo.dueDate}
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
                  value={driverInfo.email}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Box>
  )
}

export default RandomDriver