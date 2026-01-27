import React from 'react';
import { Stack, Typography } from '@mui/material';
import { Icons } from '../icons';
import Box from "@mui/material/Box";

const NewsCard = (props) => {
  const { cardData } = props;

  const {
    source: newsSource,
    title: newsTitle,
    description: newsDescription,
    url: newsUrl,
    urlToImage: newsImage,
    publishedAt: newsPublishedAt,
  } = cardData;

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  };

  return (
    <Stack direction='column' alignItems='flex-start' spacing={2} mx={2}
      onClick={() => window.open(newsUrl, '_blank')}
      sx={{ cursor: 'pointer' }}>
      <img src={newsImage} alt='' style={{ borderRadius: '12px', width: '100%', aspectRatio: 2 }} />
      <Stack direction='row' justifyContent='space-between' alignItems='center' width='100%'>
        <Box sx={{
          padding: '4px 12px',
          borderRadius: '6px',
          backgroundColor: '#6F727A33',
          color: '#EAEAEB'
        }}>
          <Typography variant='body2'>{newsSource?.name}</Typography>
        </Box>
        <Stack direction='row' justifyContent='center' alignItems='center' sx={{ color: '#6F727A !important' }}>
          <Icons.calendar />
          <Typography variant='body2'
            sx={{ marginLeft: '5px', color: '#EAEAEB !important' }}>{formatDate(newsPublishedAt)}</Typography>
        </Stack>
      </Stack>
      <Typography variant='body1' sx={{ cursor: 'pointer', textAlign: 'justify' }}>{newsTitle}</Typography>
      <Typography variant='h5' sx={{ color: '#6F727A !important', textAlign: 'justify' }}>
        {newsDescription?.substring(0, 250) + '...'}
      </Typography>
    </Stack>
  );
};

export default NewsCard;