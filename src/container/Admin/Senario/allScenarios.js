import React from 'react'
import { Stack } from '@mui/material'
import ScenarioUnApproval from './ScenarioUnApproval'
import ScenarioApproval from './SceanrioApproval'

const AllScenarios = () => {
  return (<Stack direction="row" height="100vh" width="100%" justifyContent="space-evenly" alignItems="center">
    <ScenarioApproval/>
    <ScenarioUnApproval/>
  </Stack>)
}

export default AllScenarios
