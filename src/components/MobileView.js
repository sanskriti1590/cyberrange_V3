import React from 'react'
import { Stack, Typography } from '@mui/material'
import underConstructionImage from '../assests/errorImages/underConstructionImage.svg'

const MobileView = (props) => {

    return (<Stack justifyContent="center" alignItems="center" width="100%" textAlign='center'>
        <img src={underConstructionImage} alt="underConstruction_image" style={{ width: '400px', margin: 0, padding: 0 }} />
        <Typography variant="display1" sx={{ fontSize: '36px', lineHeight: '45px' }}>We're Coming Very soon for mobiles and tablets!</Typography>
        <Typography variant="body1" color="#9C9EA3 !important" mt={1}>we are preparing to serve you better, Get notified when we are
            done.</Typography>
    </Stack>)
}

export default MobileView