import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { makeStyles } from '@material-ui/core';
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './index.css'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);


const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1
  },
  dot: {
    backgroundColor: "#112228",
    fontSize: 'xx-large'
  },
  dotActive: {
    backgroundColor: "#00ffff"
  },
  stack: {
    transition: 'transform 0.3s',
    overflow: 'hidden', // Add a smooth transition effect

    '&:hover': {
      transform: 'scale(1.05)',
      display: 'block'
    },
  },
});

function Carsoul({ challenges }) {
  const theme = useTheme();
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = challenges.length;
  const classes = useStyles();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };


  const handleChange = (id, game_type) => {
    if (game_type === 'ctf') {
      navigate(`/categories/gameDetails/${id}`, { state: { id: id } })
      return;
    }
    navigate(`/squad/scenarioDetails/${id}`, { state: { from: id } })

  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };


  return (
    <Box sx={{ width: "100%", flexGrow: 1, borderRadius: '12px' }}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {challenges.map((step, index) => (
          <div key={step.label} style={{ borderRadius: '12px' }}>
            {Math.abs(activeStep - index) <= 2 ? (
              <Stack sx={{ position: 'relative', overflow: 'hidden', borderRadius: '12px' }}>
                <Box
                  component="img"
                  sx={{
                    aspectRatio: 3
                  }}
                  className={classes.stack}
                  src={step.challenge_thumbnail}
                  alt={step.label}
                  onClick={() => handleChange(step.ctf_or_scenario_id, step.game_type)}
                />
              </Stack>
            ) : <Typography>No Data!!!</Typography>
            }
          </div>
        ))}
      </AutoPlaySwipeableViews>
      {/*<Stack style={{width: '100%', alignItems: 'center'}}>*/}
      {/*  <MobileStepper*/}
      {/*    sx={{cursor: 'pointer'}}*/}
      {/*    steps={maxSteps}*/}
      {/*    position="static"*/}
      {/*    variant='dots'*/}
      {/*    activeStep={activeStep}*/}
      {/*    classes={{*/}
      {/*      root: classes.root,*/}
      {/*      dot: classes.dot,*/}
      {/*      dotActive: classes.dotActive*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Stack>*/}
    </Box>
  );
}

export default Carsoul;