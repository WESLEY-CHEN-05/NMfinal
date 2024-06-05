import React from 'react';
import { Typography, Container, CssBaseline, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import FunctionBlock from '../components/FunctionBlock';

function HomePage() {
  const { theme } = usePage();
  const functionBlocks = [
    {title: '租車', to: '/driver_data'},
    {title: '司機資料', to: '/driver_data'},
    {title: '租借紀錄', to: '/history'}
  ]
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>

      {/* main content */}
      <Container sx={{ marginTop: '20px' }}>
        <Typography variant="h2" align='center' gutterBottom>
          Welcome to DID Taxi Service
        </Typography>
        <Typography variant="body1" align='center' gutterBottom>
          Secure and reliable taxi service matching platform using Decentralized Identity (DID).
        </Typography>
        <Grid container spacing={2} sx={{justifyContent: 'space-between', marginTop: '20px'}}>
          {
            functionBlocks.map((block, id) => (
              <Grid key={id} item lg={3} xs={12} align='center'>
                <FunctionBlock 
                  title={block.title} 
                  to={block.to}
                  color={theme.palette.mode==='light'? '#6DE44C':'#1DA14C'}
                />
              </Grid>
            ))
          }
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;