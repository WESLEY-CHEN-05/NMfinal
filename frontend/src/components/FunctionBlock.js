import React from 'react';
import { Typography, CardActionArea, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePage } from '../hooks/usePage';


const FunctionBlock = ({ to, color, image, title, subtitle }) => {
  const { themeMode } = usePage();

  const navigate = useNavigate();
  // console.log(to)
  const styles =  {
    actionArea: {
      width: 250,
      height: 250,
      borderRadius: '15px',
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.1)',  
      },
    },
    card: {
      height: '100%',
      borderRadius: '15px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: `url(${image})`,
      backgroundSize: '100% 100%'
    },
    content: {
        backgroundColor: color,
        width: '34%',
        height: '34%',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
      //fontFamily: 'Keania One',
      fontWeight: 700,
      fontSize: 25,
      width: '100%',
      color: '#1c1c1c',
      textTransform: 'uppercase',
      dispaly: 'flex',
      alignItems: 'center'
    }
  };

  return (
    <CardActionArea sx={styles.actionArea} onClick={() => navigate(to)}>
      <Card sx={styles.card}>
        <CardContent sx={styles.content}>
          <Grid container >
            <Typography sx={styles.title} align='center' variant={'h2'}>
              {title}
            </Typography>
          </Grid>
          <Typography  sx={styles.subtitle}>{subtitle}</Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default FunctionBlock;