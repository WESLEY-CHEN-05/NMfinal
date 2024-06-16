import React from 'react';
import { Typography, Container, CssBaseline, Grid, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { usePage } from '../hooks/usePage';
import CustomizedAppBar from '../components/CustomizedAppBar';
import FunctionBlock from '../components/FunctionBlock';
import carRentalImg from '../img/car_rental.jpg'
import carRentalImg2 from '../img/car_rental2.jpg'
import driverDataImg from '../img/driver_data.png'
import driverDataImg2 from '../img/driver_data2.png'
import rentalRecordImg from '../img/rental_record.png'
import rentalRecordImg2 from '../img/rental_record2.png'

function HomePage() {
  const { theme } = usePage();
  const functionBlocks = [
    {title: '租車', to: '/rent', image: carRentalImg2, info: "For Passenger"},
    {title: '司機\n資料', to: '/driver_data', image: driverDataImg2, info: "For Everyone"},
    {title: 'ＶＣ\n申請', to: '/apply_VC', image: rentalRecordImg2, info: "For Driver"}
  ]
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* top */}
      <CustomizedAppBar/>

      {/* main content */}
      <Container maxWidth='md' sx={{ marginTop: '80px' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '80vh',
            width: '100%'
          }}
        >
          <Typography variant="h1" sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            marginTop: '30px' 
          }} gutterBottom>
            Welcome to TrustRide.
          </Typography>
          <Typography variant="h4" align='center' sx={{color: 'secondary.main'}} gutterBottom>
            A secure and reliable taxi service matching platform. 
            {/* using Decentralized Identity (DID). */}
          </Typography>
          <Grid container spacing={1} sx={{justifyContent: 'space-between', marginTop: '15px'}}>
            {
              functionBlocks.map((block, id) => (
                <Grid key={id} item lg={3} xs={12} align='center'>
                  <Box > {/* Center the content */}
                    <Typography variant="h5" align='center' m='15px' sx={{fontWeight: 'bold', width: '100%'}}>{block.info}</Typography>
                    <FunctionBlock 
                      title={block.title} 
                      to={block.to}
                      image={block.image}
                      color={'transparent'}
                    />
                  </Box>            
                </Grid>
              ))
            }
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;