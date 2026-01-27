import { Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ startTime, endTime, endGameConsole, setHasCountdownEnded, hasCountdownEnded }) => {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    if (startTime > 0 && endTime > 0) {
      const updateRemainingTime = () => {
        const updatedRemainingTime = calculateRemainingTime();
        setRemainingTime(updatedRemainingTime);
      };

      // Initial call to start the countdown
      updateRemainingTime();
    }
  }, [startTime, endTime, hasCountdownEnded, setHasCountdownEnded, endGameConsole]);

  function calculateRemainingTime() {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    const remainingSeconds = Math.max(0, endTime - currentTimestamp);
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = Math.floor(remainingSeconds % 60);

    return { hours, minutes, seconds };
  }

  const formatTime = (time) => `${String(time).padStart(2, '0')}`;

  if (startTime <= 0 || endTime <= 0) {
    return <div>Data is not valid for countdown.</div>;
  }
  return (
    <div>
      <div>
        <Stack direction="row" gap={2} alignItems='center'>
          <Typography variant='h3'>Time Left:</Typography>
          <Stack direction="row" gap={1}>
            <Typography variant="h1">{formatTime(remainingTime.hours)}:</Typography>
            <Typography variant="h1">{formatTime(remainingTime.minutes)}:</Typography>
            <Typography variant="h1">{formatTime(remainingTime.seconds)}</Typography>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default CountdownTimer;
