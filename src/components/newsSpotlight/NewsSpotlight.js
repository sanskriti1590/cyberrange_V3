import React from 'react';
import { Stack, Typography } from '@mui/material';
import ReactMultiCarousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css'
import NewsCard from "./NewsCard";

const NewsSpotlight = (props) => {
  const { data } = props;
  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
    },
  };

  return (
    <Stack spacing={3} sx={{ width: '100%', borderRadius: '12px', padding: 3, backgroundColor: '#16181F' }}>
      <Typography variant='h2'>News Spotlight</Typography>

      {data.length > 0 ? (
        <ReactMultiCarousel
          // draggable={false}
          // keyBoardControl
          // pauseOnHover={false}
          responsive={responsive}
          slidesToSlide={1}
        // shouldResetAutoplay
        // focusOnSelect={true}
        >
          {data.map((newsItem, index) => (
            <NewsCard key={index} cardData={newsItem} />
          ))}
        </ReactMultiCarousel>
      ) : (
        <Typography variant='h3'>No news available</Typography>
      )}
    </Stack>
  );
};

export default NewsSpotlight;

