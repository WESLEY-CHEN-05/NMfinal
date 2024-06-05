import React from 'react';
import Color from 'color';
import { Typography, CardActionArea, Card, CardContent, CardMedia, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePage } from '../hooks/usePage';

const FunctionBlock = ({ to, color, image, title, subtitle }) => {
  const { themeMode } = usePage();

  const navigate = useNavigate();
  // console.log(to)
  const styles =  {
    actionArea: {
      width: 200,
      height: 200,
      borderRadius: '50%',
      transition: '0.2s',
      '&:hover': {
        transform: 'scale(1.1)',  
      },
    },
    card: {
      width: 200,
      height: 200,
      borderRadius: '50%',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: `0 6px 12px 0 ${Color(color)
          .rotate(-12)
          .darken(0.2)
          .fade(0.5)}`,
      },
    },
    media: {
      height: 300
    },
    content: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color,
      padding: '1.5rem 2rem 2rem',
    },
    title: {
      //fontFamily: 'Keania One',
      fontWeight: 700,
      fontSize: 30,
      color: themeMode === 'dark'?'#e9e9e8':'#1c1c1c',
      textTransform: 'uppercase',
    },
    subtitle: {
      //fontFamily: 'Montserrat',
      color: themeMode === 'dark'?'#e9e9e8':'#1c1c1c',
      opacity: 0.87,
      marginTop: '5vh',
      fontWeight: themeMode === 'dark'? 500:700,
      fontSize: '1.25vw',
      lineHeight: 2,
    },
  };

  return (
    <CardActionArea sx={styles.actionArea} onClick={() => navigate(to)}>
      <Card sx={styles.card}>
        <CardContent sx={styles.content}>
          <Typography sx={styles.title} variant={'h2'}>
            {title}
          </Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};

export default FunctionBlock;