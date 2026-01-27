import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { useEffect } from 'react';
import { useState } from 'react';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));


export default function ProgressBars({endTime,startTime}) {
  const [timeRemaining, setTimeRemaining] = useState(endTime * 1000 - new Date().getTime());

  useEffect(() => {
    const updateRemainingTime = () => {
      const currentTime = new Date().getTime();
      const remaining = Math.max(0, endTime * 1000 - currentTime);
      setTimeRemaining(remaining);
    };

    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const totalDuration = (endTime * 1000) - (startTime * 1000);
  const percentage = ((totalDuration - timeRemaining) / totalDuration) * 100;
   return (
    <Box sx={{ flexGrow: 1 }}>
      
     
      <BorderLinearProgress variant="determinate" value={percentage} color="success"/>
    </Box>
  );
}
